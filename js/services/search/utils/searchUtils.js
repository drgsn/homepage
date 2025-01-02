export function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export function tryParseUrl(input) {
    if (isValidUrl(input)) {
        return input;
    }

    if (isValidUrl('https://' + input)) {
        return 'https://' + input;
    }

    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/.test(input)) {
        return 'https://' + input;
    }

    return null;
}

export function getQueryType(query) {
    if (query.startsWith('!')) return 'command';
    try {
        new URL(query);
        return 'url';
    } catch {
        if (query.match(/^[\w-]+(\.[\w-]+)+/)) return 'domain';
        if (query.includes(':')) return 'filter';
        return 'search';
    }
}

export function getUrlFromQuery(query) {
    try {
        const url = new URL(query);
        return url.href;
    } catch {
        if (query.match(/^[\w-]+(\.[\w-]+)+/)) {
            return `https://${query}`;
        }
        return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
}