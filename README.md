# 🚀 Dev News Feed

A sleek and modern developer news aggregator that combines feeds from GitHub, Hacker News, and Dev.to into a unified interface. Built with vanilla JavaScript and Tailwind CSS.

<div align="center">

![Light Theme](/screenshots/light-theme.png)
![Dark Theme](/screenshots/dark-theme.png)

[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-F7DF1E.svg?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

## ✨ Features

### 🔄 Multi-Source Integration

-   **GitHub Trending**: Stay updated with the most popular repositories
-   **Hacker News**: Follow engaging tech discussions
-   **Dev.to**: Access community-driven content

### 🎨 Modern UI/UX

-   Responsive masonry layout
-   Dark/light theme with system preference detection
-   Infinite scroll for seamless content consumption
-   Smooth animations and transitions
-   Card-based design with hover effects

### 🔍 Smart Search & Commands

-   **Quick Search**: Press `/` or `Ctrl/Cmd + K` to focus search
-   **Site-Specific Searches**:
    -   `youtube:` or `yt:` - Search YouTube
    -   `github:` or `gh:` - Search GitHub
    -   `stackoverflow:` or `so:` - Search Stack Overflow
    -   `reddit:` or `r:` - Search Reddit (e.g., `r:programming js`)
    -   And many more!

### ⚡ Commands

Type these commands in the search bar:

-   `!help` - Show help menu
-   `!settings` - Open feed settings
-   `!refresh` - Refresh the feed
-   `!theme` - Toggle dark/light theme
-   `!top` - Scroll to top

### 🎛️ Advanced Filtering

-   **GitHub**:

    -   Time period selection (daily/weekly/monthly)
    -   Language filtering
    -   Star-based sorting

-   **Hacker News**:

    -   Story type (top/new/best)
    -   Minimum points threshold
    -   Comment count filtering

-   **Dev.to**:
    -   Sort by recent/rising/relevant
    -   Tag filtering
    -   Reaction count threshold

### ⚙️ Technical Features

-   Local storage for caching and preferences
-   Efficient infinite scroll implementation
-   Debounced scroll handling
-   Lazy loading images
-   Dynamic theme switching
-   Cross-browser compatibility

## 🚀 Quick Start

1. **Clone the repository**

    ```bash
    git clone https://github.com/drgsn/dev-news-feed.git
    cd dev-news-feed
    ```

2. **Start a local server**

    ```bash
    # Using npx
    npx http-server .

    # Using Python
    python -m http.server

    # Using PHP
    php -S localhost:8000
    ```

3. **Access the application**
    - Open your browser
    - Navigate to `http://localhost:8080` (or your server's port)

## ⌨️ Keyboard Shortcuts

| Shortcut              | Action                      |
| --------------------- | --------------------------- |
| `/` or `Ctrl/Cmd + K` | Focus search                |
| `Ctrl/Cmd + R`        | Refresh feed                |
| `Ctrl/Cmd + F`        | Find in feed                |
| `Esc`                 | Close modals                |
| `↑` / `↓`             | Navigate search suggestions |
| `Enter`               | Select suggestion           |

## 🎨 Customization

### Theme Colors

Modify theme variables in `styles.css`:

```css
:root {
    --bg-primary: #f8fafc;
    --bg-secondary: #f1f5f9;
    --text-primary: #0f172a;
    /* Add custom colors */
}
```

### Layout Configuration

Adjust the responsive layout in `index.html`:

```html
<div class="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4"></div>
```

## 🧩 Adding New Sources

1. Create a new source configuration in `sourceConfig.js`:

```javascript
{
    id: 'your-source',
    label: 'Your Source',
    icon: '<i class="fa-solid fa-your-icon"></i>',
    defaultSettings: {
        enabled: true,
        // Add default settings
    },
    fields: [
        {
            type: 'checkbox',
            key: 'enabled',
            label: 'Enable Source?'
        },
        // Add filter fields
    ]
}
```

2. Implement API integration in a new file under `services/api/`:

```javascript
export class YourSourceApi {
    static async fetchItems(settings) {
        // Implement fetch logic
    }

    static transformResponse(item) {
        return {
            source: 'Your Source',
            title: item.title,
            url: item.url,
            // Transform to common format
        };
    }
}
```

## 📦 Dependencies

-   **Tailwind CSS** - Utility-first CSS framework
-   **Font Awesome** - Icon library
-   **Day.js** - Modern date/time library

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by contributors around the world.
</div>
