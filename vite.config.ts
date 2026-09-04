import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { Download } from '@proj-airi/unplugin-fetch/vite';
import { DownloadLive2DSDK } from '@proj-airi/unplugin-live2d-sdk/vite';
import Unocss from 'unocss/vite';
import VueI18n from '@intlify/unplugin-vue-i18n/vite';
import Info from 'unplugin-info/vite';
import Yaml from 'unplugin-yaml/vite';

const stageUIAssetsRoot = fileURLToPath(
    new URL('./public/assets', import.meta.url),
);
const sharedCacheDir = fileURLToPath(new URL('.cache', import.meta.url));

export default defineConfig({
    optimizeDeps: {
        exclude: [
            '@dtrensuri/stage-ui/*',
            'resources/assets/*',

            // Live2D SDK
            // '@framework/live2dcubismframework',
            // '@framework/math/cubismmatrix44',
            // '@framework/type/csmvector',
            // '@framework/math/cubismviewmatrix',
            // '@framework/cubismdefaultparameterid',
            // '@framework/cubismmodelsettingjson',
            // '@framework/effect/cubismbreath',
            // '@framework/effect/cubismeyeblink',
            // '@framework/model/cubismusermodel',
            // '@framework/motion/acubismmotion',
            // '@framework/motion/cubismmotionqueuemanager',
            // '@framework/type/csmmap',
            // '@framework/utils/cubismdebug',
            // '@framework/model/cubismmoc',
        ],
    },
    server: {
        fs: {
            strict: false,
        },
        warmup: {
            clientFiles: [
                `${fileURLToPath(new URL('./resources/js/packages/stage-ui/src', import.meta.url))}/*.{vue}`,
                `${fileURLToPath(new URL('./resources/js/packages/stage-pages/src', import.meta.url))}/*.{vue}`,
            ],
        },
    },
    worker: {
        format: 'es',
        rollupOptions: {
            output: {
                inlineDynamicImports: false,
            },
        },
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
        wayfinder({
            formVariants: true,
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
        Download(
            'https://dist.ayaka.moe/vrm-models/VRoid-Hub/AvatarSample-A/AvatarSample_A.vrm',
            'AvatarSample_A.vrm',
            'vrm/models/AvatarSample-A',
            { parentDir: stageUIAssetsRoot, cacheDir: sharedCacheDir },
        ),
        Download(
            'https://dist.ayaka.moe/vrm-models/VRoid-Hub/AvatarSample-B/AvatarSample_B.vrm',
            'AvatarSample_B.vrm',
            'vrm/models/AvatarSample-B',
            { parentDir: stageUIAssetsRoot, cacheDir: sharedCacheDir },
        ),

        Unocss(),
        VueI18n({
            runtimeOnly: true,
            compositionOnly: true,
            fullInstall: true,
        }),
        Info(),
        Yaml(),
    ],
});
