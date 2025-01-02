export const sourcesConfig = [
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
];
