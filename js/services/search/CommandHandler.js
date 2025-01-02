export class CommandHandler {
    constructor() {
        // Define available commands and their handlers
        this.commands = {
            '!help': this.showHelp.bind(this),
            '!settings': () => document.getElementById('openFilters')?.click(),
            '!refresh': () => document.getElementById('refreshButton')?.click(),
            '!theme': () => document.getElementById('themeToggle')?.click(),
            '!top': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        };

        // Command descriptions for help and suggestions
        this.commandDescriptions = {
            '!help': 'Show this help menu',
            '!settings': 'Open feed settings',
            '!refresh': 'Refresh the feed',
            '!theme': 'Toggle dark/light theme',
            '!top': 'Scroll to top',
        };
    }

    handle(command) {
        const cmd = this.commands[command.toLowerCase()];
        if (cmd) {
            cmd();
            return true;
        }
        return false;
    }

    getCommandSuggestions(input) {
        input = input.toLowerCase();
        return Object.keys(this.commands)
            .filter((cmd) => cmd.toLowerCase().startsWith(input))
            .map((cmd) => ({
                query: cmd,
                type: 'command',
                description: this.commandDescriptions[cmd],
                icon: 'fa-terminal',
            }));
    }

    showHelp() {
        const commands = Object.entries(this.commandDescriptions).map(([command, description]) => ({
            command,
            description,
        }));

        const siteCommands = [
            { prefix: 'youtube:', alias: 'yt:', description: 'Search YouTube' },
            { prefix: 'github:', alias: 'gh:', description: 'Search GitHub' },
            { prefix: 'stackoverflow:', alias: 'so:', description: 'Search Stack Overflow' },
            {
                prefix: 'reddit:',
                alias: 'r:',
                description: 'Search Reddit (r:programming js for subreddit)',
            },
            { prefix: 'twitter:', alias: 'x:', description: 'Search Twitter/X' },
            { prefix: 'npm:', description: 'Search NPM packages' },
            { prefix: 'mdn:', alias: 'docs:', description: 'Search MDN documentation' },
            { prefix: 'devto:', alias: 'dev:', description: 'Search Dev.to' },
            { prefix: 'maps:', description: 'Search Google Maps' },
            { prefix: 'wiki:', description: 'Search Wikipedia' },
        ];

        const modal = document.createElement('div');
        modal.className =
            'fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex justify-center items-center modal-backdrop';
        modal.innerHTML = this.generateHelpModalContent(commands, siteCommands);
        document.body.appendChild(modal);

        // Handle modal closing
        const closeModal = () => modal.remove();
        modal.querySelector('#closeHelpModal')?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    generateHelpModalContent(commands, siteCommands) {
        return `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">Search Help</h2>
                    <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition" id="closeHelpModal">
                        <i class="fa-solid fa-xmark text-xl opacity-70 hover:opacity-100"></i>
                    </button>
                </div>

                <div class="space-y-6">
                    <!-- Commands Section -->
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Commands</h3>
                        <div class="space-y-2">
                            ${commands
                                .map(
                                    ({ command, description }) => `
                                <div class="flex items-center space-x-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                    <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">${command}</code>
                                    <span>${description}</span>
                                </div>
                            `
                                )
                                .join('')}
                        </div>
                    </div>

                    <!-- Site Search Section -->
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Site-Specific Searches</h3>
                        <div class="space-y-2">
                            ${siteCommands
                                .map(
                                    ({ prefix, alias, description }) => `
                                <div class="flex items-center space-x-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                    <div class="flex-none">
                                        <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">${prefix}</code>
                                        ${
                                            alias
                                                ? `<code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono ml-1">${alias}</code>`
                                                : ''
                                        }
                                    </div>
                                    <span>${description}</span>
                                </div>
                            `
                                )
                                .join('')}
                        </div>
                    </div>

                    <!-- Examples Section -->
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Examples</h3>
                        <div class="space-y-2">
                            <div class="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                <code class="font-mono">youtube: javascript tutorial</code>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Searches YouTube for JavaScript tutorials</p>
                            </div>
                            <div class="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                <code class="font-mono">r: programming</code>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Goes to r/programming subreddit</p>
                            </div>
                            <div class="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                <code class="font-mono">gh: react hooks</code>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Searches GitHub for React hooks</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
