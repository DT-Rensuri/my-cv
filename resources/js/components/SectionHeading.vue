<script setup lang="ts">
defineProps<{ index: string; title: string }>();
</script>

<template>
  <div class="flex items-center gap-3 mb-8">
    <span class="font-pixel text-xs text-accent glow-cyan">{{ index }}</span>
    <h2 class="font-pixel text-sm sm:text-base text-ink uppercase">{{ title }}</h2>
    <span class="flex-1 h-1 bg-line" style="image-rendering: pixelated" />
  </div>
</template>
