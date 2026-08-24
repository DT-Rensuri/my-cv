import { tool } from '@langchain/core/tools';
import * as z from 'zod';
import { useAvatarStore } from '@/stores/avatar';
import { EMOTES, EMOTE_GIFS } from '@/stores/avatarEmotes';

/**
 * Changes the avatar's expression/emote. Pick the emote that best matches the
 * tone of what the avatar is saying or the situation the visitor is in.
 */
export const avatarEmoteTool = tool(
    async ({ emote }) => {
        const store = useAvatarStore();
        if (!EMOTES.includes(emote)) {
            return {
                success: false,
                message: `Emote không hợp lệ: ${emote}. Hợp lệ: ${EMOTES.join(', ')}.`,
            };
        }
        // Change the avatar face AND insert the matching image into the chat.
        store.setEmoteWithGif(emote, EMOTE_GIFS[emote].el);
        return { success: true, message: `Ok` };
    },
    {
        name: 'avatar_emote',
        description: `Changes the floating guide avatar's expression to one of the available emotes. Use it to react to the conversation and feel alive and friendly.`,
        schema: z.object({
            emote: z.enum(EMOTES)
                .describe(`Available emotes and when to use them:
${EMOTES.map((emote) => `- ${EMOTE_GIFS[emote].name}: ${EMOTE_GIFS[emote].description}`).join('\n')}
Pick the most fitting emote for the situation.`),
        }),
    },
);
