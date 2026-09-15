<script setup lang="ts">
import { ArrowDown, Download, Mail, MapPin, Phone, Heart, Zap } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useCvData } from '@/composables/useCvData';
import GithubIcon from '@/components/icons/GithubIcon.vue';
import pixelArt from '@/../images/pixel-art.png';

const { t } = useI18n();
const { profile } = useCvData();
</script>

<template>
  <section id="top" class="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 pixel-stars">
    <!-- CRT overlay -->
    <div class="absolute inset-0 crt-scanlines pointer-events-none" />

    <div class="relative mx-auto max-w-6xl px-4 sm:px-6">
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        <!-- LEFT: title screen -->
        <div class="lg:col-span-7">
          <!-- status badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-panel pixel-border-sm">
            <span class="h-2 w-2 bg-success blink" />
            <span class="font-pixel text-px-16 text-success">{{ t('hero.ready') }}</span>
          </div>

          <h1 class="mt-6 font-pixel text-2xl sm:text-3xl lg:text-4xl text-ink leading-tight">
            {{ profile.name }}
          </h1>
          <p class="mt-3 font-pixel text-sm sm:text-base text-accent glow-cyan">
            &lt;{{ profile.title }}/&gt;
          </p>
          <p class="mt-2 font-pixel text-px-18 text-highlight glow-pink">
            [{{ profile.class }}]
          </p>

          <p class="mt-6 max-w-xl font-retro text-lg sm:text-xl leading-relaxed text-ink-muted">
            {{ t('hero.tagline') }}
          </p>

          <!-- HP / MP bars -->
          <div class="mt-6 max-w-sm space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-pixel text-px-16 text-danger w-8">HP</span>
              <div class="flex-1 h-4 bg-panel pixel-border-sm overflow-hidden">
                <div class="h-full bg-danger" style="width: 100%" />
              </div>
              <span class="font-pixel text-px-16 text-ink-muted">{{ profile.hp }}/100</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-pixel text-px-16 text-accent w-8">MP</span>
              <div class="flex-1 h-4 bg-panel pixel-border-sm overflow-hidden">
                <div class="h-full bg-accent" style="width: 100%" />
              </div>
              <span class="font-pixel text-px-16 text-ink-muted">{{ profile.mp }}/100</span>
            </div>
          </div>

          <!-- action buttons -->
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              class="inline-flex items-center gap-2 px-5 py-3 font-pixel text-px-18 bg-success text-background pixel-border-sm pixel-press hover:bg-accent"
            >
              <Mail class="h-4 w-4" /> {{ t('hero.contactMe') }}
            </a>
            <a
              :href="profile.githubUrl"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-2 px-5 py-3 font-pixel text-px-18 bg-panel text-ink pixel-border-sm pixel-press hover:text-warning"
            >
              <Download class="h-4 w-4" /> {{ t('hero.downloadCv') }}
            </a>
          </div>

          <!-- contact info -->
          <div class="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-retro text-base text-ink-muted">
            <a :href="`tel:${profile.phone}`" class="inline-flex items-center gap-1.5 hover:text-success">
              <Phone class="h-4 w-4 text-accent" /> {{ profile.phone }}
            </a>
            <a :href="`mailto:${profile.email}`" class="inline-flex items-center gap-1.5 hover:text-success">
              <Mail class="h-4 w-4 text-accent" /> {{ profile.email }}
            </a>
            <a :href="profile.githubUrl" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1.5 hover:text-success">
              <GithubIcon class="h-4 w-4 text-accent" /> {{ profile.github }}
            </a>
            <span class="inline-flex items-center gap-1.5">
              <MapPin class="h-4 w-4 text-accent" /> Hà Nội
            </span>
          </div>
        </div>

        <!-- RIGHT: pixel character card -->
        <div class="lg:col-span-5">
          <div class="relative max-w-sm mx-auto">
            <!-- character portrait -->
            <div class="bg-panel pixel-border p-6 crt-glow">
              <div class="text-center">
                <p class="font-pixel text-px-16 text-ink-dim mb-3">--- {{ t('hero.character') }} ---</p>

                <!-- pixel avatar -->
                <div class="mx-auto w-32 h-32 sm:w-40 sm:h-40 bg-background-alt pixel-border-sm grid place-items-center float">
                  <div class="text-6xl sm:text-7xl font-pixel text-accent glow-cyan">
                    <img :src="pixelArt" alt="Pixel Art" class="w-full h-full object-cover" />
                  </div>
                </div>

                <p class="mt-4 font-pixel text-xs text-ink">{{ profile.name }}</p>
                <p class="mt-1 font-pixel text-px-16 text-highlight">{{ profile.class }}</p>

                <!-- level -->
                <div class="mt-4 flex items-center justify-center gap-2">
                  <Zap class="h-4 w-4 text-warning" />
                  <span class="font-pixel text-px-18 text-warning glow-yellow">LV. {{ profile.level }}</span>
                </div>

                <!-- stats grid -->
                <div class="mt-5 grid grid-cols-2 gap-2 text-left">
                  <div class="bg-background-alt pixel-border-sm p-2">
                    <p class="font-pixel text-px-14 text-ink-dim">{{ t('hero.exp') }}</p>
                    <p class="font-pixel text-px-18 text-success">{{ t('hero.expValue') }}</p>
                  </div>
                  <div class="bg-background-alt pixel-border-sm p-2">
                    <p class="font-pixel text-px-14 text-ink-dim">{{ t('hero.projects') }}</p>
                    <p class="font-pixel text-px-18 text-accent">05</p>
                  </div>
                  <div class="bg-background-alt pixel-border-sm p-2">
                    <p class="font-pixel text-px-14 text-ink-dim">{{ t('hero.stack') }}</p>
                    <p class="font-pixel text-px-18 text-highlight">FULL</p>
                  </div>
                  <div class="bg-background-alt pixel-border-sm p-2">
                    <p class="font-pixel text-px-14 text-ink-dim">{{ t('hero.status') }}</p>
                    <p class="font-pixel text-px-18 text-success flex items-center gap-1">
                      <Heart class="h-3 w-3" /> {{ t('hero.alive') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- scroll indicator -->
      <a href="#about" class="mt-14 mx-auto flex w-fit flex-col items-center gap-2 text-ink-dim hover:text-success">
        <span class="font-pixel text-px-16">{{ t('hero.pressScroll') }}</span>
        <ArrowDown class="h-5 w-5 arrow-bounce" />
      </a>
    </div>
  </section>
</template>
