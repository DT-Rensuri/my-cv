import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { AvatarEmote } from './avatarEmotes';

/**
 * Drives the floating guide avatar + speech bubble that the agent can move
 * around the page and use to talk to the visitor.
 */
export const useAvatarStore = defineStore('avatar', () => {
  const x = ref(0); // px from left of viewport
  const y = ref(0); // px from top of viewport
  const emote = ref<AvatarEmote>('idle');
  const bubbleText = ref('');
  const bubbleVisible = ref(false);
  const bubbleTimeout = ref<number | null>(null);
  /** Set by the avatar_emote tool to insert a GIF into the chat. */
  const pendingEmoteGif = ref<string | null>(null);

  const AVATAR_SIZE = 64; // px (matches the clamp in moveTo)
  const HOME_PADDING = 20; // px from the bottom-right edges

  const windowWidth = ref(0);
  const windowHeight = ref(0);

  /** Returns the avatar to its resting position at the bottom-right corner. */
  function goBack() {
    x.value = windowWidth.value - AVATAR_SIZE - HOME_PADDING;
    y.value = windowHeight.value - AVATAR_SIZE - HOME_PADDING;
  }

  function moveTo(nx: number, ny: number) {
    x.value = Math.max(0, Math.min(nx, windowWidth.value - AVATAR_SIZE));
    y.value = Math.max(0, Math.min(ny, windowHeight.value - AVATAR_SIZE));
  }

  function setEmote(e: AvatarEmote) {
    emote.value = e;
  }

  /**
   * Sets the emote AND queues a GIF to be inserted into the chat as a bot
   * message. The ChatBot component watches `pendingEmoteGif` and appends it.
   */
  function setEmoteWithGif(e: AvatarEmote, gifUrl: string) {
    emote.value = e;
    pendingEmoteGif.value = gifUrl;
  }

  /** Consumes (clears) the pending GIF after it has been inserted into chat. */
  function consumePendingGif() {
    pendingEmoteGif.value = null;
  }

  function say(text: string, durationMs = 4000) {
    bubbleText.value = text;
    bubbleVisible.value = true;
    if (bubbleTimeout.value) window.clearTimeout(bubbleTimeout.value);
    bubbleTimeout.value = window.setTimeout(() => {
      bubbleVisible.value = false;
      bubbleText.value = '';
      setEmote('idle');
    }, durationMs);
  }

  function think(text: string, durationMs = 4000) {
    bubbleText.value = text;
    bubbleVisible.value = true;
    if (bubbleTimeout.value) window.clearTimeout(bubbleTimeout.value);
    bubbleTimeout.value = window.setTimeout(() => {
      bubbleVisible.value = false;
      bubbleText.value = '';
      setEmote('idle');
    }, durationMs);
  }

  function clearBubble() {
    if (bubbleTimeout.value) window.clearTimeout(bubbleTimeout.value);
    bubbleVisible.value = false;
    bubbleText.value = '';
  }

  return {
    x,
    y,
    emote,
    bubbleText,
    bubbleVisible,
    pendingEmoteGif,
    windowWidth,
    windowHeight,
    moveTo,
    goBack,
    setEmote,
    setEmoteWithGif,
    consumePendingGif,
    say,
    think,
    clearBubble,
  };
});