<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCvData } from '@/composables/useCvData';
import { useAgentStore } from '@/stores/agents';
import { useAvatarStore } from '@/stores/avatar';
import { EMOTE_GIFS } from '@/stores/avatarEmotes';
import ChatHeader from './ChatHeader.vue';
import ChatMessages from './ChatMessages.vue';
import ChatInput from './ChatInput.vue';
import type { ChatMessage } from '@/types/chat';
import { renderMarkdown } from '@/lib/markdown';

const { t, tm, locale } = useI18n();
const agentStore = useAgentStore();
const { profile, education } = useCvData();
const avatarStore = useAvatarStore();
const open = ref(false);

// --- Floating guide avatar (merged with the chat trigger) ---
const emoteFaces = EMOTE_GIFS;

const face = computed(() => emoteFaces[avatarStore.emote] ?? emoteFaces.idle);
const avatarPos = computed(() => ({
    left: avatarStore.x + 'px',
    top: avatarStore.y + 'px',
}));

// Speech bubble placement: always show on the side with the most free space
// so it never overflows off-screen.
const bubblePos = computed(() => {
    const avatarSize = 56; // w-14
    const margin = 12;

    const spaceRight = avatarStore.windowWidth - (avatarStore.x + avatarSize);
    const spaceLeft = avatarStore.x;
    const spaceBottom = avatarStore.windowHeight - (avatarStore.y + avatarSize);
    const spaceTop = avatarStore.y;

    const placeRight = spaceRight >= spaceLeft;
    const placeBelow = spaceBottom >= spaceTop;

    const style: Record<string, string> = {};

    if (placeRight) {
        style.left = 'calc(100% + ' + margin + 'px)';
        style.right = 'auto';
    } else {
        style.right = 'calc(100% + ' + margin + 'px)';
        style.left = 'auto';
    }

    if (placeBelow) {
        style.top = '0';
        style.bottom = 'auto';
    } else {
        style.bottom = '100%';
        style.top = 'auto';
    }

    return style;
});

// Tail (arrow) placement, opposite to the bubble side so it points at the avatar.
const bubbleTailPos = computed(() => {
    const placeRight = avatarStore.windowWidth - (avatarStore.x + 56) >= avatarStore.x;
    const placeBelow = avatarStore.windowHeight - (avatarStore.y + 56) >= avatarStore.y;

    const style: Record<string, string> = {};

    if (placeRight) {
        style.left = '0';
        style.right = 'auto';
        style.transform = 'translateX(-50%)';
    } else {
        style.right = '0';
        style.left = 'auto';
        style.transform = 'translateX(50%)';
    }

    if (placeBelow) {
        style.bottom = '-8px';
        style.top = 'auto';
    } else {
        style.top = '-8px';
        style.bottom = 'auto';
    }

    return style;
});

// The tail triangle points toward the avatar: down when the bubble is above,
// up when the bubble is below.
const bubbleTailClass = computed(() => {
    const placeBelow = avatarStore.windowHeight - (avatarStore.y + 56) >= avatarStore.y;
    return placeBelow
        ? 'border-t-8 border-t-line border-l-transparent border-r-transparent border-b-0'
        : 'border-b-8 border-b-line border-l-transparent border-r-transparent border-t-0';
});

const messages = ref<ChatMessage[]>([
    {
        role: 'bot',
        text: t('chatbot.greeting', { name: profile.value.name }),
    },
]);

const suggestions = computed<string[]>(() => {
    const raw =
        messages.value.length <= 1
            ? tm('chatbot.suggestions')
            : agentStore.suggestions;

    if (!Array.isArray(raw)) {
        console.warn('Invalid suggestions:', raw);
        return [];
    }

    return raw.map((s) =>
        s.replaceAll('{name}', profile.value.name),
    );
});

// Reset the greeting when the language changes.
watch(locale, () => {
    messages.value = [
        {
            role: 'bot',
            text: t('chatbot.greeting', { name: profile.value.name }),
        },
    ];
});

// When the AI calls avatar_emote, insert the matching GIF into the chat.
watch(
    () => avatarStore.pendingEmoteGif,
    (gif) => {
        if (!gif) return;
        messages.value.push({ role: 'bot', text: '', image: gif });
        avatarStore.consumePendingGif();
    },
);

// Fallback heuristic reply, used when the AI agent is unreachable or returns nothing.
const getBotReply = (text: string): string => {
    const q = text.toLowerCase();
    const fb = (key: string, params?: Record<string, unknown>) =>
        t(`chatbot.fallback.${key}`, {
            name: profile.value.name,
            phone: profile.value.phone,
            email: profile.value.email,
            github: profile.value.github,
            address: profile.value.address,
            degree: education.value.degree,
            level: profile.value.level,
            ...params,
        });

    if (/(kinh nghiệm|experience|làm việc|work)/i.test(q)) {
        return fb('experience');
    }
    if (/(kỹ năng|skill|năng lực)/i.test(q)) {
        return fb('skills');
    }
    if (/(liên hệ|contact|email|phone|sđt|gọi)/i.test(q)) {
        return fb('contact');
    }
    if (/(học vấn|education|trường|đại học|by cấp)/i.test(q)) {
        return fb('education');
    }
    if (/(mục tiêu|objective|định hướng)/i.test(q)) {
        return fb('objective');
    }
    if (/(ai|bạn|bạn là|tên)/i.test(q)) {
        return fb('who');
    }
    if (/(cv|download|tải)/i.test(q)) {
        return fb('cv');
    }
    if (/(hello|hi|chào|xin chào)/i.test(q)) {
        return fb('hello');
    }

    return fb('unknown');
};

const send = async (text?: string) => {
    const content = (text ?? '').trim();
    if (!content || agentStore.loading) return;

    messages.value.push({ role: 'user', text: content });

    try {
        const reply = await agentStore.streamAgent({ role: 'user', content: content });
        messages.value.push({ role: 'bot', text: reply?.trim() || getBotReply(content) });
    } catch {
        messages.value.push({ role: 'bot', text: getBotReply(content) });
    }
};

const toggle = () => {
    open.value = !open.value;
};

// Opening the chat hides the avatar until it is closed again.
const openChat = () => {
    open.value = true;
};

const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') open.value = false;
};

onMounted(() => {
    avatarStore.goBack();
    window.addEventListener('keydown', onKey);
});
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <!-- Floating guide avatar as the chat trigger -->
    <Transition name="avatar">
        <div v-if="!open" :style="avatarPos" class="fixed z-[70] w-14 h-14 select-none">
            <!-- speech bubble -->
            <div v-if="avatarStore.bubbleVisible" :style="bubblePos"
                class="absolute w-max max-w-[280px] sm:max-w-[360px] md:max-w-[420px] px-3 py-2 bg-panel text-ink pixel-border text-sm font-retro leading-snug break-words overflow-hidden">
                <span class="blink">&gt;</span>
                <span class="ml-1" v-html="renderMarkdown(avatarStore.bubbleText?.slice(-500) ?? '')" />
                <span :style="bubbleTailPos" :class="['absolute w-0 h-0', bubbleTailClass]" />
            </div>

            <!-- avatar body -->
            <button @click="openChat"
                class="grid place-items-center h-full w-full bg-primary text-background pixel-border-sm pixel-press avatar-bob overflow-hidden"
                :aria-label="t('chatbot.openTooltip')" :title="t('chatbot.openTooltip')">
                <img :src="face" alt="avatar" class="h-full w-full object-cover" draggable="false" />
            </button>
        </div>
    </Transition>

    <Transition name="chat">
        <div v-if="open"
            class="fixed bottom-5 right-5 z-[60] w-[calc(100vw-2.5rem)] sm:w-130 max-h-[60vh] flex flex-col bg-panel pixel-border">
            <ChatHeader @close="toggle" />
            <ChatMessages :messages="messages" :suggestions="agentStore.enableSuggestions ? suggestions : []" @select="send" />
            <ChatInput @send="send" />
        </div>
    </Transition>
</template>

<style scoped>
.chat-enter-active,
.chat-leave-active {
    transition: opacity 0.2s steps(4), transform 0.2s steps(4);
}

.chat-enter-from,
.chat-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
}

.avatar-enter-active,
.avatar-leave-active {
    transition: opacity 0.2s steps(3);
}

.avatar-enter-from,
.avatar-leave-to {
    opacity: 0;
}

.bubble-enter-active,
.bubble-leave-active {
    transition: opacity 0.15s steps(3);
}

.bubble-enter-from,
.bubble-leave-to {
    opacity: 0;
}

@keyframes bob {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-4px);
    }
}

.avatar-bob {
    animation: bob 1.6s steps(2) infinite;
}
</style>
