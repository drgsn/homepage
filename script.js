// Initialize dayjs relative time plugin
dayjs.extend(dayjs_plugin_relativeTime);

// Sources configuration
const sourcesConfig = [
    {
        id: 'github',
        label: 'GitHub',
        icon: '<i class="fa-brands fa-github text-gray-600 dark:text-gray-300 mr-1"></i>',
        defaultSettings: {
            enabled: true,
            timePeriod: 'daily',
            language: '',
            page: 1,
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable GitHub?',
            },
            {
                type: 'select',
                key: 'timePeriod',
                label: 'Time Period',
                options: ['daily', 'weekly', 'monthly'],
            },
            {
                type: 'text',
                key: 'language',
                label: 'Language(s)',
                placeholder: 'e.g. javascript, python',
            },
        ],
        fetchFn: async function (settings) {
            const languages = settings.language
                .split(',')
                .map((lang) => lang.trim().toLowerCase())
                .filter(Boolean);

            const fetchPromises = languages.length > 0 ? languages : [null];

            const allItems = await Promise.all(
                fetchPromises.map(async (language) => {
                    const { url, headers } = buildGitHubSearchUrl(settings, language);
                    const resp = await fetch(url, { headers });
                    const data = await resp.json();
                    return data.items || [];
                })
            );

            // Increment the page for the next fetch
            settings.page += 1;

            // Flatten the array of arrays and return
            return allItems.flat();
        },
        transformItemFn: function (repo) {
            return {
                source: 'GitHub',
                title: repo.full_name,
                url: repo.html_url,
                date: new Date(repo.created_at),
                imageUrl: repo.owner?.avatar_url || '',
                stats: {
                    stars: repo.stargazers_count,
                    issues: repo.open_issues_count,
                    forks: repo.forks_count,
                },
            };
        },
        isLoading: false,
    },
    {
        id: 'hackernews',
        label: 'Hacker News',
        icon: '<i class="fa-brands fa-hacker-news text-orange-600 dark:text-orange-300 mr-1"></i>',
        defaultSettings: {
            enabled: true,
            type: 'top',
            minPoints: 0,
            ids: [],
            index: 0,
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Hacker News?',
            },
            {
                type: 'select',
                key: 'type',
                label: 'Story Type',
                options: ['top', 'new', 'best'],
            },
            {
                type: 'number',
                key: 'minPoints',
                label: 'Minimum Points',
                placeholder: 'e.g. 100',
            },
        ],
        fetchFn: async function (settings) {
            const startIndex = settings.index;
            const endIndex = startIndex + 10;
            const slice = settings.ids.slice(startIndex, endIndex);

            const stories = await Promise.all(
                slice.map(async (id) => {
                    const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
                    const storyResp = await fetch(storyUrl);
                    return storyResp.json();
                })
            );

            settings.index = endIndex;
            return stories;
        },
        transformItemFn: function (story) {
            return {
                source: 'HackerNews',
                title: story.title,
                url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
                date: new Date(story.time * 1000),
                imageUrl: '',
                stats: {
                    points: story.score,
                    comments: story.descendants || 0,
                },
            };
        },
        isLoading: false,
    },
    {
        id: 'devto',
        label: 'Dev.to',
        icon: '<i class="fa-brands fa-dev text-green-600 dark:text-green-300 mr-1"></i>',
        defaultSettings: {
            enabled: true,
            sort: 'recent',
            tag: '',
            page: 1,
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Dev.to?',
            },
            {
                type: 'select',
                key: 'sort',
                label: 'Sort By',
                options: ['recent', 'rising', 'relevant'],
            },
            {
                type: 'text',
                key: 'tag',
                label: 'Tag',
                placeholder: 'e.g. react',
            },
        ],
        fetchFn: async function (settings) {
            let url = `https://dev.to/api/articles?per_page=10&page=${settings.page}`;
            if (settings.tag) {
                url += `&tag=${settings.tag}`;
            }
            switch (settings.sort) {
                case 'rising':
                    url += '&top=7';
                    break;
                case 'relevant':
                    url += '&top=30';
                    break;
            }
            const resp = await fetch(url);
            return await resp.json();
        },
        transformItemFn: function (article) {
            return {
                source: 'Dev.to',
                title: article.title,
                url: article.url,
                date: new Date(article.published_at),
                imageUrl: article.cover_image || '',
                stats: {
                    reactions: article.public_reactions_count,
                    comments: article.comments_count,
                },
            };
        },
        isLoading: false,
    },
];

// Global state
let sourcesSettings = {};
let allItems = [];
let observer = null;

// Theme management
function loadThemePreference() {
    const storedTheme = localStorage.getItem('mergedFeedTheme') || 'light';
    const isDark = storedTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    updateThemeIcon(isDark);
}

function saveThemePreference(isDark) {
    localStorage.setItem('mergedFeedTheme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// Filters modal management
function buildFiltersModal() {
    const modalContent = document.getElementById('filtersModalContent');
    modalContent.innerHTML = '';

    const storedTheme = localStorage.getItem('mergedFeedTheme') || 'light';
    const isDark = storedTheme === 'dark';

    sourcesConfig.forEach((source) => {
        const section = document.createElement('div');
        section.className = isDark
            ? 'bg-gray-700 p-4 rounded-lg space-y-4'
            : 'bg-gray-50 p-4 rounded-lg space-y-4';

        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-4';

        const title = document.createElement('h3');
        title.className = isDark
            ? 'text-md font-semibold text-black-200 flex items-center'
            : 'text-md font-semibold text-gray-900 flex items-center';
        title.innerHTML = `${source.icon}${source.label} Settings`;

        header.appendChild(title);

        const enabledField = source.fields.find((f) => f.key === 'enabled');
        if (enabledField) {
            const toggle = createToggleSwitch(source.id, enabledField);
            header.appendChild(toggle);
        }

        section.appendChild(header);

        source.fields.forEach((field) => {
            if (field.key === 'enabled') return;
            const fieldElement = createFilterField(source.id, field);
            section.appendChild(fieldElement);
        });

        modalContent.appendChild(section);
    });
}

function createToggleSwitch(sourceId, field) {
    const label = document.createElement('label');
    label.className = 'relative inline-flex items-center cursor-pointer';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'sr-only peer';
    input.id = `${sourceId}_${field.key}`;

    const slider = document.createElement('div');
    slider.className =
        'w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600';

    label.appendChild(input);
    label.appendChild(slider);

    return label;
}

function createFilterField(sourceId, field) {
    const storedTheme = localStorage.getItem('mergedFeedTheme') || 'light';
    const isDark = storedTheme === 'dark';

    const container = document.createElement('div');
    container.className = 'space-y-2';

    const label = document.createElement('label');
    label.className = isDark
        ? 'block text-sm font-medium text-gray-300'
        : 'block text-sm font-medium text-gray-700';
    label.htmlFor = `${sourceId}_${field.key}`;
    label.textContent = field.label;

    let input;

    if (field.type === 'select') {
        input = document.createElement('select');
        input.className = 'theme-select';
        input.id = `${sourceId}_${field.key}`;

        field.options.forEach((opt) => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
            input.appendChild(option);
        });
    } else {
        input = document.createElement('input');
        input.type = field.type;
        input.className = 'theme-input';
        input.id = `${sourceId}_${field.key}`;
        if (field.placeholder) {
            input.placeholder = field.placeholder;
        }
    }

    container.appendChild(label);
    container.appendChild(input);

    return container;
}

// Feed rendering
function createCard(item) {
    const card = document.createElement('article');
    card.className = `
        mb-6 inline-block w-full 
        rounded-xl border shadow-sm
        theme-card p-5
    `;

    const imageHtml = item.imageUrl
        ? `<div class="relative overflow-hidden rounded-lg mb-4 aspect-video">
            <img
                src="${item.imageUrl}"
                alt="${item.title}"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onerror="this.parentElement.style.display='none';"
            />
           </div>`
        : '';

    const statsHtml = renderStats(item);

    card.innerHTML = `
        <div class="flex items-center mb-3 text-sm font-medium">
            ${getSourceIcon(item.source)}
            <span class="opacity-90">${item.source}</span>
        </div>

        ${imageHtml}

        <a href="${item.url}" 
           target="_blank"
           class="block font-semibold text-lg mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            ${item.title}
        </a>

        <div class="flex flex-col space-y-3">
            <div class="text-sm text-gray-500 dark:text-gray-400">
                ${dayjs(item.date).fromNow()}
            </div>
            ${statsHtml}
        </div>
    `;

    return card;
}

function renderStats(item) {
    const baseClasses = 'flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400';
    const iconClasses = 'text-blue-500 dark:text-blue-400';

    switch (item.source) {
        case 'GitHub':
            return `
                <div class="${baseClasses}">
                    <span title="Stars" class="flex items-center">
                        <i class="fa-regular fa-star ${iconClasses} mr-2"></i>${item.stats.stars.toLocaleString()}
                    </span>
                    <span title="Issues" class="flex items-center">
                        <i class="fa-regular fa-circle-dot ${iconClasses} mr-2"></i>${item.stats.issues.toLocaleString()}
                    </span>
                    <span title="Forks" class="flex items-center">
                        <i class="fa-solid fa-code-fork ${iconClasses} mr-2"></i>${item.stats.forks.toLocaleString()}
                    </span>
                </div>`;
        case 'HackerNews':
            return `
                <div class="${baseClasses}">
                    <span title="Points" class="flex items-center">
                        <i class="fa-solid fa-arrow-up ${iconClasses} mr-2"></i>${item.stats.points.toLocaleString()}
                    </span>
                    <span title="Comments" class="flex items-center">
                        <i class="fa-regular fa-comment ${iconClasses} mr-2"></i>${item.stats.comments.toLocaleString()}
                    </span>
                </div>`;
        case 'Dev.to':
            return `
                <div class="${baseClasses}">
                    <span title="Reactions" class="flex items-center">
                        <i class="fa-regular fa-heart ${iconClasses} mr-2"></i>${item.stats.reactions.toLocaleString()}
                    </span>
                    <span title="Comments" class="flex items-center">
                        <i class="fa-regular fa-comment ${iconClasses} mr-2"></i>${item.stats.comments.toLocaleString()}
                    </span>
                </div>`;
        default:
            return '';
    }
}

function getSourceIcon(sourceName) {
    const source = sourcesConfig.find(
        (src) => src.label.toLowerCase() === sourceName.toLowerCase()
    );
    return source ? source.icon : '';
}

// Infinite scroll
function setupIntersectionObserver() {
    const sentinel = document.getElementById('infiniteScrollTrigger');
    observer = new IntersectionObserver(
        async (entries) => {
            if (entries[0].isIntersecting) {
                await fetchAllEnabledSources();
                renderMergedFeed();
            }
        },
        {
            rootMargin: '0px',
            threshold: 1.0,
        }
    );
    observer.observe(sentinel);
}

// Data fetching
async function maybeFetchHackerNewsIDs() {
    const hackerNewsSettings = sourcesSettings.hackernews;
    if (!hackerNewsSettings?.enabled) return;

    if (!hackerNewsSettings.ids || hackerNewsSettings.ids.length === 0) {
        const url = `https://hacker-news.firebaseio.com/v0/${hackerNewsSettings.type}stories.json`;
        const response = await fetch(url);
        const ids = await response.json();
        hackerNewsSettings.ids = ids;
        hackerNewsSettings.index = 0;
    }
}

async function fetchAllEnabledSources() {
    const fetchPromises = sourcesConfig
        .filter((source) => sourcesSettings[source.id]?.enabled && !source.isLoading)
        .map(async (source) => {
            try {
                source.isLoading = true;
                const items = await source.fetchFn(sourcesSettings[source.id]);

                if (items.length === 0) {
                    // No more items to fetch for this source
                    return;
                }

                const transformedItems = items
                    .filter((item) => item) // Filter out null/undefined items
                    .map((item) => source.transformItemFn(item));

                // Filter out duplicates
                const newItems = transformedItems.filter((newItem) => {
                    return !allItems.some((existingItem) => existingItem.url === newItem.url);
                });

                allItems.push(...newItems);
            } catch (error) {
                console.error(`Error fetching from ${source.label}:`, error);
            } finally {
                source.isLoading = false;
            }
        });

    await Promise.all(fetchPromises);
}

// Feed management
async function initData() {
    await maybeFetchHackerNewsIDs();
    await fetchAllEnabledSources();
    renderMergedFeed();
}

function renderMergedFeed() {
    const container = document.getElementById('feedContainer');
    container.innerHTML = '';

    // Sort items by date in descending order (newest first)
    allItems.sort((a, b) => b.date - a.date);

    // Render each item
    allItems.forEach((item) => {
        container.appendChild(createCard(item));
    });

    // Show loading indicator if any source is still loading
    const isLoading = sourcesConfig.some((source) => source.isLoading);
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}

// Settings management
function loadSettings() {
    const storedSettings = localStorage.getItem('mergedFeedSettings');
    if (storedSettings) {
        sourcesSettings = JSON.parse(storedSettings);
    } else {
        // Initialize default settings for each source
        sourcesConfig.forEach((source) => {
            sourcesSettings[source.id] = { ...source.defaultSettings };
        });
        saveSettings();
    }
}

function saveSettings() {
    localStorage.setItem('mergedFeedSettings', JSON.stringify(sourcesSettings));
}

function applyFilters() {
    // Update settings from form values
    sourcesConfig.forEach((source) => {
        const settings = {};
        source.fields.forEach((field) => {
            const input = document.getElementById(`${source.id}_${field.key}`);
            if (input) {
                settings[field.key] = field.type === 'checkbox' ? input.checked : input.value;
            }
        });
        sourcesSettings[source.id] = settings;
    });

    saveSettings();
    resetAndRefetch();
    closeFiltersModal();
}

async function resetAndRefetch() {
    allItems = []; // Clear the existing items
    sourcesConfig.forEach((source) => {
        if (source.id === 'hackernews') {
            sourcesSettings[source.id].index = 0; // Reset Hacker News index
        } else {
            sourcesSettings[source.id].page = 1; // Reset GitHub and Dev.to page
        }
    });
    await initData(); // Fetch new data
}

function openFiltersModal() {
    buildFiltersModal();
    // Set current values
    sourcesConfig.forEach((source) => {
        const settings = sourcesSettings[source.id] || { ...source.defaultSettings };
        source.fields.forEach((field) => {
            const input = document.getElementById(`${source.id}_${field.key}`);
            if (input) {
                if (field.type === 'checkbox') {
                    input.checked = settings[field.key];
                } else {
                    input.value = settings[field.key] || '';
                }
            }
        });
    });

    const modal = document.getElementById('filtersModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('modal-active'), 10);
}

function closeFiltersModal() {
    const modal = document.getElementById('filtersModal');
    modal.classList.remove('modal-active');
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 250);
}

function handleScroll() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (window.scrollY > 500) {
        scrollBtn.classList.remove('hidden');
    } else {
        scrollBtn.classList.add('hidden');
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    loadThemePreference();
    loadSettings();
    await initData();
    setupIntersectionObserver();

    // Setup theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        saveThemePreference(!isDark);
    });

    // Setup other UI elements
    document.getElementById('refreshButton').addEventListener('click', resetAndRefetch);
    document.getElementById('openFilters').addEventListener('click', openFiltersModal);
    document.getElementById('closeFilters').addEventListener('click', closeFiltersModal);
    document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
    document.getElementById('cancelFiltersBtn').addEventListener('click', closeFiltersModal);

    // Setup scroll to top
    window.addEventListener('scroll', handleScroll);
    document.getElementById('scrollToTopBtn').addEventListener('click', scrollToTop);
});

// Helper functions
function buildGitHubSearchUrl(settings, language) {
    const baseUrl = 'https://api.github.com/search/repositories';
    const perPage = 10; // Number of items per page
    const queryParams = new URLSearchParams();

    // Ensure page is a valid number
    const page = parseInt(settings.page) || 1;

    // Build the query parts
    const queryParts = [];
    const now = new Date();

    // Get date range based on time period
    const dateRange = (() => {
        const endDate = new Date(now);
        const startDate = new Date(now);

        switch (settings.timePeriod) {
            case 'monthly':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case 'weekly':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'daily':
            default:
                startDate.setDate(startDate.getDate() - 1);
        }

        return `created:${startDate.toISOString().split('T')[0]}..${
            endDate.toISOString().split('T')[0]
        }`;
    })();
    queryParts.push(dateRange);

    // Add language filter if specified
    if (language) {
        queryParts.push(`language:${language}`);
    }

    // Add base filters
    queryParts.push('is:public'); // Only public repositories
    queryParts.push('archived:false'); // Exclude archived repositories

    // Join all parts with space to create the final query
    const query = queryParts.join(' ');

    // Set query parameters
    queryParams.set('q', query);
    queryParams.set('sort', 'stars');
    queryParams.set('order', 'desc');
    queryParams.set('page', page);
    queryParams.set('per_page', perPage);

    // Add headers for API version
    const headers = {
        Accept: 'application/vnd.github.v3+json', // Specify API version
    };

    return {
        url: `${baseUrl}?${queryParams.toString()}`,
        headers: headers,
    };
}
