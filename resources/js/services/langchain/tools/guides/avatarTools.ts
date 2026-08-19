import { tool } from '@langchain/core/tools';
import * as z from 'zod';
import { useAvatarStore } from '@/stores/avatar';
import { EMOTES, EMOTE_GIFS } from '@/stores/avatarEmotes';
import { resolveSectionId, SECTION_LABELS } from './dom';

/**
 * Shows the floating guide avatar and moves it to a position on the page
 * (either a named section or explicit x/y coordinates).
 */
export const moveAvatarTool = tool(
  async ({ section, x, y }) => {
    const store = useAvatarStore();
    let tx = x;
    let ty = y;

    if (section) {
      const id = resolveSectionId(section);
      if (!id) {
        return {
          success: false,
          message: `Không tìm thấy mục "${section}".`,
        };
      }
      const el = document.getElementById(id);
      if (!el) {
        return { success: false, message: `Không tìm thấy phần tử #${id}.` };
      }
      const rect = el.getBoundingClientRect();
      tx = rect.left + rect.width / 2 - 32;
      ty = rect.top + 40;
    }

    store.moveTo(tx ?? 0, ty ?? 0);
    return {
      success: true,
      message: section
        ? `Đã di chuyển avatar đến mục "${SECTION_LABELS[resolveSectionId(section)!]}".`
        : `Đã di chuyển avatar đến (${tx}, ${ty}).`,
    };
  },
  {
    name: 'move_avatar',
    description:
      'Shows and moves the floating guide avatar to a CV section or to explicit x/y coordinates on the page. Use this to make the guide walk around the portfolio.',
    schema: z.object({
      section: z
        .string()
        .optional()
        .describe('Tên mục để avatar di chuyển đến (top, about, education, experience, skills, contact).'),
      x: z.number().optional().describe('Tọa độ x (px) nếu không dùng section.'),
      y: z.number().optional().describe('Tọa độ y (px) nếu không dùng section.'),
    }),
  },
);

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
    return { success: true, message: `Avatar đã thể hiện cảm xúc: ${emote}.` };
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
