import type { Auth } from '@/types/auth';

// Extend ImportMeta interface for Vite...
declare module 'vite/client' {
    interface ImportMetaEnv {
        readonly VITE_APP_NAME: string;
        readonly VITE_LLM_PROVIDER?: 'ollama' | 'openrouter' | 'laravel' | string;
        readonly VITE_LLM_API_KEY?: string;
        readonly VITE_LLM_MODEL?: string;
        readonly VITE_LLM_BASE_URL?: string;
        readonly VITE_LLM_OLLAMA_MODEL?: string;
        [key: string]: string | boolean | undefined;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
        readonly glob: <T>(pattern: string) => Record<string, () => Promise<T>>;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            geo?: {
                country: string;
                locale: 'vi' | 'en' | 'ja';
            }
            [key: string]: unknown;
        };
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $inertia: typeof Router;
        $page: Page;
        $headManager: ReturnType<typeof createHeadManager>;
    }
}
