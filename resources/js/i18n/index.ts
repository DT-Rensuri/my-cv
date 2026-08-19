import { createI18n } from 'vue-i18n';
import vi from './vi';
import en from './en';
import ja from './ja';

export type Locale = 'vi' | 'en' | 'ja';

export const SUPPORTED_LOCALES: Locale[] = ['vi', 'en', 'ja'];
export const DEFAULT_LOCALE: Locale = 'vi';

const STORAGE_KEY = 'app_locale';

export function loadSavedLocale(): Locale {
    if (typeof localStorage === 'undefined') {
        return DEFAULT_LOCALE;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (SUPPORTED_LOCALES as string[]).includes(saved)) {
        return saved as Locale;
    }
    return DEFAULT_LOCALE;
}

export function saveLocale(locale: Locale): void {
    localStorage.setItem(STORAGE_KEY, locale);
}

const i18n = createI18n({
    legacy: false,
    locale: loadSavedLocale(),
    fallbackLocale: DEFAULT_LOCALE,
    messages: {
        vi,
        en,
        ja,
    },
});

export default i18n;