<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useCvData } from '@/composables/useCvData';
import { useAvatarStore } from '@/stores/avatar';
import { EMOTE_GIFS } from '@/stores/avatarEmotes';
import { computed } from 'vue';

const { t } = useI18n();
const { profile } = useCvData();
const avatarStore = useAvatarStore();

const face = computed(() => EMOTE_GIFS[avatarStore.emote] ?? EMOTE_GIFS.idle);

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div class="flex items-center gap-3 px-4 py-3 bg-primary text-background">
    <span class="grid place-items-center h-9 w-9 bg-background text-primary pixel-border-sm overflow-hidden">
      <img :src="face" alt="avatar" class="h-full w-full object-cover" draggable="false" />
    </span>
    <div class="flex-1 min-w-0">
      <p class="font-pixel text-[9px]">{{ t('chatbot.header') }} {{ t('chatbot.headerName') }}</p>
      <p class="font-pixel text-[7px] opacity-70 mt-0.5">{{ t('chatbot.online') }} {{ profile.level }}</p>
    </div>
    <button
      @click="emit('close')"
      class="grid place-items-center h-8 w-8 bg-background text-primary pixel-border-sm pixel-press"
      :aria-label="t('chatbot.close')"
    >
      <X class="h-4 w-4" />
    </button>
  </div>
</template>