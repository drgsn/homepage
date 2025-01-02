import { CommandHandler } from './CommandHandler.js';
import { handleSiteSearch } from './handlers/siteSearchHandlers.js';
import { SearchAutocomplete } from './SearchAutocomplete.js';
import { SearchHistory } from './SearchHistory.js';
import { SearchSuggestions } from './SearchSuggestions.js';

function handleSearch(value, history) {
    if (!value) return false;

    // Check for commands first and handle them without continuing
    if (value.startsWith('!')) {
        const [command] = value.split(' ');
        const commandHandler = new CommandHandler();
        commandHandler.handle(command);
        return false;
    }

    // Check for site-specific searches (like youtube:, gh:, etc)
    const siteSearchUrl = handleSiteSearch(value);
    if (siteSearchUrl) {
        history.add(value);
        window.open(siteSearchUrl);
        return true;
    }

    // Stricter URL validation
    // Only treat as URL if:
    // 1. It starts with http:// or https://, or
    // 2. It matches a domain pattern AND contains a valid TLD
    const isValidUrl =
        value.startsWith('http://') ||
        value.startsWith('https://') ||
        // Must contain no spaces
        (!value.includes(' ') &&
            // Must match domain pattern
            /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/.test(value) &&
            // Must end with common TLD
            /\.(com|org|net|edu|gov|mil|biz|info|io|dev|me)$/i.test(value));

    if (isValidUrl) {
        const url = value.startsWith('http') ? value : `https://${value}`;
        history.add(value);
        window.open(url, '_blank');
        return true;
    }

    // Default to Google search for everything else
    history.add(value);
    window.open(`https://www.google.com/search?q=${encodeURIComponent(value)}`);
    return true;
}

export function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (!searchForm || !searchInput) return;

    const history = new SearchHistory();
    const suggestions = new SearchSuggestions();

    // Create autocomplete with modified selection behavior
    const autocomplete = new SearchAutocomplete(searchInput, (query) => {
        if (query.startsWith('!')) {
            const [command] = query.split(' ');
            const commandHandler = new CommandHandler();
            commandHandler.handle(command);
            searchInput.value = ''; // Clear input after command
            autocomplete.hide();
            return;
        }

        searchInput.value = query;
        handleSearch(query, history);
        autocomplete.hide();
    });

    let debounceTimeout;
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            if (value) {
                // Don't show suggestions for commands
                if (value.startsWith('!')) {
                    const commandSuggestions = new CommandHandler().getCommandSuggestions(value);
                    autocomplete.show(
                        commandSuggestions.map((cmd) => ({
                            query: cmd,
                            type: 'command',
                        }))
                    );
                    return;
                }

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

    // Prevent form submission for commands
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = searchInput.value.trim();

        if (!value) return;

        if (value.startsWith('!')) {
            const [command] = value.split(' ');
            const commandHandler = new CommandHandler();
            commandHandler.handle(command);
            searchInput.value = ''; // Clear input after command
            return;
        }

        handleSearch(value, history);
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

    // Hide autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target)) {
            autocomplete.hide();
        }
    });
}
