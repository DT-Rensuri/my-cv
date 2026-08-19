<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import { User } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import type { ChatMessage } from '@/types/chat';
import { useAgentStore } from '@/stores/agents';
import { useAvatarStore } from '@/stores/avatar';
import { EMOTE_GIFS } from '@/stores/avatarEmotes';
import { renderMarkdown } from '@/lib/markdown';

const { t } = useI18n();
const agentStore = useAgentStore();
const avatarStore = useAvatarStore();
const streamHtml = computed(() => renderMarkdown(agentStore.streamOutput));
const thinkingHtml = computed(() => renderMarkdown(agentStore.thinkingOutput));

// Live avatar face (GIF) reflecting the current emote, updates continuously.
const botFace = computed(() => EMOTE_GIFS[avatarStore.emote] ?? EMOTE_GIFS.idle);

const props = defineProps<{
  messages: ChatMessage[];
}>();

const el = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (el.value) {
      el.value.scrollTop = el.value.scrollHeight;
    }
  });
};

watch(
  () => [props.messages.length, agentStore.streamOutput, agentStore.thinkingOutput],
  () => scrollToBottom()
);


</script>

<template>
  <div ref="el" class="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background">
    <div v-for="(msg, i) in messages" :key="i" :class="['flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : '']">
      <span v-if="msg.role === 'bot'" class="shrink-0 grid place-items-center h-7 w-7 bg-primary text-background pixel-border-sm overflow-hidden">
        <img :src="botFace" alt="avatar" class="h-full w-full object-cover" draggable="false" />
      </span>
      <span v-else
        class="shrink-0 grid place-items-center h-7 w-7 bg-accent text-background pixel-border-sm">
        <User class="h-3.5 w-3.5" />
      </span>
      <div :class="[
        'min-w-0 max-w-[75%] px-3 py-2 font-retro text-base leading-relaxed pixel-border-sm break-words',
        msg.role === 'bot' ? 'bg-panel text-ink' : 'bg-accent text-background',
      ]">
        <!-- Render an inline GIF if the message carries an image -->
        <img v-if="msg.image" :src="msg.image" alt="emoji" class="max-w-full h-auto rounded pixel-border-sm my-1"
          draggable="false" />
        <!-- Render markdown for bot messages, plain text for user messages -->
        <div v-if="msg.role === 'bot' && msg.text" class="markdown-body" v-html="renderMarkdown(msg.text)"></div>
        <span v-else-if="msg.role === 'user'" class="break-words">{{ msg.text }}</span>
      </div>
    </div>

    <!-- Thinking indicator -->
    <div v-if="agentStore.loading && agentStore.isThinking" class="flex gap-2">
      <span class="shrink-0 grid place-items-center h-7 w-7 bg-primary text-background pixel-border-sm overflow-hidden">
        <img :src="botFace" alt="avatar" class="h-full w-full object-cover" draggable="false" />
      </span>
      <div
        class="min-w-0 max-w-[75%] px-3 py-2 bg-panel pixel-border-sm font-retro text-base leading-relaxed text-ink-dim break-words">
        <div class="markdown-body" v-html="thinkingHtml"></div>
        <!-- <span class="blink">{{ t('chatbot.thinking') }}</span>
        <span class="blink" style="animation-delay: 0.2s">.</span>
        <span class="blink" style="animation-delay: 0.4s">.</span>
        <span class="blink" style="animation-delay: 0.6s">.</span> -->
      </div>
    </div>

    <!-- Streaming bot bubble -->
    <div v-else-if="agentStore.loading && agentStore.isStreaming" class="flex gap-2">
      <span class="shrink-0 grid place-items-center h-7 w-7 bg-primary text-background pixel-border-sm overflow-hidden">
        <img :src="botFace" alt="avatar" class="h-full w-full object-cover" draggable="false" />
      </span>
      <div
        class="min-w-0 max-w-[75%] px-3 py-2 bg-panel text-ink font-retro text-base leading-relaxed pixel-border-sm break-words">
        <div class="markdown-body" v-html="streamHtml"></div>
        <span class="stream-cursor" aria-hidden="true"></span>
      </div>
    </div>

    <!-- Idle loading indicator -->
    <div v-else-if="agentStore.loading" class="flex gap-2">
      <span class="shrink-0 grid place-items-center h-7 w-7 bg-primary text-background pixel-border-sm overflow-hidden">
        <img :src="botFace" alt="avatar" class="h-full w-full object-cover" draggable="false" />
      </span>
      <div
        class="min-w-0 max-w-[75%] px-3 py-2 bg-panel pixel-border-sm font-pixel text-[9px] text-ink-dim break-words">
        <span class="blink">.</span>
        <span class="blink" style="animation-delay: 0.2s">.</span>
        <span class="blink" style="animation-delay: 0.4s">.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Blinking block cursor shown while streaming */
.stream-cursor {
  display: inline-block;
  width: 0.6em;
  height: 1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: var(--color-success);
  animation: stream-blink 0.8s steps(2, start) infinite;
}

@keyframes stream-blink {
  to {
    visibility: hidden;
  }
}

/* Markdown styling inside chat bubbles */
.markdown-body {
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
}

.markdown-body :deep(p) {
  margin: 0 0 0.5em;
}

.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0.25em 0 0.5em;
  padding-left: 1.25em;
}

.markdown-body :deep(li) {
  margin: 0.15em 0;
}

.markdown-body :deep(code) {
  background: rgba(0, 0, 0, 0.15);
  padding: 0.1em 0.35em;
  border-radius: 3px;
  font-size: 0.9em;
}

.markdown-body :deep(pre) {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.6em 0.8em;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0.4em 0;
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
}

.markdown-body :deep(strong) {
  font-weight: 700;
}

.markdown-body :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  font-weight: 700;
  margin: 0.4em 0 0.3em;
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--color-success);
  padding-left: 0.6em;
  margin: 0.4em 0;
  opacity: 0.9;
}
</style>