<script setup lang="ts">
import { Target } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCvData } from '@/composables/useCvData';
import { useRevealStore } from '@/stores/reveal';
import SectionHeading from './SectionHeading.vue';

const { t } = useI18n();
const { profile } = useCvData();
const revealStore = useRevealStore();
const el = ref<HTMLElement | null>(null);
const key = 'about';

onMounted(() => revealStore.register(key, el.value));
onUnmounted(() => revealStore.unregister(key));
</script>

<template>
  <section id="about" class="relative py-16 sm:py-24 bg-background">
    <div ref="el" :class="['reveal', revealStore.visible[key] ? 'is-visible' : '', 'mx-auto max-w-4xl px-4 sm:px-6']">
      <SectionHeading index="01" :title="t('about.title')" />

      <!-- NPC dialog box -->
      <div class="bg-panel pixel-border p-6 sm:p-8 crt-glow">
        <!-- NPC header -->
        <div class="flex items-center gap-3 mb-4 pb-4 border-b-4 border-line">
          <div class="grid place-items-center h-12 w-12 bg-accent text-background pixel-border-sm">
            <Target class="h-6 w-6" />
          </div>
          <div>
            <p class="font-pixel text-px-18 text-accent glow-cyan">{{ t('about.devLabel') }} {{ profile.name.toUpperCase() }}</p>
            <p class="font-pixel text-px-16 text-ink-dim mt-1">{{ t('about.classLabel') }}</p>
          </div>
          <span class="ml-auto font-pixel text-px-16 text-ink-dim blink">▼</span>
        </div>

        <!-- dialog text -->
        <p class="font-retro text-lg sm:text-xl leading-relaxed text-ink">
          <span class="text-success">&gt; </span>{{ profile.objective }}
        </p>

        <!-- dialog footer -->
        <div class="mt-5 pt-4 border-t-4 border-line flex items-center justify-between">
          <span class="font-pixel text-px-16 text-ink-dim">{{ t('about.dialogue') }}</span>
          <span class="font-pixel text-px-16 text-success blink">{{ t('about.continue') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
