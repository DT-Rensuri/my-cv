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
            '@proj-airi/server-sdk-shared': fileURLToPath(new URL('./resources/js/packages/server-sdk-shared', import.meta.url)),
            '@dtrensuri/suri-v-tube': fileURLToPath(new URL('./resources/js/projects/suri-v-tube', import.meta.url)),
            '@proj-airi/stage-ui': fileURLToPath(new URL('./resources/js/packages/stage-ui/src', import.meta.url)),
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
