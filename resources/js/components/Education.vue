<script setup lang="ts">
import { GraduationCap, Award, CalendarDays, Building2 } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCvData } from '@/composables/useCvData';
import { useRevealStore } from '@/stores/reveal';
import SectionHeading from './SectionHeading.vue';

const { t } = useI18n();
const { education } = useCvData();
const revealStore = useRevealStore();
const el = ref<HTMLElement | null>(null);
const key = 'education';

onMounted(() => revealStore.register(key, el.value));
onUnmounted(() => revealStore.unregister(key));
</script>

<template>
  <section id="education" class="relative py-16 sm:py-24 bg-background-alt">
    <div ref="el" :class="['reveal', revealStore.visible[key] ? 'is-visible' : '', 'mx-auto max-w-4xl px-4 sm:px-6']">
      <SectionHeading index="02" :title="t('education.title')" />

      <!-- education card as stat panel -->
      <div class="bg-panel pixel-border overflow-hidden">
        <!-- header bar -->
        <div class="bg-primary text-background px-5 py-3 flex items-center gap-2">
          <GraduationCap class="h-5 w-5" />
          <span class="font-pixel text-px-18">{{ t('education.record') }}</span>
        </div>

        <!-- school name -->
        <div class="p-5 sm:p-6 border-b-4 border-line">
          <h3 class="font-pixel text-xs sm:text-sm text-ink leading-relaxed">{{ education.school }}</h3>
        </div>

        <!-- stats grid -->
        <div class="grid sm:grid-cols-3 divide-x-4 divide-line sm:divide-y-0 divide-y-4">
          <div class="p-5">
            <div class="flex items-center gap-2 mb-2">
              <Building2 class="h-4 w-4 text-accent" />
              <span class="font-pixel text-px-16 text-ink-dim">{{ t('education.degree') }}</span>
            </div>
            <p class="font-retro text-base text-ink">{{ education.degree }}</p>
          </div>
          <div class="p-5">
            <div class="flex items-center gap-2 mb-2">
              <CalendarDays class="h-4 w-4 text-[var(--ink)]" />
              <span class="font-pixel text-px-16 text-ink-dim">{{ t('education.period') }}</span>
            </div>
            <p class="font-pixel text-px-16 text-ink">{{ education.time }}</p>
          </div>
          <div class="p-5">
            <div class="flex items-center gap-2 mb-2">
              <Award class="h-4 w-4 text-success" />
              <span class="font-pixel text-px-16 text-ink-dim">{{ t('education.rank') }}</span>
            </div>
            <p class="font-retro text-base text-ink" v-html="education.achievement"></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
