import { App } from './app.js';
import { initializeSearch } from './services/search/index.js';


// Initialize dayjs relative time plugin
dayjs.extend(dayjs_plugin_relativeTime);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    const app = new App();
    app.init().catch((error) => {
        console.error('Failed to initialize application:', error);
    });

    // Initialize enhanced search functionality
    initializeSearch();

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
});

// Setup keyboard shortcuts for enhanced functionality
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Quick search focus (Ctrl/Cmd + K or /)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k' || e.key === '/') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // Refresh feed (Ctrl/Cmd + R)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            document.getElementById('refreshButton')?.click();
        }

        // Find in feed (Ctrl/Cmd + F)
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            document.getElementById('searchInput')?.focus();
        }
    });
}

// Optional: Add error boundary for unhandled rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});