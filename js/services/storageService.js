import { MAX_CACHED_ARTICLES, STORAGE_KEYS } from '../config/constants.js';

export class StorageService {
    static saveArticles(articles) {
        try {
            const articlesToCache = [...articles]
                .sort((a, b) => b.date - a.date)
                .slice(0, MAX_CACHED_ARTICLES);

            localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articlesToCache));
            localStorage.setItem(STORAGE_KEYS.TIMESTAMP, new Date().toISOString());
            return true;
        } catch (error) {
            console.error('Error saving articles:', error);
            return false;
        }
    }

    static loadArticles() {
        try {
            const storedArticles = localStorage.getItem(STORAGE_KEYS.ARTICLES);
            const lastUpdate = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);

            if (storedArticles && lastUpdate) {
                return JSON.parse(storedArticles).map((item) => ({
                    ...item,
                    date: new Date(item.date),
                }));
            }
        } catch (error) {
            console.error('Error loading articles:', error);
        }
        return null;
    }

    static saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }

    static loadSettings() {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return stored ? JSON.parse(stored) : null;
    }
}
