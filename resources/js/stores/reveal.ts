import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useRevealStore = defineStore('reveal', () => {
    const visible = ref<Record<string, boolean>>({});
    const observers = ref<Record<string, IntersectionObserver>>({});

    function register(key: string, el: HTMLElement | null) {
        if (!el || observers.value[key]) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visible.value[key] = true;

                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -8% 0px',
            },
        );

        observer.observe(el);
        observers.value[key] = observer;
    }

    function unregister(key: string) {
        observers.value[key]?.disconnect();

        delete observers.value[key];
        delete visible.value[key];
    }

    return {
        visible,
        observers,
        register,
        unregister,
    };
});