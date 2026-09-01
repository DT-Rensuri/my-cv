import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            '@proj-airi/audio': fileURLToPath(new URL('./resources/js/packages/audio', import.meta.url)),
            '@proj-airi/ccc': fileURLToPath(new URL('./resources/js/packages/ccc', import.meta.url)),
            '@proj-airi/core-agent': fileURLToPath(new URL('./resources/js/packages/core-agent', import.meta.url)),
            '@proj-airi/drizzle-duckdb-wasm': fileURLToPath(new URL('./resources/js/packages/drizzle-duckdb-wasm', import.meta.url)),
            '@proj-airi/font-chillroundm': fileURLToPath(new URL('./resources/js/packages/font-chillroundm', import.meta.url)),
            '@proj-airi/font-cjkfonts-allseto': fileURLToPath(new URL('./resources/js/packages/font-cjkfonts-allseto', import.meta.url)),
            '@proj-airi/font-xiaolai': fileURLToPath(new URL('./resources/js/packages/font-xiaolai', import.meta.url)),
            '@proj-airi/i18n': fileURLToPath(new URL('./resources/js/packages/i18n', import.meta.url)),
            '@proj-airi/model-driver-mediapipe': fileURLToPath(new URL('./resources/js/packages/model-driver-mediapipe', import.meta.url)),
            '@proj-airi/pipelines-audio': fileURLToPath(new URL('./resources/js/packages/pipelines-audio', import.meta.url)),
            '@proj-airi/server-sdk': fileURLToPath(new URL('./resources/js/packages/server-sdk', import.meta.url)),
            '@proj-airi/stage-layouts': fileURLToPath(new URL('./resources/js/packages/stage-layouts', import.meta.url)),
            '@proj-airi/stage-pages': fileURLToPath(new URL('./resources/js/packages/stage-pages', import.meta.url)),
            '@proj-airi/stage-shared': fileURLToPath(new URL('./resources/js/packages/stage-shared', import.meta.url)),
            '@proj-airi/stage-ui': fileURLToPath(new URL('./resources/js/packages/stage-ui', import.meta.url)),
            '@proj-airi/stage-ui-live2d': fileURLToPath(new URL('./resources/js/packages/stage-ui-live2d', import.meta.url)),
            '@proj-airi/stage-ui-three': fileURLToPath(new URL('./resources/js/packages/stage-ui-three', import.meta.url)),
            '@proj-airi/stream-kit': fileURLToPath(new URL('./resources/js/packages/stream-kit', import.meta.url)),
            '@proj-airi/ui': fileURLToPath(new URL('./resources/js/packages/ui', import.meta.url)),
            '@proj-airi/ui-transitions': fileURLToPath(new URL('./resources/js/packages/ui-transitions', import.meta.url)),
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
        }),
        inertia(),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        wayfinder({
            formVariants: true,
        }),
    ],
});
