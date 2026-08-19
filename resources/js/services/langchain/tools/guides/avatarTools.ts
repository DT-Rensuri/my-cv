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
      return { success: false, message: `Emote không hợp lệ: ${emote}. Hợp lệ: ${EMOTES.join(', ')}.` };
    }
    // Change the avatar face AND insert the matching GIF into the chat.
    store.setEmoteWithGif(emote, EMOTE_GIFS[emote]);
    return { success: true, message: `Ok` };
  },
  {
    name: 'avatar_emote',
    description: `Changes the floating guide avatar's expression to one of the available emotes. Use it to react to the conversation and feel alive and friendly. Available emotes and when to use them:
- idle: neutral resting face (default)
- happy: being cheerful, greeting, good news
- wave: saying hello or goodbye
- think: thinking, considering a question
- point: pointing out a section or detail
- celebrate: celebrating a success, achievement, great news
- cool: being stylish or confident
- love / heart / heart2: expressing affection, liking something
- surprised / dazed / silly / naive: being surprised or confused
- angry / superAngry / slamTable: annoyed or angry about something
- crying / heartbroken / sad: expressing sadness or disappointment
- worried / scared / panicked / workStress / stressed: anxious or worried
- sleepy / dozing / lazy / buồn ngủ: sleepy or lazy
- hungry: wanting food
- loading / lag: loading or thinking (processing)
- tongue / lêu lêu / refuse: playful refusal or teasing
- ok / like / like2 / thumbs up: approval
- sulky / dỗi: sulking or pouting
- doubt / nghi ngờ: doubtful
- holdLaugh / nhịn cười: holding back laughter
- exploited: being overworked
- serious: being serious or stern
Pick the most fitting emote for the situation.`,
    schema: z.object({
      emote: z.enum(EMOTES).describe('Cảm xúc của avatar.'),
    }),
  },
);
