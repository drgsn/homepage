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
        window.location.href = siteSearchUrl;
        return true;
    }

    // Stricter URL validation
    const isValidUrl = (value) => {
        // Trim leading and trailing whitespace
        value = value.trim();
        // Regular expression to match full URLs
        const urlPattern =
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,}|[0-9]{1,3}(\.[0-9]{1,3}){3})(:[0-9]+)?(\/[^\s?#]*)?(\?[^\s#]*)?(#[^\s]*)?$/i;
        // Test the value against the URL pattern
        return urlPattern.test(value) && !value.includes(' ');
    };
    if (isValidUrl) {
        const url = value.startsWith('http') ? value : `https://${value}`;
        history.add(value);
        window.location.href = url;
        return true;
    }

    // Default to Google search for everything else
    history.add(value);
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
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
            searchInput.value = '';
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
