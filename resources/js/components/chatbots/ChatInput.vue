<script setup lang="ts">
import { ref } from 'vue';
import { Send } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useAgentStore } from '@/stores/agents';

const { t } = useI18n();
const agentStore = useAgentStore();

const emit = defineEmits<{
  (e: 'send', text: string): void;
}>();

const input = ref('');

const submit = () => {
  const content = input.value.trim();
  if (!content) return;
  emit('send', content);
  input.value = '';
};
</script>

<template>
  <div class="flex items-center gap-2 p-3 border-t-4 border-line bg-panel">
    <input v-model="input" @keydown.enter="submit()" type="text" :placeholder="t('chatbot.inputPlaceholder')"
      class="flex-1 bg-background px-3 py-2.5 font-retro text-base text-ink placeholder:text-ink-dim outline-none pixel-border-sm focus:border-success" />
    <button @click="submit()" :disabled="!input.trim() || agentStore.loading"
      class="grid place-items-center h-10 w-10 bg-success text-background pixel-border-sm pixel-press disabled:opacity-40 disabled:cursor-not-allowed"
      :aria-label="t('chatbot.send')">
      <Send class="h-4 w-4" />
    </button>
  </div>
</template>