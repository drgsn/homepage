export const SEARCH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export class SearchSuggestions {
    constructor() {
        this.cache = new Map();
        this.corsProxy = 'https://corsproxy.io/';
        this.cleanupInterval = setInterval(() => this.cleanupCache(), SEARCH_CACHE_DURATION);
    }

    cleanup() {
        clearInterval(this.cleanupInterval);
        this.cache.clear();
    }

    cleanupCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > SEARCH_CACHE_DURATION) {
                this.cache.delete(key);
            }
        }
    }

    async get(query) {
        if (!query || query.length < 2) return [];

        // Clean up old cache entries before checking cache
        this.cleanupCache();

        const cached = this.cache.get(query);
        if (cached && Date.now() - cached.timestamp < SEARCH_CACHE_DURATION) {
            return cached.suggestions;
        }

        try {
            const [googleSuggestions, duckSuggestions, wikiSuggestions] = await Promise.allSettled([
                this.fetchWithTimeout(this.fetchGoogleSuggestions(query), 3000),
                this.fetchWithTimeout(this.fetchDuckDuckGoSuggestions(query), 3000),
                this.fetchWithTimeout(this.fetchWikipediaSuggestions(query), 3000),
            ]);

            const allSuggestions = new Set([
                ...(googleSuggestions.status === 'fulfilled' ? googleSuggestions.value : []),
                ...(duckSuggestions.status === 'fulfilled' ? duckSuggestions.value : []),
                ...(wikiSuggestions.status === 'fulfilled' ? wikiSuggestions.value : []),
            ]);

            const suggestions = [...allSuggestions].slice(0, 10);

            this.cache.set(query, {
                timestamp: Date.now(),
                suggestions,
            });

            return suggestions;
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            return this.getFallbackSuggestions(query);
        }
    }

    async fetchWithTimeout(promise, timeout) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), timeout);
        });
        return Promise.race([promise, timeoutPromise]);
    }

    async fetchGoogleSuggestions(query) {
        try {
            const targetUrl = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(
                query
            )}`;
            const response = await fetch(this.corsProxy + '?' + encodeURIComponent(targetUrl));
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data[1] || [];
        } catch (error) {
            console.warn('Google suggestions failed:', error);
            return [];
        }
    }

    async fetchDuckDuckGoSuggestions(query) {
        try {
            const targetUrl = `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`;
            const response = await fetch(this.corsProxy + '?' + encodeURIComponent(targetUrl));
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.map((item) => item.phrase);
        } catch (error) {
            console.warn('DuckDuckGo suggestions failed:', error);
            return [];
        }
    }

    async fetchWikipediaSuggestions(query) {
        try {
            const response = await fetch(
                `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeURIComponent(
                    query
                )}&origin=*&limit=10`
            );
            if (!response.ok) throw new Error('Network response was not ok');
            const [_, suggestions] = await response.json();
            return suggestions || [];
        } catch (error) {
            console.warn('Wikipedia suggestions failed:', error);
            return [];
        }
    }

    getFallbackSuggestions(query) {
        const templates = [
            'tutorial',
            'documentation',
            'example',
            'guide',
            'best practices',
            'learn',
            'vs',
            'alternative',
            'cheatsheet',
            'how to',
        ];
        return templates.map((template) => `${query} ${template}`);
    }
}
