import { createInertiaApp } from '@inertiajs/vue3';
import { createPinia } from 'pinia';
import { createApp, h } from 'vue';
import i18n from '@/i18n';
import { MotionPlugin } from '@vueuse/motion';
import { setupSynced } from '@dtrensuri/stage-ui/libs/pinia';
import { PiniaColada } from '@pinia/colada'
import Tres from '@tresjs/core'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pinia = createPinia();
const synced = setupSynced();
pinia.use(synced.pinia);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) });
        app.use(plugin);
        app.use(synced.vue);
        app.use(MotionPlugin);
        app.use(pinia);
        app.use(PiniaColada);
        app.use(Tres);
        app.use(i18n);
        if (el) {
            app.mount(el);
        }
        return app;
    },
});
