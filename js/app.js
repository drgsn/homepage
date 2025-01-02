import { Card } from './components/Card.js';
import { FiltersModal } from './components/FiltersModal.js';
import { MAX_CACHED_ARTICLES, STORAGE_KEYS } from './config/constants.js';
import { sourcesConfig } from './config/sourceConfig.js';
import { DevToApi } from './services/api/devToApi.js';
import { GitHubApi } from './services/api/githubApi.js';
import { HackerNewsApi } from './services/api/hackerNewsApi.js';
import { StorageService } from './services/storageService.js';
import { ThemeService } from './services/themeService.js';

export class App {
    constructor() {
        this.allItems = [];
        this.sourcesSettings = {};
        this.observer = null;
        this.isLoading = false;
    }

    async init() {
        // Initialize components
        this.loadInitialSettings();
        await this.initData();
        this.setupIntersectionObserver();
        this.setupEventListeners();
    }

    loadInitialSettings() {
        ThemeService.loadTheme();
        this.loadSettings();
        this.focusSearchInput();
    }

    focusSearchInput() {
        setTimeout(() => {
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
            sourcesConfig.forEach((source) => {
                this.sourcesSettings[source.id] = { ...source.defaultSettings };
            });
            StorageService.saveSettings(this.sourcesSettings);
        }
    }

    async initData() {
        // Load cached articles if they exist
        const cachedArticles = StorageService.loadArticles();
        if (cachedArticles) {
            this.allItems = cachedArticles;
            this.renderFeed();
        }

        // Fetch new articles
        await this.fetchAllEnabledSources();
    }

    setupIntersectionObserver() {
        const sentinel = document.getElementById('infiniteScrollTrigger');
        this.observer = new IntersectionObserver(
            async (entries) => {
                if (entries[0].isIntersecting && !this.isLoading) {
                    await this.fetchAllEnabledSources();
                    this.renderFeed();
                }
            },
            {
                rootMargin: '0px',
                threshold: 1.0,
            }
        );
        this.observer.observe(sentinel);
    }

    async fetchAllEnabledSources() {
        if (this.isLoading) return;
        this.isLoading = true;
        this.showLoadingIndicator();

        try {
            const fetchPromises = [];

            // GitHub
            if (this.sourcesSettings.github?.enabled) {
                const settings = this.sourcesSettings.github;
                const languages = settings.language
                    .split(',')
                    .map((lang) => lang.trim().toLowerCase())
                    .filter(Boolean);

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

            const results = await Promise.all(fetchPromises);
            const newItems = results.flat();

            // Filter out duplicates
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
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            this.isLoading = false;
            this.hideLoadingIndicator();
        }
    }

    renderFeed() {
        const container = document.getElementById('feedContainer');
        container.innerHTML = '';

        this.allItems
            .sort((a, b) => b.date - a.date)
            .forEach((item) => {
                container.appendChild(Card.create(item));
            });
    }

    showLoadingIndicator() {
        const indicator = document.getElementById('loadingIndicator');
        indicator?.classList.remove('hidden');
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('loadingIndicator');
        indicator?.classList.add('hidden');
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            ThemeService.toggleTheme();
        });

        document.getElementById('mobileThemeToggle')?.addEventListener('click', () => {
            ThemeService.toggleTheme();
        });

        // Refresh
        document.getElementById('refreshButton')?.addEventListener('click', () => {
            this.resetAndRefetch();
        });

        document.getElementById('mobileRefreshButton')?.addEventListener('click', () => {
            this.resetAndRefetch();
        });

        // Filters
        document.getElementById('openFilters')?.addEventListener('click', () => {
            FiltersModal.build();
            FiltersModal.show();
        });

        document.getElementById('mobileOpenFilters')?.addEventListener('click', () => {
            FiltersModal.build();
            FiltersModal.show();
        });

        document.getElementById('closeFilters')?.addEventListener('click', () => {
            FiltersModal.hide();
        });

        document.getElementById('cancelFiltersBtn')?.addEventListener('click', () => {
            FiltersModal.hide();
        });

        document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
            this.applyFilters();
        });

        // Search
        document.getElementById('searchForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('searchInput');
            if (input?.value.trim()) {
                window.open(
                    `https://www.google.com/search?q=${encodeURIComponent(input.value)}`,
                    '_blank'
                );
            }
        });

        // Scroll to top
        document.getElementById('mobileScrollToTop')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Scroll handler
        window.addEventListener('scroll', () => {
            const scrollBtn = document.getElementById('mobileScrollToTop');
            if (window.scrollY > 500) {
                scrollBtn?.classList.remove('hidden');
            } else {
                scrollBtn?.classList.add('hidden');
            }
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

        // Clear the feed and show loading
        const container = document.getElementById('feedContainer');
        if (container) container.innerHTML = '';
        this.showLoadingIndicator();

        // Fetch new data
        await this.fetchAllEnabledSources();
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
            };
        });

        StorageService.saveSettings(this.sourcesSettings);
        this.resetAndRefetch();
        FiltersModal.hide();
    }
}
