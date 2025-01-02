import { siteSearchPatterns } from './utils/searchPatterns.js';

export class SearchAutocomplete {
    constructor(input, onSelect) {
        this.input = input;
        this.onSelect = onSelect;
        this.dropdown = this.createDropdown();
        this.visible = false;
        this.selectedIndex = -1;
        this.suggestions = [];
        this.lastCommand = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && this.lastCommand) {
                const cursorPosition = this.input.selectionStart;
                const valueBeforeCursor = this.input.value.substring(0, cursorPosition);

                if (valueBeforeCursor === this.lastCommand) {
                    e.preventDefault();
                    this.input.value = this.input.value.substring(
                        0,
                        cursorPosition - this.lastCommand.length
                    );
                    this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
                    this.lastCommand = null;
                }
            }
        });

        // Add animation when dropdown appears
        this.dropdown.addEventListener('transitionend', () => {
            if (!this.visible) {
                this.dropdown.style.display = 'none';
            }
        });
    }

    createDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = `
            absolute left-0 right-0 top-14
            bg-white dark:bg-gray-800 
            rounded-xl shadow-lg 
            border border-gray-200/50 dark:border-gray-700/50
            overflow-hidden hidden z-50
            max-h-[85vh] overflow-y-auto
            backdrop-blur-sm
            transition-all duration-200 ease-out
            translate-y-1 opacity-0 scale-98
        `;
        this.input.parentNode.appendChild(dropdown);
        return dropdown;
    }

    detectSearchType(value) {
        if (value.startsWith('!')) {
            return {
                type: 'command',
                icon: 'fa-terminal',
                tag: 'Command Mode',
                description: 'Execute system command',
                color: 'blue',
            };
        }

        for (const [prefix, info] of Object.entries(siteSearchPatterns)) {
            if (value.toLowerCase().startsWith(prefix.toLowerCase())) {
                if (value.toLowerCase() === prefix.toLowerCase()) {
                    this.lastCommand = prefix;
                    this.input.value = prefix;
                    const cursorPos = this.input.value.length;
                    this.input.setSelectionRange(cursorPos, cursorPos);
                }
                return {
                    type: 'site-search',
                    ...info,
                    description: `Search ${info.tag.split(' ')[0]}`,
                };
            }
        }

        this.lastCommand = null;
        return null;
    }

    show(items) {
        this.suggestions = items;
        this.selectedIndex = -1;

        if (items.length === 0) {
            this.hide();
            return;
        }

        const searchType = this.detectSearchType(this.input.value);
        let dropdownContent = '';

        if (searchType) {
            const colorClasses = {
                blue: 'from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400',
                red: 'from-red-500/20 to-red-600/20 text-red-600 dark:text-red-400',
                orange: 'from-orange-500/20 to-orange-600/20 text-orange-600 dark:text-orange-400',
                green: 'from-green-500/20 to-green-600/20 text-green-600 dark:text-green-400',
                slate: 'from-slate-500/20 to-slate-600/20 text-slate-600 dark:text-slate-400',
            };

            dropdownContent += `
                <div class="relative">
                    <div class="p-4 bg-gradient-to-r ${
                        colorClasses[searchType.color] || colorClasses.blue
                    }">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-white/90 dark:bg-gray-900/90 shadow-sm">
                                <i class="fa-brands ${searchType.icon}"></i>
                            </div>
                            <div>
                                <div class="font-medium">${searchType.tag}</div>
                                <div class="text-sm opacity-80">
                                    ${searchType.description}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent dark:from-gray-800/50 pointer-events-none"></div>
                </div>
            `;
        }

        // Group suggestions by type
        const groupedItems = items.reduce((acc, item) => {
            const type = item.type || item.category || 'other';
            if (!acc[type]) acc[type] = [];
            acc[type].push(item);
            return acc;
        }, {});

        // Render each group
        Object.entries(groupedItems).forEach(([type, groupItems]) => {
            dropdownContent += `
                <div class="py-2">
                    <div class="px-4 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ${this.formatGroupTitle(type)}
                    </div>
                    ${groupItems
                        .map(
                            (item, index) => `
                        <div class="suggestion px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer
                                    transition-colors duration-150 group
                                    ${
                                        index === this.selectedIndex
                                            ? 'bg-gray-50 dark:bg-gray-700/50'
                                            : ''
                                    }"
                             data-index="${index}">
                            <div class="flex items-center gap-3">
                                <div class="flex-none w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 
                                            flex items-center justify-center
                                            group-hover:bg-gray-200 dark:group-hover:bg-gray-700
                                            transition-colors duration-150">
                                    <i class="fa-solid ${this.getIconForType(
                                        item.type || item.category
                                    )} 
                                              text-gray-500 dark:text-gray-400"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-medium truncate">
                                        ${item.query || item}
                                    </div>
                                    ${this.renderMetadata(item)}
                                </div>
                            </div>
                            ${this.renderTags(item)}
                        </div>
                    `
                        )
                        .join('')}
                </div>
            `;
        });

        this.dropdown.innerHTML = dropdownContent;

        // Show dropdown with animation
        this.dropdown.style.display = 'block';
        requestAnimationFrame(() => {
            this.dropdown.classList.add('translate-y-0', 'opacity-100', 'scale-100');
            this.dropdown.classList.remove('translate-y-1', 'opacity-0', 'scale-98');
        });

        this.visible = true;
        this.addSuggestionClickListeners();
    }

    hide() {
        this.dropdown.classList.remove('translate-y-0', 'opacity-100', 'scale-100');
        this.dropdown.classList.add('translate-y-1', 'opacity-0', 'scale-98');
        this.visible = false;
    }

    addSuggestionClickListeners() {
        this.dropdown.querySelectorAll('.suggestion').forEach((el) => {
            el.addEventListener('click', () => {
                const index = parseInt(el.dataset.index);
                this.selectSuggestion(index);
            });
        });
    }

    formatGroupTitle(type) {
        const titles = {
            command: 'Commands',
            url: 'URLs',
            domain: 'Domains',
            search: 'Search History',
            github: 'GitHub',
            stackoverflow: 'Stack Overflow',
            documentation: 'Documentation',
            video: 'Videos',
            social: 'Social',
            other: 'Suggestions',
        };
        return titles[type] || type.charAt(0).toUpperCase() + type.slice(1);
    }

    getIconForType(type) {
        const icons = {
            url: 'fa-link',
            domain: 'fa-globe',
            search: 'fa-clock-rotate-left',
            command: 'fa-terminal',
            github: 'fa-code',
            stackoverflow: 'fa-stack-overflow',
            documentation: 'fa-book',
            video: 'fa-play',
            social: 'fa-users',
            suggestion: 'fa-magnifying-glass',
            other: 'fa-lightbulb',
        };
        return icons[type] || 'fa-lightbulb';
    }

    renderMetadata(item) {
        if (!item.timestamp) return '';

        const timeAgo = dayjs(item.timestamp).fromNow();
        const count = item.count ? `· ${item.count}×` : '';

        return `
            <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                ${timeAgo} ${count}
            </div>
        `;
    }

    renderTags(item) {
        if (!item.tags?.length) return '';

        return `
            <div class="mt-2 flex flex-wrap gap-1">
                ${item.tags
                    .map(
                        (tag) => `
                    <span class="px-2 py-0.5 text-xs rounded-full
                                bg-gray-100 dark:bg-gray-800 
                                text-gray-600 dark:text-gray-300
                                border border-gray-200/50 dark:border-gray-700/50">
                        ${tag}
                    </span>
                `
                    )
                    .join('')}
            </div>
        `;
    }

    moveSelection(direction) {
        if (!this.visible) return;

        this.selectedIndex += direction;
        if (this.selectedIndex < 0) this.selectedIndex = this.suggestions.length - 1;
        if (this.selectedIndex >= this.suggestions.length) this.selectedIndex = 0;

        const suggestions = this.dropdown.querySelectorAll('.suggestion');
        suggestions.forEach((el, index) => {
            el.classList.toggle('bg-gray-50', index === this.selectedIndex);
            el.classList.toggle('dark:bg-gray-700/50', index === this.selectedIndex);

            if (index === this.selectedIndex) {
                this.ensureVisible(el);
            }
        });
    }

    ensureVisible(element) {
        const rect = element.getBoundingClientRect();
        const dropdownRect = this.dropdown.getBoundingClientRect();

        if (rect.bottom > dropdownRect.bottom) {
            element.scrollIntoView(false);
        } else if (rect.top < dropdownRect.top) {
            element.scrollIntoView(true);
        }
    }

    selectSuggestion(index) {
        const suggestion = this.suggestions[index];
        if (suggestion) {
            this.onSelect(suggestion.query || suggestion);
            this.hide();
        }
    }
}
