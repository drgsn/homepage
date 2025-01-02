export class RssApi {
    static async fetchArticles(feedUrl) {
        const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
            feedUrl
        )}`;
        const response = await fetch(rss2jsonUrl);
        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error(`Failed to fetch RSS feed: ${data.message}`);
        }

        return data.items;
    }

    static transformResponse(item, sourceName) {
        return {
            source: sourceName,
            title: item.title,
            url: item.link,
            date: new Date(item.pubDate),
            imageUrl: item.thumbnail || item.enclosure?.link || '',
            stats: {
                // Some RSS feeds might include these in the future
                comments: 0,
                reactions: 0,
            },
            description: item.description,
            categories: item.categories || [],
            author: item.author || '',
        };
    }
}
