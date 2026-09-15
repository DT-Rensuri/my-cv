import { ref } from 'vue';
import { defineStore } from 'pinia';

/**
 * Global loader state. Lives in a store so the <AppLoader /> mounted once
 * in the root layout stays in sync with page-level init lifecycle.
 */
export const useAppLoaderStore = defineStore('app-loader', () => {
    const isInitializing = ref(true);
    const progress = ref(0);

    let readyCount = 0;
    let totalTasks = 0;

    function setProgress() {
        progress.value =
            totalTasks > 0 ? Math.round((readyCount / totalTasks) * 100) : 100;
    }

    /** Called when a page mounts: reset state and show the loader. */
    function begin() {
        readyCount = 0;
        totalTasks = 0;
        progress.value = 0;
        isInitializing.value = true;
    }

    /** Register a pending init task. */
    function register() {
        totalTasks++;
        setProgress();
    }

    /** Mark a registered task as done. */
    function complete() {
        readyCount++;
        setProgress();
    }

    /** All tasks done — hide the loader. */
    function finish() {
        readyCount = totalTasks;
        progress.value = 100;
        isInitializing.value = false;
    }

    return { isInitializing, progress, begin, register, complete, finish };
});
