import { tool } from '@langchain/core/tools';
import * as z from 'zod';

import { useAgentStore } from '@/stores/agents';

export const makeChoicesOptionsTool = tool(
    async (input: { choices: string[] }) => {
        const store = useAgentStore();
        const { choices } = input;
        if (!choices || choices.length === 0) {
            return {
                success: false,
                message: 'No choices provided.',
            };
        }

        store.suggestions = choices;

        return {
            success: true,
            message: 'Choices processed successfully.',
        };
    },
    {
        name: 'make_choices_options',
        description:
            'Given a list of choices, return a string that contains the choices formatted as a numbered list, with each choice on a new line. The output should be suitable for display in a user interface.',
        schema: z.object({
            choices: z
                .array(z.string())
                .describe(
                    'A list of choices to format as a numbered list. Each choice should be a string.',
                ),
        }),
    },
);