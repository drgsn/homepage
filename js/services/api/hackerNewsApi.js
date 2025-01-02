export class HackerNewsApi {
    static async fetchStories(settings) {
        const startIndex = settings.index;
        const endIndex = startIndex + 10;
        const slice = settings.ids.slice(startIndex, endIndex);

        const stories = await Promise.all(slice.map((id) => this.fetchStory(id)));

        settings.index = endIndex;
        return stories;
    }

    static async fetchStory(id) {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return response.json();
    }

    static async fetchStoryIds(type) {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/${type}stories.json`);
        return response.json();
    }

    static transformResponse(story) {
        return {
            source: 'HackerNews',
            title: story.title,
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            date: new Date(story.time * 1000),
            imageUrl: '',
            id: story.id, 
            stats: {
                points: story.score,
                comments: story.descendants || 0,
            },
        };
    }
}
