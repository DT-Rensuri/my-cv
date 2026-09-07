import inertia from '@inertiajs/vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { Download } from '@proj-airi/unplugin-fetch/vite';
import { DownloadLive2DSDK } from '@proj-airi/unplugin-live2d-sdk/vite';
import VueI18n from '@intlify/unplugin-vue-i18n/vite';
import VueDevTools from 'vite-plugin-vue-devtools';

const stageUIAssetsRoot = fileURLToPath(
    new URL('./public/assets', import.meta.url),
);
const sharedCacheDir = fileURLToPath(new URL('.cache', import.meta.url));

export default defineConfig({
    optimizeDeps: {
        exclude: [
            'resources/assets/*',
        ],
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
        }),
        inertia({
            ssr: false,
        }),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),

        DownloadLive2DSDK(),
        Download(
            'https://dist.ayaka.moe/live2d-models/hiyori_free_zh.zip',
            'hiyori_free_zh.zip',
            'live2d/models',
            { parentDir: stageUIAssetsRoot, cacheDir: sharedCacheDir },
        ),
        Download(
            'https://dist.ayaka.moe/live2d-models/hiyori_pro_zh.zip',
            'hiyori_pro_zh.zip',
            'live2d/models',
            { parentDir: stageUIAssetsRoot, cacheDir: sharedCacheDir },
        ),

        VueI18n({
            runtimeOnly: true,
            compositionOnly: true,
            fullInstall: true,
        }),

        VueDevTools({
            appendTo: 'resources/js/app.ts',
        }),
    ],
});
