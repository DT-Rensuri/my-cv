<script setup lang="ts">
import { MessageSquare } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    open: boolean;
  }>(),
  { open: false },
);

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();
</script>

<template>
  <button
    @click="emit('toggle')"
    :class="[
      'fixed bottom-5 right-5 z-[60] grid place-items-center h-14 w-14 pixel-border-sm pixel-press transition-all',
      open ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100',
    ]"
    :style="{ background: 'var(--color-success)', color: 'var(--color-background)' }"
    aria-label="Mở chat"
  >
    <MessageSquare class="h-6 w-6" />
    <span class="absolute -top-1 -right-1 h-3 w-3 bg-highlight blink pixel-border-sm" />
  </button>
</template>