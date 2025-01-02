export class SearchSuggestions {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.corsProxy = 'https://corsproxy.io/';
    }

    async get(query) {
        if (!query || query.length < 2) return [];

        const cached = this.cache.get(query);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.suggestions;
        }

        try {
            const [googleSuggestions, duckSuggestions, wikiSuggestions] = await Promise.allSettled([
                this.fetchGoogleSuggestions(query),
                this.fetchDuckDuckGoSuggestions(query),
                this.fetchWikipediaSuggestions(query),
            ]);

            // Prioritize Google suggestions by adding them first
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

    async fetchGoogleSuggestions(query) {
        const targetUrl = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(
            query
        )}`;
        const response = await fetch(this.corsProxy + '?' + encodeURIComponent(targetUrl));
        const data = await response.json();
        return data[1] || [];
    }

    async fetchDuckDuckGoSuggestions(query) {
        const targetUrl = `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`;
        const response = await fetch(this.corsProxy + '?' + encodeURIComponent(targetUrl));
        const data = await response.json();
        return data.map((item) => item.phrase);
    }

    async fetchWikipediaSuggestions(query) {
        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeURIComponent(
                query
            )}&origin=*&limit=10`
        );
        const [_, suggestions] = await response.json();
        return suggestions || [];
    }

    getFallbackSuggestions(query) {
        return [
            `${query} tutorial`,
            `${query} documentation`,
            `${query} example`,
            `${query} guide`,
            `${query} best practices`,
            `learn ${query}`,
            `${query} vs`,
            `${query} alternative`,
            `${query} cheatsheet`,
            `${query} how to`,
        ];
    }

    handleCommandSuggestions(query) {
        const commands = ['!help', '!settings', '!refresh', '!theme', '!top'];
        return commands.filter((cmd) => cmd.startsWith(query));
    }
}
