import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Experience, SkillGroup, Highlight } from '@/types/cvData';

export function useCvData() {
    const { tm } = useI18n();

    const profile = computed(() => {
        const p = tm('cv.profile') as Record<string, string>;

        return {
            name: p.name,
            title: p.title,
            class: p.class,
            hp: 100,
            mp: 100,
            level: 99,
            phone: '0362547882',
            email: 'dothanhcao2502@gmail.com',
            github: 'github.com/dtrensuri',
            githubUrl: 'https://github.com/dtrensuri',
            address: p.address,
            objective: p.objective,
        };
    });

    const education = computed(() =>
        tm('cv.education') as {
            school: string;
            degree: string;
            time: string;
            achievement: string;
        },
    );

    const experiences = computed<Experience[]>(
        () => tm('cv.experiences') as Experience[],
    );

    const skillGroups = computed<SkillGroup[]>(
        () => tm('cv.skillGroups') as SkillGroup[],
    );

    const highlights = computed<Highlight[]>(
        () => tm('cv.highlights') as Highlight[],
    );

    const navLinks = computed(
        () => tm('cv.navLinks') as { label: string; href: string }[],
    );

    return {
        profile,
        education,
        experiences,
        skillGroups,
        highlights,
        navLinks,
    };
}