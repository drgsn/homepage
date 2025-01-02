export const STORAGE_KEYS = {
    ARTICLES: 'mergedFeedArticles',
    TIMESTAMP: 'mergedFeedLastUpdate',
    THEME: 'mergedFeedTheme',
    SETTINGS: 'mergedFeedSettings',
    SEARCH_HISTORY: 'searchHistory',
    SEARCH_CACHE: 'searchCache',
};

export const MAX_CACHED_ARTICLES = 100;
export const MAX_SEARCH_HISTORY = 100;
export const SEARCH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const SEARCH_CATEGORIES = {
    GITHUB: 'github',
    STACKOVERFLOW: 'stackoverflow',
    DOCUMENTATION: 'documentation',
    VIDEO: 'video',
    SOCIAL: 'social',
    NPM: 'npm',
    NEWS: 'news',
    GENERAL: 'general',
};

export const SEARCH_TYPES = {
    COMMAND: 'command',
    URL: 'url',
    DOMAIN: 'domain',
    FILTER: 'filter',
    SEARCH: 'search',
};
