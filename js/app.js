import { Card } from './components/Card.js';
import { FiltersModal } from './components/FiltersModal.js';
import { MAX_CACHED_ARTICLES, STORAGE_KEYS } from './config/constants.js';
import { sourcesConfig } from './config/sourceConfig.js';
import { DevToApi } from './services/api/devToApi.js';
import { GitHubApi } from './services/api/githubApi.js';
import { HackerNewsApi } from './services/api/hackerNewsApi.js';
import { RssApi } from './services/api/RssApi.js';
import { StorageService } from './services/storageService.js';
import { ThemeService } from './services/themeService.js';

export class App {
    constructor() {
        this.allItems = [];
        this.sourcesSettings = {};
        this.observer = null;
        this.isLoading = false;
        this.currentFetchController = null;
        this.debounceTimeout = null;
    }

    async init() {
        try {
            this.loadInitialSettings();
            await this.initData();
            this.setupIntersectionObserver();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize application');
        }
    }

    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.currentFetchController) {
            this.currentFetchController.abort();
        }
        clearTimeout(this.debounceTimeout);
    }

    loadInitialSettings() {
        ThemeService.loadTheme();
        this.loadSettings();
        this.focusSearchInput();
    }

    focusSearchInput() {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }, 100);
    }

    loadSettings() {
        const storedSettings = StorageService.loadSettings();
        if (storedSettings) {
            this.sourcesSettings = storedSettings;
        } else {
            this.initializeDefaultSettings();
        }
    }

    initializeDefaultSettings() {
        sourcesConfig.forEach((source) => {
            this.sourcesSettings[source.id] = { ...source.defaultSettings };
        });
        StorageService.saveSettings(this.sourcesSettings);
    }

    async initData() {
        try {
            // 1. First, immediately load and display cached content
            const cachedArticles = StorageService.loadArticles();
            if (cachedArticles) {
                this.allItems = cachedArticles;
                this.renderFeed();
            }

            // 2. Then start background fetches
            this.fetchAllSourcesInBackground();
        } catch (error) {
            console.error('Error initializing data:', error);
            this.showError('Failed to load initial data');
        }
    }

    async fetchAllSourcesInBackground() {
        // Start with main sources that typically have faster APIs
        const mainSourcesPromise = this.fetchMainSources();

        // Fetch RSS feeds separately to not block the main sources
        const rssSourcesPromise = this.fetchRssSources();

        try {
            // Wait for main sources first
            const mainResults = await mainSourcesPromise;
            this.processNewItems(mainResults.flat());

            // Then handle RSS feeds as they come in
            const rssResults = await rssSourcesPromise;
            this.processNewItems(rssResults.flat());
        } catch (error) {
            console.error('Error in background fetches:', error);
            // Don't show error to user since we already have cached content
        }
    }

    async fetchMainSources() {
        const fetchPromises = [];

        // GitHub
        if (this.sourcesSettings.github?.enabled) {
            const settings = this.sourcesSettings.github;
            const languages = this.parseLanguages(settings.language);

            const languagePromises = (languages.length > 0 ? languages : [null]).map(
                async (language) => {
                    const items = await GitHubApi.fetchRepositories(settings, language);
                    return items.map((item) => GitHubApi.transformResponse(item));
                }
            );

            fetchPromises.push(...languagePromises);
            settings.page += 1;
        }

        // HackerNews
        if (this.sourcesSettings.hackernews?.enabled) {
            const settings = this.sourcesSettings.hackernews;
            if (!settings.ids || settings.ids.length === 0) {
                settings.ids = await HackerNewsApi.fetchStoryIds(settings.type);
                settings.index = 0;
            }
            const items = await HackerNewsApi.fetchStories(settings);
            fetchPromises.push(
                Promise.resolve(items.map((item) => HackerNewsApi.transformResponse(item)))
            );
        }

        // Dev.to
        if (this.sourcesSettings.devto?.enabled) {
            const settings = this.sourcesSettings.devto;
            const items = await DevToApi.fetchArticles(settings);
            fetchPromises.push(
                Promise.resolve(items.map((item) => DevToApi.transformResponse(item)))
            );
            settings.page += 1;
        }

        return Promise.all(fetchPromises);
    }

    async fetchRssSources() {
        // Get all enabled RSS sources
        const rssSourcePromises = sourcesConfig
            .filter(
                (source) =>
                    source.defaultSettings.feedUrl && this.sourcesSettings[source.id]?.enabled
            )
            .map(async (source) => {
                try {
                    const items = await RssApi.fetchArticles(source.defaultSettings.feedUrl);
                    return items.map((item) => RssApi.transformResponse(item, source.label));
                } catch (error) {
                    console.error(`Error fetching ${source.label} RSS feed:`, error);
                    return [];
                }
            });

        // Use Promise.allSettled to handle individual RSS feed failures
        const results = await Promise.allSettled(rssSourcePromises);
        return results
            .filter((result) => result.status === 'fulfilled')
            .map((result) => result.value);
    }

    setupIntersectionObserver() {
        const sentinel = document.getElementById('infiniteScrollTrigger');
        if (!sentinel) return;

        this.observer = new IntersectionObserver(
            async (entries) => {
                if (entries[0].isIntersecting && !this.isLoading) {
                    try {
                        await this.fetchAllSourcesInBackground();
                    } catch (error) {
                        console.error('Error loading more items:', error);
                    }
                }
            },
            {
                rootMargin: '0px',
                threshold: 1.0,
            }
        );
        this.observer.observe(sentinel);
    }

    parseLanguages(languageString) {
        if (!languageString) return [];
        return languageString
            .split(',')
            .map((lang) => lang.trim().toLowerCase())
            .filter(Boolean);
    }

    processNewItems(newItems) {
        // Filter out duplicates using URL as unique identifier
        const uniqueNewItems = newItems.filter(
            (newItem) => !this.allItems.some((existingItem) => existingItem.url === newItem.url)
        );

        if (uniqueNewItems.length > 0) {
            this.allItems.push(...uniqueNewItems);

            // Ensure we don't exceed MAX_CACHED_ARTICLES
            if (this.allItems.length > MAX_CACHED_ARTICLES) {
                this.allItems.sort((a, b) => b.date - a.date);
                this.allItems = this.allItems.slice(0, MAX_CACHED_ARTICLES);
            }

            StorageService.saveArticles(this.allItems);
            this.renderFeed();
        }
    }

    renderFeed() {
        const container = document.getElementById('feedContainer');
        if (!container) return;

        const fragment = document.createDocumentFragment();

        this.allItems
            .sort((a, b) => b.date - a.date)
            .forEach((item) => {
                const cardElement = Card.create(item);
                fragment.appendChild(cardElement);
            });

        container.innerHTML = '';
        container.appendChild(fragment);
    }

    showLoadingIndicator() {
        const indicator = document.getElementById('loadingIndicator');
        indicator?.classList.remove('hidden');
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('loadingIndicator');
        indicator?.classList.add('hidden');
    }

    showError(message) {
        // Create error notification if it doesn't exist
        let errorNotification = document.getElementById('errorNotification');
        if (!errorNotification) {
            errorNotification = document.createElement('div');
            errorNotification.id = 'errorNotification';
            errorNotification.className = `
                fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg
                transform transition-transform duration-300 translate-y-full
                flex items-center space-x-3
            `;
            document.body.appendChild(errorNotification);
        }

        errorNotification.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>${message}</span>
        `;

        // Show notification
        requestAnimationFrame(() => {
            errorNotification.style.transform = 'translateY(0)';
        });

        // Hide after 5 seconds
        setTimeout(() => {
            errorNotification.style.transform = 'translateY(100%)';
            setTimeout(() => {
                errorNotification.remove();
            }, 300);
        }, 5000);
    }

    setupEventListeners() {
        // Theme toggle
        this.setupThemeToggle();

        // Refresh
        this.setupRefreshButtons();

        // Filters
        this.setupFilterButtons();

        // Search
        this.setupSearchForm();

        // Scroll to top
        this.setupScrollToTop();

        // Scroll handler
        this.setupScrollHandler();

        // Cleanup on page unload
        window.addEventListener('unload', () => this.cleanup());
    }

    setupThemeToggle() {
        const toggleTheme = () => ThemeService.toggleTheme();
        document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
        document.getElementById('mobileThemeToggle')?.addEventListener('click', toggleTheme);
    }

    setupRefreshButtons() {
        const refresh = () => this.resetAndRefetch();
        document.getElementById('refreshButton')?.addEventListener('click', refresh);
        document.getElementById('mobileRefreshButton')?.addEventListener('click', refresh);
    }

    setupFilterButtons() {
        const openFilters = () => {
            FiltersModal.build();
            FiltersModal.show();
        };

        document.getElementById('openFilters')?.addEventListener('click', openFilters);
        document.getElementById('mobileOpenFilters')?.addEventListener('click', openFilters);
        document
            .getElementById('closeFilters')
            ?.addEventListener('click', () => FiltersModal.hide());
        document
            .getElementById('cancelFiltersBtn')
            ?.addEventListener('click', () => FiltersModal.hide());
        document
            .getElementById('applyFiltersBtn')
            ?.addEventListener('click', () => this.applyFilters());
    }

    setupSearchForm() {
        document.getElementById('searchForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('searchInput');
            if (input?.value.trim()) {
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
                    input.value
                )}`;
            }
        });
    }

    setupScrollToTop() {
        document.getElementById('mobileScrollToTop')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    setupScrollHandler() {
        const scrollBtn = document.getElementById('mobileScrollToTop');
        if (!scrollBtn) return;

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollThreshold = window.innerHeight * 0.5;
                if (window.scrollY > scrollThreshold) {
                    scrollBtn.classList.remove('hidden');
                } else {
                    scrollBtn.classList.add('hidden');
                }
            }, 100);
        });
    }

    async resetAndRefetch() {
        this.allItems = [];
        localStorage.removeItem(STORAGE_KEYS.ARTICLES);
        localStorage.removeItem(STORAGE_KEYS.TIMESTAMP);

        // Reset source settings
        Object.keys(this.sourcesSettings).forEach((sourceId) => {
            if (sourceId === 'hackernews') {
                this.sourcesSettings[sourceId].index = 0;
                this.sourcesSettings[sourceId].ids = [];
            } else {
                this.sourcesSettings[sourceId].page = 1;
            }
        });

        const container = document.getElementById('feedContainer');
        if (container) container.innerHTML = '';

        this.showLoadingIndicator();
        await this.fetchAllSourcesInBackground();
        this.hideLoadingIndicator();
    }

    applyFilters() {
        sourcesConfig.forEach((source) => {
            const settings = {};
            source.fields.forEach((field) => {
                const input = document.getElementById(`${source.id}_${field.key}`);
                if (input) {
                    settings[field.key] = field.type === 'checkbox' ? input.checked : input.value;
                }
            });
            this.sourcesSettings[source.id] = {
                ...this.sourcesSettings[source.id],
                ...settings,
                page: 1, // Reset page number when applying filters
            };
        });

        StorageService.saveSettings(this.sourcesSettings);
        this.resetAndRefetch();
        FiltersModal.hide();
    }
}
