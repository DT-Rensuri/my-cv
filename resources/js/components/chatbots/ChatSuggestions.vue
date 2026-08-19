<script setup lang="ts">
defineProps<{
  suggestions: string[];
}>();

const emit = defineEmits<{
  (e: 'select', suggestion: string): void;
}>();
</script>

<template>
  <div v-if="suggestions.length" class="px-4 pb-2 flex flex-wrap gap-1.5 bg-background">
    <button
      v-for="s in suggestions"
      :key="s"
      @click="emit('select', s)"
      class="px-2.5 py-1.5 bg-panel pixel-border-sm font-retro text-sm text-ink-muted hover:text-success hover:border-success transition-colors"
    >
      {{ s }}
    </button>
  </div>
</template>