# Dev News Dashboard

A simple, self-contained web dashboard that fetches trending articles from [GitHub](https://github.com/), [Hacker News](https://news.ycombinator.com/), and [Dev.to](https://dev.to/). Provides infinite scrolling within each feed, configurable settings (e.g., GitHub language, Hacker News story type, Dev.to tag, etc.), local search, and an option to search on Google.

## Features

- **Multiple Feeds**:
  - **GitHub Trending**: Filter by language (`JavaScript`, `Python`, etc.) and time period (`Daily`, `Weekly`, `Monthly`). 
  - **Hacker News**: Choose story type (`Top`, `Best`, `New`, etc.) and minimum points.
  - **Dev.to**: Select a tag (like `javascript` or `react`) and sort mode (`Recent`, `Rising`, or `Relevant`).

- **Infinite Scrolling**: Each feed loads more items as you scroll within its card.

- **Local Storage**: Selected settings are stored locally. When you revisit the page, your last-used settings are automatically applied.

- **Local vs. Google Search**:  
  - Type your query and press **Enter** for Google search (opens in a new tab).  
  - Press **Shift+Enter** or click **Local Search** button to filter currently displayed items by your query.

- **Auto-Refresh**: All feeds automatically refresh every 5 minutes in the background.

## How It Works

1. **index.html**: The entire front-end logic is contained in a single HTML file.  
   - **JavaScript** in `<script>` tags handles fetching data, managing settings, search, and infinite scroll.  
   - **Tailwind CSS** (via CDN) for styling.

2. **Local Storage**: 
   - The user’s feed settings (e.g., chosen language, time period) are saved in `localStorage` under `"devNewsDashboardSettings"`.
   - On page load, these settings are retrieved and applied automatically.

3. **Apply Settings**:
   - Each feed card has a **Settings** toggle.  
   - When you change some dropdowns or inputs and then click **Apply**, the new settings are saved, the settings panel closes, the feed scroll resets, and the articles reload.

## Getting Started

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/drgsn/homepage.git
   cd homepage
   ```

2. Open index.html
Just open the file in your browser (e.g., double-click or right-click → “Open in browser”). Or serve it with a local web server like:

    ```bash
    npx http-server .
    ```

3.	Use the Dashboard:
	•	GitHub, Hacker News, and Dev.to feeds will populate automatically.
	•	Scroll to the bottom of each feed to load more items.
	•	Click the gear icon to open settings. Adjust, then click Apply to refresh.
	•	Type a keyword in the Search box and press Enter to Google, or Shift+Enter (or the Local Search button) to filter in-page.


## Contributing

Feel free to open issues or submit pull requests if you find bugs or want to add features.

## License

This project is released under the MIT License.