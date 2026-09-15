<script setup lang="ts">
import { Cpu, Layout, Server, Sparkles  } from 'lucide-vue-next';
import type {LucideIcon} from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRevealStore } from '@/stores/reveal';
import SectionHeading from './SectionHeading.vue';
import { useCvData } from '@/composables/useCvData';

const { t } = useI18n();
const { skillGroups } = useCvData();
const revealStore = useRevealStore();
const el = ref<HTMLElement | null>(null);
const key = 'skills';

onMounted(() => revealStore.register(key, el.value));
onUnmounted(() => revealStore.unregister(key));

const icons: Record<string, LucideIcon> = {
  server: Server,
  layout: Layout,
  sparkles: Sparkles,
  cpu: Cpu,
};
</script>

<template>
  <section id="skills" class="relative py-16 sm:py-24 bg-background-alt">
    <div ref="el" :class="['reveal', revealStore.visible[key] ? 'is-visible' : '', 'mx-auto max-w-5xl px-4 sm:px-6']">
      <SectionHeading index="04" :title="t('skills.title')" />

      <!-- inventory grid -->
      <div class="grid sm:grid-cols-2 gap-4 sm:gap-5">
        <div
          v-for="group in skillGroups"
          :key="group.label"
          class="bg-panel pixel-border-sm p-5 hover:border-line-light transition-colors"
        >
          <!-- category header -->
          <div class="flex items-center gap-3 pb-3 mb-4 border-b-4 border-line">
            <span class="grid place-items-center h-10 w-10 bg-background-alt pixel-border-sm">
              <component :is="icons[group.icon]" class="h-5 w-5 text-accent" />
            </span>
            <h3 class="font-pixel text-px-18 text-ink uppercase">{{ group.label }}</h3>
          </div>

          <!-- skill badges as inventory items -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in group.skills"
              :key="skill"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background-alt pixel-border-sm font-retro text-base text-ink hover:text-success hover:border-success transition-colors"
            >
              <span class="h-2 w-2 bg-success" />
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
