import { createI18n } from 'vue-i18n';
import { usePage } from '@inertiajs/vue3';
import vi from './vi';
import en from './en';
import ja from './ja';

export type Locale = 'vi' | 'en' | 'ja';

export const SUPPORTED_LOCALES: Locale[] = ['vi', 'en', 'ja'];
export const DEFAULT_LOCALE: Locale = 'vi';

const STORAGE_KEY = 'app_locale';

function isValidLocale(value: unknown): value is Locale {
    return (
        typeof value === 'string' &&
        SUPPORTED_LOCALES.includes(value as Locale)
    );
}

export function loadSavedLocale(): Locale {
    if (typeof localStorage === 'undefined') {
        return DEFAULT_LOCALE;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (SUPPORTED_LOCALES as string[]).includes(saved)) {
        return saved as Locale;
    }

    try {
        const page = usePage();

        const detectedLocale = page.props.geo?.locale;

        if (isValidLocale(detectedLocale)) {
            localStorage.setItem(STORAGE_KEY, detectedLocale);
            return detectedLocale;
        }
    } catch {
        // i18n có thể được khởi tạo trước Inertia
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