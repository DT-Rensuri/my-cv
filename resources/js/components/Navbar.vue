<script setup lang="ts">
import { Menu, Moon, Sun, X, Gamepad2, Languages, Palette } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCvData } from '@/composables/useCvData';
import { useThemeStore } from '@/stores/theme';
import { useActiveSectionStore } from '@/stores/activeSection';
import { SUPPORTED_LOCALES, saveLocale, type Locale } from '@/i18n';
import { Link } from '@inertiajs/vue3';

const props = withDefaults(
    defineProps<{
        showTagProfile?: boolean;
    }>(),
    {
        showTagProfile: true,
    }
);

const { t, locale } = useI18n();
const { profile, navLinks } = useCvData();
const themeStore = useThemeStore();
const activeSectionStore = useActiveSectionStore();
const open = ref(false);
const langOpen = ref(false);
const scrolled = ref(false);

const sectionIds = navLinks.value.map((l) => l.href.slice(1));

const localeLabels: Record<Locale, string> = {
  vi: 'VI',
  en: 'EN',
  ja: 'JA',
};

const switchLocale = (l: Locale) => {
  locale.value = l;
  saveLocale(l);
  langOpen.value = false;
};

const onScroll = () => {
  scrolled.value = window.scrollY > 12;
};

onMounted(() => {
  themeStore.init();
  activeSectionStore.init(sectionIds);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  activeSectionStore.cleanup();
});
</script>

<template>
  <header :class="[
    'fixed top-0 inset-x-0 z-50 transition-all duration-200 bg-background',
    scrolled ? 'bg-background/95 border-b-4 border-line' : 'bg-transparent border-b-4 border-transparent',
  ]">
    <nav class="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
      <Link href="/#top" class="flex items-center gap-2.5">
        <span class="grid place-items-center h-10 w-10 bg-accent text-background pixel-border-sm">
          <Gamepad2 class="h-5 w-5" />
        </span>
        <span class="font-pixel text-px-18 sm:text-xs text-ink">
          DT_RENSURI<span class="text-success">.dev</span>
        </span>
      </Link>

      <div class="hidden md:flex items-center gap-1" v-if="props.showTagProfile">
        <Link v-for="link in navLinks" :key="link.href" :href="link.href" :class="[
          'px-3 py-2 font-pixel text-px-18 transition-colors',
          activeSectionStore.active === link.href.slice(1)
            ? 'text-success glow-green'
            : 'text-ink-muted hover:text-ink',
        ]">
          <span v-if="activeSectionStore.active === link.href.slice(1)">&gt; </span>{{ link.label }}
        </Link>
      </div>

      <div class="flex items-center gap-2">
        <!-- language switcher -->
        <div class="relative">
          <button @click="langOpen = !langOpen" :aria-label="t('nav.language')"
            class="grid place-items-center h-10 w-10 bg-panel pixel-border-sm text-ink hover:text-accent pixel-press">
            <Languages class="h-5 w-5" />
          </button>
          <Transition name="lang">
            <div v-if="langOpen"
              class="absolute right-0 top-full mt-2 bg-panel pixel-border-sm p-1 flex flex-col min-w-[64px]">
              <button v-for="l in SUPPORTED_LOCALES" :key="l" @click="switchLocale(l)" :class="[
                'px-3 py-1.5 font-pixel text-px-16 text-left transition-colors',
                locale === l ? 'text-success glow-green' : 'text-ink-muted hover:text-ink',
              ]">
                {{ localeLabels[l] }}
              </button>
            </div>
          </Transition>
        </div>

        <button @click="themeStore.toggle" :aria-label="t('nav.language')"
          class="grid place-items-center h-10 w-10 bg-panel pixel-border-sm text-ink hover:text-warning pixel-press">
          <Sun v-if="themeStore.theme === 'custom'" class="h-5 w-5" />
          <Palette v-else-if="themeStore.theme === 'dark'" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </button>
        <Link href="/projects"
          v-if="props.showTagProfile"
          class="hidden sm:inline-flex items-center px-4 py-2.5 font-pixel text-px-18 bg-success text-background pixel-border-sm pixel-press hover:bg-accent">
          {{ t('nav.projectsCta') }}
        </Link>
        <button @click="open = !open" aria-label="Mở menu"
          class="md:hidden grid place-items-center h-10 w-10 bg-panel pixel-border-sm text-ink">
          <X v-if="open" class="h-5 w-5" />
          <Menu v-else class="h-5 w-5" />
        </button>
      </div>
    </nav>

    <div v-if="open" class="md:hidden bg-background border-t-4 border-line">
      <div class="px-4 py-3 flex flex-col gap-1">
        <a v-for="link in navLinks" :key="link.href" :href="link.href" @click="open = false"
          class="px-3 py-3 font-pixel text-px-18 text-ink-muted hover:text-success hover:bg-panel transition-colors">
          <span v-if="activeSectionStore.active === link.href.slice(1)">&gt; </span>{{ link.label }}
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.lang-enter-active,
.lang-leave-active {
  transition: opacity 0.15s steps(3), transform 0.15s steps(3);
}

.lang-enter-from,
.lang-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
