export const siteSearchHandlers = {
    'youtube:': (query) =>
        `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    'yt:': (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    'github:': (query) => `https://github.com/search?q=${encodeURIComponent(query)}`,
    'gh:': (query) => `https://github.com/search?q=${encodeURIComponent(query)}`,
    'stackoverflow:': (query) => `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`,
    'so:': (query) => `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`,
    'reddit:': (query) => `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,
    'r:': (query) => {
        const parts = query.split(/\s+/);
        const subreddit = parts[0];
        const searchTerms = parts.slice(1).join(' ');
        return searchTerms
            ? `https://www.reddit.com/r/${subreddit}/search?q=${encodeURIComponent(searchTerms)}`
            : `https://www.reddit.com/r/${subreddit}`;
    },
    'twitter:': (query) => `https://twitter.com/search?q=${encodeURIComponent(query)}`,
    'x:': (query) => `https://twitter.com/search?q=${encodeURIComponent(query)}`,
    'npm:': (query) => `https://www.npmjs.com/search?q=${encodeURIComponent(query)}`,
    'mdn:': (query) => `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(query)}`,
    'docs:': (query) => `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(query)}`,
    'devto:': (query) => `https://dev.to/search?q=${encodeURIComponent(query)}`,
    'dev:': (query) => `https://dev.to/search?q=${encodeURIComponent(query)}`,
    'maps:': (query) => `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
    'wiki:': (query) => `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`,
};

export function handleSiteSearch(value) {
    const prefix = Object.keys(siteSearchHandlers).find((prefix) =>
        value.toLowerCase().startsWith(prefix.toLowerCase())
    );

    if (prefix) {
        const query = value.slice(prefix.length).trim();
        if (query) {
            return siteSearchHandlers[prefix](query);
        }
    }

    return null;
}
