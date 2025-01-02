export const searchPatterns = {
    // Development & Code
    github: /github\.com|gh:|git@|gitlab|bitbucket/i,
    stackoverflow: /stackoverflow\.com|so:|stackexchange\.com|askubuntu\.com|serverfault\.com/i,
    documentation: /docs\.|api\.|reference\.|mdm\.|developer\.|readthedocs\.io|swagger|openapi/i,
    code: /code\.|coding|algorithm|function|class |const |var |let |def |fn |func |import |export/i,

    // Package Managers
    npm: /npmjs\.com|npm:|package:|yarn add|npm install|pnpm/i,
    pip: /pypi\.org|pip install|pip3|requirements\.txt|setup\.py/i,
    cargo: /crates\.io|cargo add|cargo install|Cargo\.toml/i,
    gems: /rubygems\.org|gem install|Gemfile/i,

    // Web Development
    frontend: /frontend\.|react\.|vue\.|angular\.|svelte\.|css\.|html\.|javascript\.|tsx\.|jsx/i,
    backend: /backend\.|api\.|rest\.|graphql\.|endpoint\.|server\.|nodejs\.|django\.|flask/i,
    web: /web\.|http|css|html|dom|browser|responsive|website/i,

    // Learning & Education
    tutorial: /tutorial|course|learn|guide|how to|example|getting started|basics of/i,
    education: /edu\.|course|lecture|lesson|study|learning|mooc|udemy|coursera|edx/i,

    // Media
    video: /youtube\.com|vimeo\.com|video:|youtu\.be|mp4|webm|streaming|watch/i,
    audio: /spotify\.com|music\.|soundcloud|podcast|mp3|audio|listen/i,
    image: /imgur\.com|image:|png|jpg|jpeg|gif|svg|photo|picture|pixiv|deviantart/i,

    // Social & Community
    social: /twitter\.com|x\.com|linkedin\.com|social:|instagram\.com|facebook\.com|threads\.net/i,
    community: /reddit\.com|r\/|forum\.|community\.|discord\.com|slack\.com|gitter|discussion/i,
    chat: /chat\.|messaging|discord|slack|telegram|whatsapp|signal|matrix/i,
};

export const siteSearchPatterns = {
    'youtube:': { icon: 'fa-youtube', tag: 'YouTube Search', color: 'red' },
    'yt:': { icon: 'fa-youtube', tag: 'YouTube Search', color: 'red' },
    'github:': { icon: 'fa-github', tag: 'GitHub Search', color: 'slate' },
    'gh:': { icon: 'fa-github', tag: 'GitHub Search', color: 'slate' },
    'stackoverflow:': { icon: 'fa-stack-overflow', tag: 'Stack Overflow Search', color: 'orange' },
    'so:': { icon: 'fa-stack-overflow', tag: 'Stack Overflow Search', color: 'orange' },
    'reddit:': { icon: 'fa-reddit', tag: 'Reddit Search', color: 'orange' },
    'r:': { icon: 'fa-reddit', tag: 'Subreddit Search', color: 'orange' },
    'twitter:': { icon: 'fa-twitter', tag: 'Twitter Search', color: 'blue' },
    'x:': { icon: 'fa-twitter', tag: 'Twitter Search', color: 'blue' },
    'npm:': { icon: 'fa-npm', tag: 'NPM Search', color: 'red' },
    'maps:': { icon: 'fa-map-marker-alt', tag: 'Google Maps Search', color: 'green' },
    'wiki:': { icon: 'fa-wikipedia-w', tag: 'Wikipedia Search', color: 'slate' },
    'devto:': { icon: 'fa-dev', tag: 'Dev.to Search', color: 'slate' },
    'dev:': { icon: 'fa-dev', tag: 'Dev.to Search', color: 'slate' }
};