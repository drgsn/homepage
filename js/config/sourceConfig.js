export const sourcesConfig = [
    // New Sources by Category
    {
        id: 'github',
        label: 'GitHub',
        icon: '<i class="fa-brands fa-github text-gray-600 dark:text-gray-300 mr-1"></i>',
        defaultSettings: {
            enabled: true,
            timePeriod: 'daily',
            language: '',
            page: 1,
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable GitHub?',
            },
            {
                type: 'select',
                key: 'timePeriod',
                label: 'Time Period',
                options: ['daily', 'weekly', 'monthly'],
            },
            {
                type: 'text',
                key: 'language',
                label: 'Language(s)',
                placeholder: 'e.g. javascript, python',
            },
        ],
    },
    {
        id: 'hackernews',
        label: 'Hacker News',
        icon: '<i class="fa-brands fa-hacker-news text-orange-600 dark:text-orange-300 mr-1"></i>',
        defaultSettings: {
            enabled: true,
            type: 'top',
            minPoints: 0,
            ids: [],
            index: 0,
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Hacker News?',
            },
            {
                type: 'select',
                key: 'type',
                label: 'Story Type',
                options: ['top', 'new', 'best'],
            },
            {
                type: 'number',
                key: 'minPoints',
                label: 'Minimum Points',
                placeholder: 'e.g. 100',
            },
        ],
    },
    {
        id: 'devto',
        label: 'Dev.to',
        icon: '<i class="fa-brands fa-dev text-green-600 dark:text-green-300 mr-1"></i>',
        defaultSettings: {
            enabled: true,
            sort: 'recent',
            tag: '',
            page: 1,
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Dev.to?',
            },
            {
                type: 'select',
                key: 'sort',
                label: 'Sort By',
                options: ['recent', 'rising', 'relevant'],
            },
            {
                type: 'text',
                key: 'tag',
                label: 'Tag',
                placeholder: 'e.g. react',
            },
        ],
    },
    // Tech News & Blogs
    {
        id: 'techcrunch',
        label: 'TechCrunch',
        icon: '<i class="fa-solid fa-newspaper text-green-600 dark:text-green-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://techcrunch.com/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable TechCrunch?',
            },
        ],
    },
    {
        id: 'wired',
        label: 'Wired',
        icon: '<i class="fa-solid fa-newspaper text-red-600 dark:text-red-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://www.wired.com/feed/rss',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Wired?',
            },
        ],
    },
    {
        id: 'theverge',
        label: 'The Verge',
        icon: '<i class="fa-solid fa-newspaper text-purple-600 dark:text-purple-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://www.theverge.com/rss/index.xml',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable The Verge?',
            },
        ],
    },
    {
        id: 'arstechnica',
        label: 'Ars Technica',
        icon: '<i class="fa-solid fa-newspaper text-blue-600 dark:text-blue-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://feeds.arstechnica.com/arstechnica/index',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Ars Technica?',
            },
        ],
    },
    // Programming & Development
    {
        id: 'csstricks',
        label: 'CSS Tricks',
        icon: '<i class="fa-brands fa-css3 text-blue-600 dark:text-blue-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://css-tricks.com/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable CSS Tricks?',
            },
        ],
    },
    {
        id: 'freecodecamp',
        label: 'freeCodeCamp',
        icon: '<i class="fa-brands fa-free-code-camp text-green-600 dark:text-green-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://www.freecodecamp.org/news/rss/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable freeCodeCamp?',
            },
        ],
    },
    {
        id: 'codepen',
        label: 'CodePen Blog',
        icon: '<i class="fa-brands fa-codepen text-gray-600 dark:text-gray-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://blog.codepen.io/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable CodePen Blog?',
            },
        ],
    },
    {
        id: 'mozillahacks',
        label: 'Mozilla Hacks',
        icon: '<i class="fa-brands fa-firefox-browser text-orange-600 dark:text-orange-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://hacks.mozilla.org/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Mozilla Hacks?',
            },
        ],
    },
    // Security
    {
        id: 'krebsonsecurity',
        label: 'Krebs on Security',
        icon: '<i class="fa-solid fa-shield-halved text-red-600 dark:text-red-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://krebsonsecurity.com/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Krebs on Security?',
            },
        ],
    },
    {
        id: 'hackernews-sec',
        label: 'The Hacker News',
        icon: '<i class="fa-solid fa-bug text-blue-600 dark:text-blue-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://feeds.feedburner.com/TheHackersNews',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable The Hacker News?',
            },
        ],
    },
    {
        id: 'schneier',
        label: 'Schneier on Security',
        icon: '<i class="fa-solid fa-lock text-purple-600 dark:text-purple-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://www.schneier.com/feed/atom/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Schneier on Security?',
            },
        ],
    },

    // Additional Tech News & Analysis
    {
        id: 'mit-tech-review',
        label: 'MIT Technology Review',
        icon: '<i class="fa-solid fa-microscope text-red-600 dark:text-red-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://www.technologyreview.com/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable MIT Technology Review?',
            },
        ],
    },
    {
        id: 'venture-beat',
        label: 'VentureBeat',
        icon: '<i class="fa-solid fa-chart-line text-blue-600 dark:text-blue-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://venturebeat.com/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable VentureBeat?',
            },
        ],
    },
    {
        id: 'zdnet',
        label: 'ZDNet',
        icon: '<i class="fa-solid fa-newspaper text-blue-600 dark:text-blue-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://www.zdnet.com/rss.xml',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable ZDNet?',
            },
        ],
    },

    // Programming & Development
    {
        id: 'scotch-io',
        label: 'Scotch.io',
        icon: '<i class="fa-solid fa-code text-purple-600 dark:text-purple-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://scotch.io/feed',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Scotch.io?',
            },
        ],
    },
    {
        id: 'typescript-blog',
        label: 'TypeScript Blog',
        icon: '<i class="fa-brands fa-microsoft text-blue-600 dark:text-blue-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://devblogs.microsoft.com/typescript/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable TypeScript Blog?',
            },
        ],
    },
    {
        id: 'go-blog',
        label: 'Go Blog',
        icon: '<i class="fa-brands fa-golang text-blue-600 dark:text-blue-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://go.dev/blog/feed.atom',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Go Blog?',
            },
        ],
    },
    {
        id: 'rust-blog',
        label: 'Rust Blog',
        icon: '<i class="fa-brands fa-rust text-orange-600 dark:text-orange-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://blog.rust-lang.org/feed.xml',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Rust Blog?',
            },
        ],
    },

    // Cloud & DevOps
    {
        id: 'aws-news',
        label: 'AWS News',
        icon: '<i class="fa-brands fa-aws text-orange-600 dark:text-orange-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://aws.amazon.com/blogs/aws/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable AWS News?',
            },
        ],
    },
    {
        id: 'azure-updates',
        label: 'Azure Updates',
        icon: '<i class="fa-brands fa-microsoft text-blue-600 dark:text-blue-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://azurecomcdn.azureedge.net/updates/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Azure Updates?',
            },
        ],
    },
    {
        id: 'kubernetes-blog',
        label: 'Kubernetes Blog',
        icon: '<i class="fa-solid fa-dharmachakra text-blue-600 dark:text-blue-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://kubernetes.io/feed.xml',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Kubernetes Blog?',
            },
        ],
    },

    // AI & Machine Learning
    {
        id: 'openai-blog',
        label: 'OpenAI Blog',
        icon: '<i class="fa-solid fa-robot text-green-600 dark:text-green-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://openai.com/blog/rss.xml',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable OpenAI Blog?',
            },
        ],
    },
    {
        id: 'deepmind-blog',
        label: 'DeepMind Blog',
        icon: '<i class="fa-solid fa-brain text-purple-600 dark:text-purple-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://deepmind.com/blog/feed/basic/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable DeepMind Blog?',
            },
        ],
    },
    {
        id: 'pytorch-blog',
        label: 'PyTorch Blog',
        icon: '<i class="fa-solid fa-fire text-orange-600 dark:text-orange-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://pytorch.org/blog/feed.xml',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable PyTorch Blog?',
            },
        ],
    },

    // Security & Privacy
    {
        id: 'portswigger',
        label: 'PortSwigger Research',
        icon: '<i class="fa-solid fa-shield-virus text-red-600 dark:text-red-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://portswigger.net/research/rss',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable PortSwigger Research?',
            },
        ],
    },
    {
        id: 'google-project-zero',
        label: 'Google Project Zero',
        icon: '<i class="fa-solid fa-bug-slash text-red-600 dark:text-red-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://googleprojectzero.blogspot.com/feeds/posts/default',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Project Zero?',
            },
        ],
    },

    // Company Engineering Blogs
    {
        id: 'netflix-tech',
        label: 'Netflix Tech Blog',
        icon: '<i class="fa-brands fa-netflix text-red-600 dark:text-red-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://netflixtechblog.com/feed',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Netflix Tech Blog?',
            },
        ],
    },
    {
        id: 'spotify-engineering',
        label: 'Spotify Engineering',
        icon: '<i class="fa-brands fa-spotify text-green-600 dark:text-green-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://engineering.atspotify.com/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Spotify Engineering?',
            },
        ],
    },
    {
        id: 'uber-engineering',
        label: 'Uber Engineering',
        icon: '<i class="fa-brands fa-uber text-gray-600 dark:text-gray-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://eng.uber.com/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Uber Engineering?',
            },
        ],
    },
    {
        id: 'meta-engineering',
        label: 'Meta Engineering',
        icon: '<i class="fa-brands fa-meta text-blue-600 dark:text-blue-300 mr-1"></i>',
        defaultSettings: {
            enabled: false,
            feedUrl: 'https://engineering.fb.com/feed/',
        },
        fields: [
            {
                type: 'checkbox',
                key: 'enabled',
                label: 'Enable Meta Engineering?',
            },
        ],
    },
];
