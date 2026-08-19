import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ThemeColors } from '@/types/theme';

const THEME_KEY = 'dtc-theme';

type Theme = 'light' | 'dark' | 'custom';

const lightTheme: ThemeColors = {
    backgroundColor: '#f5e9c8',
    backgroundAltColor: '#ead9a8',
    panelColor: '#fdf6e3',
    lineColor: '#8a6d3b',
    lineLightColor: '#a8895a',
    inkColor: '#4a3728',
    inkMutedColor: '#7a5c3a',
    inkDimColor: '#a8895a',
    successColor: '#3f6f45',
    accentColor: '#36747a',
    highlightColor: '#8a4f5d',
    warningColor: '#a88632',
    orangeColor: '#9a5a32',
    dangerColor: '#8a4141',
    primaryColor: '#66527d',
};

const darkTheme: ThemeColors = {
    backgroundColor: '#0d0b1a',
    backgroundAltColor: '#161229',
    panelColor: '#1e1a36',
    lineColor: '#4a3d7a',
    lineLightColor: '#6d5ca8',
    inkColor: '#e8e4f3',
    inkMutedColor: '#9b8ec7',
    inkDimColor: '#6d5ca8',
    successColor: '#4ade80',
    accentColor: '#22d3ee',
    highlightColor: '#f472b6',
    warningColor: '#facc15',
    orangeColor: '#fb923c',
    dangerColor: '#f87171',
    primaryColor: '#a78bfa',
};

export const useThemeStore = defineStore('theme', () => {
    const theme = ref<Theme>('dark');
    const themeColors = ref<ThemeColors>(darkTheme);

    function init() {
        if (typeof window === 'undefined') {
            return;
        }

        const stored = localStorage.getItem(THEME_KEY) as Theme | null;

        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;

        theme.value = stored ?? (prefersDark ? 'dark' : 'light');

        apply();
    }

    function toggle() {
        theme.value = (() => {
            switch (theme.value) {
                case 'light':
                    return 'dark';
                case 'dark':
                    return 'custom';
                case 'custom':
                    return 'light';
                default:
                    return 'light';
            }
        })();

        apply();
    }

    function apply() {
        if (typeof document === 'undefined') {
            return;
        }

        const root = document.documentElement;

        if (theme.value === 'dark') {
            root.classList.add('dark');
            themeColors.value = { ...darkTheme };
        } else if (theme.value === 'light') {
            root.classList.remove('dark');
            themeColors.value = { ...lightTheme };
        } else if (theme.value === 'custom') {
            const customColors = localStorage.getItem('custom-theme-colors');
            themeColors.value = {
                ...JSON.parse(customColors || '{}'),
            } as ThemeColors;
        }

        applyCssVariables(root);

        localStorage.setItem(THEME_KEY, theme.value);
    }

    function applyCssVariables(root: HTMLElement) {
        const colors = themeColors.value;

        const cssVars: Record<string, string> = {
            '--color-background': colors.backgroundColor,
            '--color-background-alt': colors.backgroundAltColor,
            '--color-panel': colors.panelColor,
            '--color-line': colors.lineColor,
            '--color-line-light': colors.lineLightColor,
            '--color-ink': colors.inkColor,
            '--color-ink-muted': colors.inkMutedColor,
            '--color-ink-dim': colors.inkDimColor,
            '--color-success': colors.successColor,
            '--color-accent': colors.accentColor,
            '--color-highlight': colors.highlightColor,
            '--color-warning': colors.warningColor,
            '--color-orange': colors.orangeColor,
            '--color-danger': colors.dangerColor,
            '--color-primary': colors.primaryColor,
        };

        for (const [key, value] of Object.entries(cssVars)) {
            root.style.setProperty(key, value);
        }
    }

    function setColorTheme(colors: ThemeColors) {
        theme.value = 'custom';
        localStorage.setItem('custom-theme-colors', JSON.stringify(colors));
        localStorage.setItem(THEME_KEY, theme.value);
        themeColors.value = { ...colors };

        if (typeof document !== 'undefined') {
            applyCssVariables(document.documentElement);
        }
    }

    return {
        theme,
        themeColors,
        init,
        toggle,
        apply,
        setColorTheme,
    };
});
