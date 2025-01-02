import { sourcesConfig } from '../config/sourceConfig.js';

export class Card {
    static create(item) {
        const card = document.createElement('article');
        card.className = `
            mb-6 inline-block w-full 
            rounded-xl border shadow-sm
            theme-card p-5
        `;

        card.innerHTML = this.generateCardHTML(item);

        // Only add click handler if the click target is the card itself
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on a link
            if (e.target.tagName !== 'A') {
                window.open(item.url, '_blank');
            }
        });

        return card;
    }

    static generateCardHTML(item) {
        const imageHtml = this.generateImageHTML(item);
        const statsHtml = this.generateStatsHTML(item);

        return `
            <div class="flex items-center mb-3 text-sm font-medium">
                ${this.getSourceIcon(item.source)}
                <span class="opacity-90">${item.source}</span>
            </div>

            ${imageHtml}

            <div class="flex justify-between items-start">
                <a href="${item.url}" 
                   target="_blank"
                   class="block font-semibold text-lg mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1"
                   onclick="event.stopPropagation();">
                    ${item.title}
                </a>
            </div>
            
            ${
                item.source === 'HackerNews' && item.id
                    ? `
                <a href="https://news.ycombinator.com/item?id=${item.id}"
                   target="_blank"
                   class="mt-3 inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500"
                   onclick="event.stopPropagation();">
                    <i class="fa-regular fa-comment"></i>
                    View Discussion on Hacker News
                </a>
            `
                    : ''
            }

            <div class="flex flex-col space-y-3 mt-3">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                    ${dayjs(item.date).fromNow()}
                </div>
                ${statsHtml}
            </div>
        `;
    }

    static generateImageHTML(item) {
        return item.imageUrl
            ? `
            <a href="${item.url}" target="_blank" onclick="event.stopPropagation();">
                <div class="relative overflow-hidden rounded-lg mb-4 aspect-video">
                    <img
                        src="${item.imageUrl}"
                        alt="${item.title}"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onerror="this.parentElement.style.display='none';"
                    />
                </div>
            </a>
        `
            : '';
    }

    static generateStatsHTML(item) {
        const baseClasses = 'flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400';
        const iconClasses = 'text-blue-500 dark:text-blue-400';

        switch (item.source) {
            case 'GitHub':
                return this.generateGitHubStats(item, baseClasses, iconClasses);
            case 'HackerNews':
                return this.generateHackerNewsStats(item, baseClasses, iconClasses);
            case 'Dev.to':
                return this.generateDevToStats(item, baseClasses, iconClasses);
            default:
                // For RSS feeds, show author if available
                if (item.author) {
                    return `
                        <div class="${baseClasses}">
                            <span class="flex items-center">
                                <i class="fa-solid fa-user ${iconClasses} mr-2"></i>${item.author}
                            </span>
                            ${
                                item.categories && item.categories.length
                                    ? `
                                <span class="flex items-center">
                                    <i class="fa-solid fa-tags ${iconClasses} mr-2"></i>${item.categories
                                          .slice(0, 3)
                                          .join(', ')}
                                </span>
                            `
                                    : ''
                            }
                        </div>`;
                }
                return '';
        }
    }

    static generateGitHubStats(item, baseClasses, iconClasses) {
        return `
            <div class="${baseClasses}">
                <span title="Stars" class="flex items-center">
                    <i class="fa-regular fa-star ${iconClasses} mr-2"></i>${item.stats.stars.toLocaleString()}
                </span>
                <span title="Issues" class="flex items-center">
                    <i class="fa-regular fa-circle-dot ${iconClasses} mr-2"></i>${item.stats.issues.toLocaleString()}
                </span>
                <span title="Forks" class="flex items-center">
                    <i class="fa-solid fa-code-fork ${iconClasses} mr-2"></i>${item.stats.forks.toLocaleString()}
                </span>
            </div>`;
    }

    static generateHackerNewsStats(item, baseClasses, iconClasses) {
        return `
            <div class="${baseClasses}">
                <span title="Points" class="flex items-center">
                    <i class="fa-solid fa-arrow-up ${iconClasses} mr-2"></i>${item.stats.points.toLocaleString()}
                </span>
                <span title="Comments" class="flex items-center">
                    <i class="fa-regular fa-comment ${iconClasses} mr-2"></i>${item.stats.comments.toLocaleString()}
                </span>
            </div>`;
    }

    static generateDevToStats(item, baseClasses, iconClasses) {
        return `
            <div class="${baseClasses}">
                <span title="Reactions" class="flex items-center">
                    <i class="fa-regular fa-heart ${iconClasses} mr-2"></i>${item.stats.reactions.toLocaleString()}
                </span>
                <span title="Comments" class="flex items-center">
                    <i class="fa-regular fa-comment ${iconClasses} mr-2"></i>${item.stats.comments.toLocaleString()}
                </span>
            </div>`;
    }

    static getSourceIcon(sourceName) {
        // Normalize sourceName for comparison
        const normalizedName = sourceName.toLowerCase().replace(/\s+/g, '');

        const source = sourcesConfig.find((src) => {
            // Normalize source label for comparison
            const normalizedLabel = src.label.toLowerCase().replace(/\s+/g, '');
            return (
                normalizedLabel === normalizedName ||
                (normalizedName === 'hackernews' && normalizedLabel === 'hackernews')
            );
        });

        return source ? source.icon : '';
    }
}
