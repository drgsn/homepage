import { STORAGE_KEYS } from '../config/constants.js';

export class ThemeService {
    static loadTheme() {
        const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
        const isDark = storedTheme === 'dark';
        this.applyTheme(isDark);
        return isDark;
    }

    static toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        this.applyTheme(!isDark);
        return !isDark;
    }

    static applyTheme(isDark) {
        localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', isDark);
        this.updateThemeIcon(isDark);
    }

    static updateThemeIcon(isDark) {
        const desktopIcon = document.querySelector('#themeToggle i');
        const mobileIcon = document.querySelector('#mobileThemeToggle i');

        const iconClass = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

        if (desktopIcon) desktopIcon.className = iconClass;
        if (mobileIcon) mobileIcon.className = iconClass;
    }
}
