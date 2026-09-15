import { tool } from '@langchain/core/tools';
import * as z from 'zod';

import i18n from '@/i18n';

import type { Experience, SkillGroup, Highlight } from '@/types/cvData';

import {
    resolveSectionId,
    scrollToSection,
    spotlightSection,
    SECTION_LABELS,
    SECTION_IDS,
} from './dom';

/**
 * Supported CV languages.
 */
type CvLocale = 'vi' | 'en' | 'ja';

/**
 * CV data structure.
 */
interface CvData {
    profile: {
        name: string;
        title: string;
        class: string;
        hp: number;
        mp: number;
        level: number;
        phone: string;
        email: string;
        github: string;
        githubUrl: string;
        address: string;
        objective: string;
    };

    education: {
        school: string;
        degree: string;
        time: string;
        achievement: string;
    };

    experiences: Experience[];

    skillGroups: SkillGroup[];

    highlights: Highlight[];

    navLinks: {
        label: string;
        href: string;
    }[];
}

/**
 * Returns CV data for the requested language.
 *
 * This function does NOT modify i18n.global.locale.
 * Therefore, the agent can request English CV data while
 * the website UI remains in Vietnamese, for example.
 */
function getCvData(locale: CvLocale = 'vi'): CvData {
    locale = localStorage.getItem('app_locale') as CvLocale || locale;
    const messages = i18n.global.getLocaleMessage(locale) as {
        cv: CvData;
    };

    if (!messages?.cv) {
        throw new Error(`CV data not found for locale: ${locale}`);
    }

    return messages.cv;
}

/**
 * Returns the complete CV / portfolio data.
 *
 * The agent can explicitly request:
 *
 * {
 *   locale: "vi"
 * }
 *
 * or:
 *
 * {
 *   locale: "en"
 * }
 *
 * or:
 *
 * {
 *   locale: "ja"
 * }
 */
export const getCvDataTool = tool(
    async ({ locale }) => {
        try {
            const cv = getCvData(locale);

            return JSON.stringify(cv, null, 2);
        } catch (error) {
            console.error('[get_cv_data]', error);

            return JSON.stringify({
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to load CV data.',
            });
        }
    },
    {
        name: 'get_cv_data',

        description:
            'Returns the complete CV / portfolio data in the requested language. Use this tool whenever you need factual information about the person, including profile, education, experience, skills, highlights, contact information, or navigation links.',

        schema: z.object({
            locale: z
                .enum(['vi', 'en', 'ja'])
                .default('vi')
                .describe(
                    'Language of the CV data. Use "vi" for Vietnamese, "en" for English, or "ja" for Japanese.',
                ),
        }),
    },
);

/**
 * Scrolls the page to a specific CV section.
 *
 * The section can optionally be highlighted after scrolling.
 */
export const navigateToSectionTool = tool(
    async ({ section, highlight }) => {
        const id = resolveSectionId(section);

        if (!id) {
            return {
                success: false,

                message:
                    `Không tìm thấy mục "${section}". ` +
                    `Các mục hợp lệ: ${SECTION_IDS.join(', ')}.`,
            };
        }

        const ok = scrollToSection(id);

        if (highlight) {
            spotlightSection(id);
        }

        return {
            success: ok,
            section: id,
            label: SECTION_LABELS[id],

            message: ok
                ? `Đã di chuyển đến mục "${SECTION_LABELS[id]}"${
                      highlight ? ' và làm nổi bật nó' : ''
                  }.`
                : `Không tìm thấy phần tử #${id}.`,
        };
    },

    {
        name: 'navigate_to_section',

        description:
            'Scrolls the page to a CV section such as top, about, education, experience, skills, or contact. Optionally highlights the section so the visitor can visually follow the assistant.',

        schema: z.object({
            section: z
                .string()
                .describe(
                    'Tên hoặc id của mục cần di chuyển đến. ' +
                        'Các mục: top, about, education, experience, skills, contact.',
                ),

            highlight: z
                .boolean()
                .optional()
                .default(false)
                .describe('Nếu true, làm nổi bật mục đó trong vài giây.'),
        }),
    },
);

/**
 * Highlights a CV section without scrolling.
 *
 * Useful when the visitor is already viewing the section.
 */
export const highlightSectionTool = tool(
    async ({ section }) => {
        const id = resolveSectionId(section);

        if (!id) {
            return {
                success: false,

                message:
                    `Không tìm thấy mục "${section}". ` +
                    `Các mục hợp lệ: ${SECTION_IDS.join(', ')}.`,
            };
        }

        const ok = spotlightSection(id);

        return {
            success: ok,

            section: id,

            label: SECTION_LABELS[id],

            message: ok
                ? `Đã làm nổi bật mục "${SECTION_LABELS[id]}".`
                : `Không tìm thấy phần tử #${id}.`,
        };
    },

    {
        name: 'highlight_section',

        description:
            'Temporarily highlights a CV section on the page to draw the visitor attention. Does not scroll the page.',

        schema: z.object({
            section: z
                .string()
                .describe(
                    'Tên hoặc id của mục cần làm nổi bật. ' +
                        'Các mục: top, about, education, experience, skills, contact.',
                ),
        }),
    },
);

/**
 * Export all CV-related tools.
 *
 * Useful when creating the LangChain agent.
 */
export const cvTools = [
    getCvDataTool,
    navigateToSectionTool,
    highlightSectionTool,
];
