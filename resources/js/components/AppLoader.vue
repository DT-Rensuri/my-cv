<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppLoaderStore } from '@/stores/appLoader';

const appLoaderStore = useAppLoaderStore();


// 8 segments block bar (retro)
const segments = computed(() =>
    Array.from({ length: 8 }, (_, i) => appLoaderStore.progress >= ((i + 1) / 8) * 100 - 5),
);

const messages = ['BOOTING SYSTEM', 'LOADING ASSETS', 'RENDERING PIXELS', 'ALMOST READY'];
const messageIndex = computed(() =>
    Math.min(messages.length - 1, Math.floor((appLoaderStore.progress / 100) * messages.length)),
);
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="appLoaderStore.isInitializing"
      class="fixed inset-0 z-[9999] overflow-hidden bg-background flex items-center justify-center"
      role="status" aria-live="polite"
    >
      <!-- Decorative overlays -->
      <div class="absolute inset-0 crt-scanlines pointer-events-none" />
      <div class="absolute inset-0 pixel-stars pointer-events-none" />

      <!-- Corner brackets -->
      <span class="absolute top-4 left-4 h-6 w-6 border-t-4 border-l-4 border-line" />
      <span class="absolute top-4 right-4 h-6 w-6 border-t-4 border-r-4 border-line" />
      <span class="absolute bottom-4 left-4 h-6 w-6 border-b-4 border-l-4 border-line" />
      <span class="absolute bottom-4 right-4 h-6 w-6 border-b-4 border-r-4 border-line" />

      <!-- Center card -->
      <div class="relative bg-panel pixel-border px-10 py-8 flex flex-col items-center gap-5 max-w-sm w-full mx-4">
        <!-- Title with blinking cursor -->
        <h2 class="font-pixel text-px-24 text-accent glow-cyan tracking-widest">
          RENSURI<span class="blink text-highlight">_</span>
        </h2>

        <!-- Block progress bar -->
        <div class="flex gap-1.5">
          <span
            v-for="(on, i) in segments"
            :key="i"
            class="h-4 w-6 pixel-border-sm transition-colors duration-150"
            :class="on ? 'bg-accent' : 'bg-panel opacity-40'"
          />
        </div>

        <!-- Status message + percent -->
        <div class="flex items-center justify-between w-full">
          <span class="font-pixel text-px-14 text-ink-muted">{{ messages[messageIndex] }}</span>
          <span class="font-pixel text-px-14 text-highlight">{{ appLoaderStore.progress }}%</span>
        </div>

        <!-- Loading dots -->
        <div class="flex gap-2">
          <span class="h-2 w-2 bg-success blink" />
          <span class="h-2 w-2 bg-success blink" style="animation-delay: 0.2s" />
          <span class="h-2 w-2 bg-success blink" style="animation-delay: 0.4s" />
        </div>
      </div>

      <!-- Footer hint -->
      <p class="absolute bottom-8 font-retro text-sm text-ink-muted">
        v1.0 &mdash; PIXEL EDITION
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.loader-fade-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
}
.loader-fade-enter-active {
    transition: opacity 0s;
}
.loader-fade-leave-to {
    opacity: 0;
    transform: scale(1.02);
}
</style>
