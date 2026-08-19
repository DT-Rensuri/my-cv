import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useActiveSectionStore = defineStore('activeSection', () => {
    const active = ref('');
    const ids = ref<string[]>([]);

    let onScroll: (() => void) | null = null;

    function init(sectionIds: string[]) {
        ids.value = sectionIds;
        active.value = sectionIds[0] ?? '';

        cleanup();

        onScroll = () => {
            update();
        };

        window.addEventListener('scroll', onScroll, {
            passive: true,
        });

        window.addEventListener('resize', onScroll, {
            passive: true,
        });

        // Update once on init
        update();
    }

    function update() {
        if (ids.value.length === 0) {
            return;
        }

        // Navbar height (~64px) + buffer
        const offset = 100;
        const line = offset;

        let current = ids.value[0];

        for (const id of ids.value) {
            const el = document.getElementById(id);

            if (!el) {
                continue;
            }

            const rect = el.getBoundingClientRect();

            // Section occupies the active area near the top
            if (rect.top <= line && rect.bottom > line) {
                current = id;
                break;
            }

            // Section is above the active line
            if (rect.top <= line) {
                current = id;
            }
        }

        // Force last section when near bottom
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;

        if (window.scrollY + winHeight >= docHeight - 4) {
            current = ids.value[ids.value.length - 1];
        }

        if (current !== active.value) {
            active.value = current;
        }
    }

    function cleanup() {
        if (!onScroll) {
            return;
        }

        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);

        onScroll = null;
    }

    return {
        active,
        ids,
        init,
        update,
        cleanup,
    };
});