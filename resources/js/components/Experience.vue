<script setup lang="ts">
import { Briefcase, ChevronRight, MapPin, ScrollText } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCvData } from '@/composables/useCvData';
import { useRevealStore } from '@/stores/reveal';
import SectionHeading from './SectionHeading.vue';

const { t } = useI18n();
const { experiences } = useCvData();
const revealStore = useRevealStore();
const el = ref<HTMLElement | null>(null);
const key = 'experience';

onMounted(() => revealStore.register(key, el.value));
onUnmounted(() => revealStore.unregister(key));
</script>

<template>
  <section id="experience" class="relative py-16 sm:py-24 bg-app">
    <div ref="el" :class="['reveal', revealStore.visible[key] ? 'is-visible' : '', 'mx-auto max-w-4xl px-4 sm:px-6']">
      <SectionHeading index="03" :title="t('experience.title')" />

      <!-- quest log -->
      <div class="relative">
        <!-- timeline line -->
        <div class="absolute left-5 top-3 bottom-3 w-1 bg-[var(--color-line)]" />

        <div class="space-y-8">
          <div v-for="(exp, i) in experiences" :key="i" class="relative pl-14">
            <!-- marker -->
            <span
              :class="[
                'absolute left-0 top-1 grid place-items-center h-11 w-11 pixel-border-sm',
                exp.current ? 'bg-[var(--color-success)] text-[var(--color-background)]' : 'bg-panel text-[var(--color-accent)]',
              ]"
            >
              <Briefcase class="h-5 w-5" />
            </span>

            <!-- quest header -->
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 class="font-pixel text-sm text-app uppercase">{{ exp.role }}</h3>
              <span
                v-if="exp.current"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-success)] text-[var(--color-background)] font-pixel text-px-16"
              >
                <span class="h-1.5 w-1.5 bg-[var(--color-background)] blink" /> {{ t('experience.active') }}
              </span>
            </div>

            <p class="mt-1.5 font-retro text-lg text-[var(--color-accent)]">{{ exp.company }}</p>
            <p class="mt-0.5 font-pixel text-px-16 text-dim inline-flex items-center gap-1.5">
              <MapPin class="h-3 w-3" /> {{ exp.time }}
            </p>

            <!-- quest summary -->
            <p v-if="exp.summary" class="mt-3 font-retro text-base text-muted leading-relaxed">
              <span class="text-[var(--color-success)]">&gt; </span>{{ exp.summary }}
            </p>

            <!-- quest sub-quests -->
            <div v-if="exp.projects" class="mt-5 space-y-3">
              <div
                v-for="(p, j) in exp.projects"
                :key="j"
                class="bg-panel pixel-border-sm p-4 hover:border-app-light transition-colors"
              >
                <h4 class="flex items-center gap-2 font-pixel text-px-18 text-[var(--color-warning)] glow-yellow">
                  <ScrollText class="h-4 w-4 shrink-0" />
                  {{ p.name }}
                </h4>
                <ul class="mt-3 space-y-2">
                  <li
                    v-for="(point, k) in p.points"
                    :key="k"
                    class="flex gap-2 font-retro text-base text-muted leading-relaxed"
                  >
                    <ChevronRight class="h-4 w-4 text-[var(--color-success)] shrink-0 mt-0.5" />
                    {{ point }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
