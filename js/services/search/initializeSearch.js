import { CommandHandler } from './CommandHandler.js';
import { handleSiteSearch } from './handlers/siteSearchHandlers.js';
import { SearchAutocomplete } from './SearchAutocomplete.js';
import { SearchHistory } from './SearchHistory.js';
import { SearchSuggestions } from './SearchSuggestions.js';
import { tryParseUrl } from './utils/searchUtils.js';

function handleSearch(value, history) {
    if (!value) return false; // Return false if no value

    // Check for commands first
    if (value.startsWith('!')) {
        const [command] = value.split(' ');
        const commandHandler = new CommandHandler();
        if (commandHandler.handle(command)) {
            return true; // Return true to indicate command was handled
        }
    }

    // Check for site-specific searches
    const siteSearchUrl = handleSiteSearch(value);
    if (siteSearchUrl) {
        history.add(value);
        window.open(siteSearchUrl, '_blank');
        return true; // Return true to indicate search was handled
    }

    // Try to parse as URL
    const url = tryParseUrl(value);
    if (url) {
        history.add(value);
        window.open(url, '_blank');
        return true; // Return true to indicate URL was handled
    }

    // If not a URL, proceed with regular search
    history.add(value);
    window.open(`https://www.google.com/search?q=${encodeURIComponent(value)}`, '_blank');
    return true; // Return true to indicate search was handled
}

export function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (!searchForm || !searchInput) return;

    const history = new SearchHistory();
    const suggestions = new SearchSuggestions();
    const autocomplete = new SearchAutocomplete(searchInput, (query) => {
        if (handleSearch(query, history)) {
            searchInput.value = query;
            autocomplete.hide();
        }
    });

    let debounceTimeout;
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            if (value) {
                const [historySuggestions, externalSuggestions] = await Promise.all([
                    history.search(value, { limit: 5 }),
                    suggestions.get(value),
                ]);

                const combinedSuggestions = [
                    ...historySuggestions,
                    ...externalSuggestions.map((s) => ({ query: s, type: 'search' })),
                ];

                autocomplete.show(combinedSuggestions);
            } else {
                autocomplete.hide();
            }
        }, 150);
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = searchInput.value.trim();
        if (value) {
            handleSearch(value, history);
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target)) {
            autocomplete.hide();
        }
    });

    // Handle keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                autocomplete.moveSelection(1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                autocomplete.moveSelection(-1);
                break;
            case 'Enter':
                if (autocomplete.visible && autocomplete.selectedIndex >= 0) {
                    e.preventDefault();
                    autocomplete.selectSuggestion(autocomplete.selectedIndex);
                }
                break;
            case 'Escape':
                e.preventDefault();
                autocomplete.hide();
                e.target.blur();
                break;
            case 'Tab':
                if (autocomplete.visible && autocomplete.selectedIndex >= 0) {
                    e.preventDefault();
                    autocomplete.selectSuggestion(autocomplete.selectedIndex);
                }
                break;
        }
    });
}
