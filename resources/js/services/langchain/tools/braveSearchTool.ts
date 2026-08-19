import { tool } from '@langchain/core/tools';
import * as z from 'zod';
import { BraveSearchRequest } from '@/types/brave';
import { searchBrave } from '@/services/brave';

export const braveSearchTool = tool(
    async (input) => {
        const {
            q,
            country,
            search_lang,
            count,
            offset,
            safesearch,
            spellcheck,
            freshness,
        } = input;
        const params: Partial<BraveSearchRequest> = {
            q,
            country,
            search_lang,
            count,
            offset,
            safesearch,
            spellcheck,
            freshness,
        };

        // Implement the Brave Search API call here using the provided parameters
        // For demonstration purposes, we'll return a mock response
        console.log(
            `Searching for "${q}" with parameters: country=${country}, search_lang=${search_lang}, count=${count}, offset=${offset}, safesearch=${safesearch}, spellcheck=${spellcheck}, freshness=${freshness}`,
        );
        return await searchBrave(params);
    },
    {
        name: 'search_browser',
        description: 'This tool allows you to search the web using Brave Search. Provide a query and optional parameters to refine your search.',
        schema: z.object({
            q: z.string().describe('The search query.'),
            country: z
                .enum(['US', 'JP'])
                .optional()
                .describe('The country code for the search.'),
            search_lang: z
                .enum(['en', 'ja'])
                .optional()
                .describe('The language for the search results.'),
            count: z
                .number()
                .int()
                .max(20)
                .optional()
                .describe('The number of results to return (max 20).'),
            offset: z
                .number()
                .int()
                .max(9)
                .optional()
                .describe(
                    'The offset for the search results (max 9, default 0).',
                ),
            safesearch: z
                .enum(['moderate', 'off', 'strict'])
                .optional()
                .describe('The safe search level (default "moderate").'),
            spellcheck: z
                .enum(['true', 'false'])
                .optional()
                .describe('Whether to enable spellcheck (default "true").'),
            freshness: z
                .enum(['pd', 'pw', 'pm', 'py'])
                .optional()
                .describe('The freshness of the results (default "").'),
        }),
    },
);
