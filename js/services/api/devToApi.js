export class DevToApi {
    static async fetchArticles(settings) {
        let url = `https://dev.to/api/articles?per_page=10&page=${settings.page}`;
        
        if (settings.tag) {
            url += `&tag=${settings.tag}`;
        }
        
        switch (settings.sort) {
            case 'rising':
                url += '&top=7';
                break;
            case 'relevant':
                url += '&top=30';
                break;
        }

        const response = await fetch(url);
        return response.json();
    }

    static transformResponse(article) {
        return {
            source: 'Dev.to',
            title: article.title,
            url: article.url,
            date: new Date(article.published_at),
            imageUrl: article.cover_image || '',
            stats: {
                reactions: article.public_reactions_count,
                comments: article.comments_count,
            },
        };
    }
}