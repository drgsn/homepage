import { STORAGE_KEYS } from '../config/constants.js';

export class ThemeService {
    static themeChangeCallbacks = new Set();
    static currentTheme = null;
    static themeChangeInProgress = false;

    static loadTheme() {
        if (this.themeChangeInProgress) return this.currentTheme === 'dark';

        try {
            this.themeChangeInProgress = true;
            const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);

            this.currentTheme = isDark ? 'dark' : 'light';
            this.applyTheme(isDark);
            this.themeChangeInProgress = false;
            return isDark;
        } catch (error) {
            console.error('Error loading theme:', error);
            this.themeChangeInProgress = false;
            return false;
        }
    }

    static toggleTheme() {
        if (this.themeChangeInProgress) return;

        try {
            this.themeChangeInProgress = true;
            const isDark = document.documentElement.classList.contains('dark');
            this.applyTheme(!isDark);
            this.themeChangeInProgress = false;
            return !isDark;
        } catch (error) {
            console.error('Error toggling theme:', error);
            this.themeChangeInProgress = false;
            return false;
        }
    }

    static applyTheme(isDark) {
        try {
            localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark', isDark);
            this.currentTheme = isDark ? 'dark' : 'light';
            this.updateThemeIcon(isDark);
            this.notifyThemeChange(isDark);
        } catch (error) {
            console.error('Error applying theme:', error);
        }
    }

    static updateThemeIcon(isDark) {
        const desktopIcon = document.querySelector('#themeToggle i');
        const mobileIcon = document.querySelector('#mobileThemeToggle i');

        const iconClass = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

        if (desktopIcon) desktopIcon.className = iconClass;
        if (mobileIcon) mobileIcon.className = iconClass;
    }

    static onThemeChange(callback) {
        this.themeChangeCallbacks.add(callback);
        // Immediately call with current theme
        callback(this.currentTheme === 'dark');
    }

    static offThemeChange(callback) {
        this.themeChangeCallbacks.delete(callback);
    }

    static notifyThemeChange(isDark) {
        this.themeChangeCallbacks.forEach((callback) => {
            try {
                callback(isDark);
            } catch (error) {
                console.error('Error in theme change callback:', error);
            }
        });
    }

    static initializeThemeListener() {
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
                this.applyTheme(e.matches);
            }
        });
    }
}
