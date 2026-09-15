import { ref, watch, onMounted, onBeforeUnmount, type Ref } from 'vue';

const MIN_DISPLAY_MS = 400;

const isInitializing = ref(true);
const progress = ref(0);
let readyCount = 0;
let totalTasks = 0;

function setProgress() {
    progress.value = totalTasks > 0 ? Math.round((readyCount / totalTasks) * 100) : 100;
}

/**
 * Global app loader. Each page must call usePageInit() — the loading
 * overlay stays visible until every registered init task completes.
 *
 * @param gates Optional list of "readiness" sources: a boolean ref
 * (wait until true), a promise, or a boolean-returning function.
 */
export function usePageInit(gates: Array<Ref<boolean> | Promise<unknown> | (() => boolean)> = []) {
    totalTasks += gates.length + 1; // +1 for base init
    setProgress();

    let disposed = false;

    const completeOne = () => {
        readyCount++;
        setProgress();
    };

    const cleanupFns: Array<() => void> = [];

    async function run() {
        const tasks: Promise<unknown>[] = [
            // Base init: fonts + first paint
            (async () => {
                try {
                    if (document.fonts?.ready) await document.fonts.ready;
                } catch {
                    /* noop */
                }
                await new Promise((r) => requestAnimationFrame(() => r(null)));
                completeOne();
            })(),
        ];

        for (const gate of gates) {
            if (typeof gate === 'object' && 'value' in gate) {
                // Boolean ref — resolve when it flips to true
                if (gate.value) {
                    completeOne();
                    continue;
                }
                const stop = watch(gate, (v) => {
                    if (v) {
                        stop();
                        completeOne();
                    }
                });
                cleanupFns.push(() => stop());
            } else if (gate instanceof Promise) {
                gate.then(completeOne).catch(completeOne);
            } else if (typeof gate === 'function') {
                if (gate()) completeOne();
            }
        }

        await Promise.all(tasks);

        if (disposed) return;

        // Ensure minimum display time so the loader doesn't flash
        await new Promise((r) => setTimeout(r, Math.max(0, MIN_DISPLAY_MS)));

        if (readyCount < totalTasks) readyCount = totalTasks;
        progress.value = 100;
        isInitializing.value = false;
    }

    onMounted(() => {
        void run();
    });

    onBeforeUnmount(() => {
        disposed = true;
        cleanupFns.forEach((fn) => fn());
        // Reset for next navigation
        isInitializing.value = true;
        progress.value = 0;
        readyCount = 0;
        totalTasks = 0;
    });

    return { isInitializing, progress };
}

export function useAppLoaderState() {
    return { isInitializing, progress };
}
