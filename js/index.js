import { App } from './app.js';

// Initialize dayjs relative time plugin
dayjs.extend(dayjs_plugin_relativeTime);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init().catch((error) => {
        console.error('Failed to initialize application:', error);
    });
});

// Optional: Add error boundary for unhandled rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
