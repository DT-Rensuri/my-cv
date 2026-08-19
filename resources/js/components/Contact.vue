<script setup lang="ts">
import { ArrowUpRight, Mail, MapPin, Phone, ArrowUp } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCvData } from '@/composables/useCvData';
import { useRevealStore } from '@/stores/reveal';
import GithubIcon from '@/components/icons/GithubIcon.vue';

const { t } = useI18n();
const { profile } = useCvData();
const revealStore = useRevealStore();
const el = ref<HTMLElement | null>(null);
const key = 'contact';

onMounted(() => revealStore.register(key, el.value));
onUnmounted(() => revealStore.unregister(key));

const contacts = computed(() => [
  { icon: Phone, label: t('contact.phone'), value: profile.value.phone, href: `tel:${profile.value.phone}` },
  { icon: Mail, label: 'Email', value: profile.value.email, href: `mailto:${profile.value.email}` },
  { icon: GithubIcon, label: 'GitHub', value: profile.value.github, href: profile.value.githubUrl },
  { icon: MapPin, label: t('contact.address'), value: profile.value.address, href: undefined },
]);

const year = new Date().getFullYear();
</script>

<template>
  <section id="contact" class="relative py-16 sm:py-24 bg-background overflow-hidden">
    <!-- starfield bg -->
    <div class="absolute inset-0 pixel-stars opacity-30 pointer-events-none" />

    <div ref="el" :class="['reveal', revealStore.visible[key] ? 'is-visible' : '', 'relative mx-auto max-w-4xl px-4 sm:px-6']">
      <div class="text-center">
        <p class="font-pixel text-xs text-accent glow-cyan">05</p>
        <h2 class="mt-3 font-pixel text-base sm:text-xl text-ink uppercase">{{ t('contact.heading') }}</h2>
        <p class="mt-4 max-w-xl mx-auto font-retro text-lg text-ink-muted leading-relaxed">
          {{ t('contact.subtitle') }}
        </p>
      </div>

      <!-- contact menu -->
      <div class="mt-10 grid sm:grid-cols-2 gap-3 sm:gap-4">
        <template v-for="c in contacts" :key="c.label">
          <a
            v-if="c.href"
            :href="c.href"
            :target="c.href.startsWith('http') ? '_blank' : undefined"
            rel="noreferrer"
            class="group bg-panel pixel-border-sm p-4 flex items-center gap-4 hover:border-success pixel-press transition-colors"
          >
            <span class="shrink-0 grid place-items-center h-11 w-11 bg-background-alt pixel-border-sm">
              <component :is="c.icon" class="h-5 w-5 text-accent" />
            </span>
            <div class="min-w-0">
              <p class="font-pixel text-px-16 text-ink-dim uppercase">{{ c.label }}</p>
              <p class="font-retro text-base text-ink truncate">{{ c.value }}</p>
            </div>
            <ArrowUpRight class="ml-auto h-4 w-4 text-ink-dim group-hover:text-success shrink-0" />
          </a>
          <div
            v-else
            class="bg-panel pixel-border-sm p-4 flex items-center gap-4"
          >
            <span class="shrink-0 grid place-items-center h-11 w-11 bg-background-alt pixel-border-sm">
              <component :is="c.icon" class="h-5 w-5 text-accent" />
            </span>
            <div class="min-w-0">
              <p class="font-pixel text-px-16 text-ink-dim uppercase">{{ c.label }}</p>
              <p class="font-retro text-base text-ink truncate">{{ c.value }}</p>
            </div>
          </div>
        </template>
      </div>

      <!-- action button -->
      <div class="mt-8 flex justify-center">
        <a
          :href="`mailto:${profile.email}`"
          class="inline-flex items-center gap-2 px-6 py-3.5 font-pixel text-px-18 bg-success text-background pixel-border-sm pixel-press hover:bg-accent"
        >
          <Mail class="h-4 w-4" /> {{ t('contact.sendEmail') }}
        </a>
      </div>
    </div>

    <!-- footer bar -->
    <footer class="relative mt-20 border-t-4 border-line">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="font-pixel text-px-16 text-ink-dim text-center sm:text-left">
          © {{ year }} {{ profile.name.toUpperCase() }}<br class="sm:hidden" />
          <span class="hidden sm:inline"> · </span>
          {{ t('contact.builtWith') }}
        </p>
        <div class="flex items-center gap-3">
          <a :href="profile.githubUrl" target="_blank" rel="noreferrer" class="grid place-items-center h-9 w-9 bg-panel pixel-border-sm text-ink-muted hover:text-accent transition-colors">
            <GithubIcon class="h-4 w-4" />
          </a>
          <a :href="`mailto:${profile.email}`" class="grid place-items-center h-9 w-9 bg-panel pixel-border-sm text-ink-muted hover:text-accent transition-colors">
            <Mail class="h-4 w-4" />
          </a>
          <a
            href="#top"
            class="grid place-items-center h-9 w-9 bg-panel pixel-border-sm text-ink-muted hover:text-success transition-colors"
            :aria-label="t('contact.backToTop')"
          >
            <ArrowUp class="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  </section>
</template>
