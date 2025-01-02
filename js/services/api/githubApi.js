import { buildDateRange } from '../../utils/dateUtils.js';

export class GitHubApi {
    static async fetchRepositories(settings, language) {
        const { url, headers } = this.buildSearchUrl(settings, language);
        const response = await fetch(url, { headers });
        const data = await response.json();
        return data.items || [];
    }

    static buildSearchUrl(settings, language) {
        const baseUrl = 'https://api.github.com/search/repositories';
        const queryParams = new URLSearchParams();
        const page = parseInt(settings.page) || 1;
        const queryParts = [];
        
        queryParts.push(buildDateRange(new Date(), settings.timePeriod));
        
        if (language) {
            queryParts.push(`language:${language}`);
        }
        
        queryParts.push('is:public', 'archived:false');

        queryParams.set('q', queryParts.join(' '));
        queryParams.set('sort', 'stars');
        queryParams.set('order', 'desc');
        queryParams.set('page', page);
        queryParams.set('per_page', 10);

        return {
            url: `${baseUrl}?${queryParams.toString()}`,
            headers: {
                Accept: 'application/vnd.github.v3+json',
            },
        };
    }

    static transformResponse(repo) {
        return {
            source: 'GitHub',
            title: repo.full_name,
            url: repo.html_url,
            date: new Date(repo.created_at),
            imageUrl: repo.owner?.avatar_url || '',
            stats: {
                stars: repo.stargazers_count,
                issues: repo.open_issues_count,
                forks: repo.forks_count,
            },
        };
    }
}