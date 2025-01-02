import { searchPatterns } from './utils/searchPatterns.js';
import { getQueryType, getUrlFromQuery } from './utils/searchUtils.js';

export class SearchHistory {
    constructor(maxSize = 100) {
        this.maxSize = maxSize;
        this.key = 'searchHistory';
        this.items = this.load();
    }

    load() {
        try {
            return JSON.parse(localStorage.getItem(this.key) || '[]').map((item) => ({
                ...item,
                timestamp: new Date(item.timestamp),
            }));
        } catch {
            return [];
        }
    }

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.items));
    }

    add(query, tags = []) {
        const type = getQueryType(query);
        const category = this.categorizeQuery(query);
        const existingIndex = this.items.findIndex((item) => item.query === query);

        if (existingIndex !== -1) {
            const existing = this.items[existingIndex];
            this.items.splice(existingIndex, 1);
            this.items.unshift({
                ...existing,
                timestamp: Date.now(),
                count: existing.count + 1,
                tags: [...new Set([...existing.tags, ...tags, category])],
            });
        } else {
            this.items.unshift({
                query,
                timestamp: Date.now(),
                type,
                category,
                tags: [...new Set([...tags, category])],
                count: 1,
                url: getUrlFromQuery(query),
            });
        }

        if (this.items.length > this.maxSize) {
            this.items = this.items.slice(0, this.maxSize);
        }

        this.save();
    }

    search(prefix, options = {}) {
        const { limit = 8, categoryFilter = null, typeFilter = null } = options;

        return this.items
            .filter((item) => {
                const matchesPrefix = item.query.toLowerCase().includes(prefix.toLowerCase());
                const matchesCategory = !categoryFilter || item.category === categoryFilter;
                const matchesType = !typeFilter || item.type === typeFilter;
                return matchesPrefix && matchesCategory && matchesType;
            })
            .sort((a, b) => {
                if (b.count !== a.count) return b.count - a.count;
                return b.timestamp - a.timestamp;
            })
            .slice(0, limit);
    }

    categorizeQuery(query) {
        for (const [category, pattern] of Object.entries(searchPatterns)) {
            if (pattern.test(query)) return category;
        }
        return getQueryType(query);
    }

    clearHistory() {
        this.items = [];
        this.save();
    }
}
