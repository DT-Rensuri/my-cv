<template>
  <main class="relative h-screen w-screen overflow-hidden bg-slate-950">
    <!-- Background -->
    <div class="pointer-events-none absolute inset-0
                   bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.14),transparent_45%)]
                   lg:bg-[radial-gradient(circle_at_50%_10%,rgba(139,92,246,0.18),transparent_50%)]" />

    <!-- Ambient glow -->
    <div class="pointer-events-none absolute -left-32 -top-32
                   h-96 w-96 rounded-full
                   bg-violet-500/10 blur-3xl" />

    <div class="pointer-events-none absolute -bottom-40 -right-40
                   h-[30rem] w-[30rem] rounded-full
                   bg-fuchsia-500/10 blur-3xl" />

    <!-- Live2D -->
    <section class="relative z-10 flex h-full w-full items-center justify-center">
      <Live2DScene ref="live2dSceneRef" v-model:state="componentState" class="h-full w-full min-h-[100px] min-w-[50%] flex-1
                       max-lg:min-w-full" :model-src="stageModelSelectedUrl" :model-id="stageModelSelected"
        :cursor-position="cursorPosition" :mouth-open-size="mouthOpenSize" :now-speaking="nowSpeaking" :paused="paused"
        :theme-colors-hue="themeColorsHue" :theme-colors-hue-dynamic="themeColorsHueDynamic"
        :live2d-shadow-enabled="live2dShadowEnabled" :live2d-max-fps="live2dMaxFps"
        :live2d-render-scale="live2dRenderScale" @error="handleStageRenderError" />
    </section>

    <!-- Top gradient -->
    <div class="pointer-events-none absolute inset-x-0 top-0 z-20 h-32
                   bg-gradient-to-b from-slate-950/50 to-transparent" />

    <!-- Bottom gradient -->
    <div class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40
                   bg-gradient-to-t from-slate-950/60 to-transparent" />
  </main>
</template>
<script setup lang="ts">
import { defaultLive2DMotionControlDynamics, Live2DScene, useLive2DMotionControl, useLive2dParams, useSettingsLive2d } from '@dtrensuri/stage-ui-live2d'
import type { Live2DEyeFocusSource } from '@dtrensuri/stage-ui-live2d'
import { storeToRefs } from 'pinia'
import { ref, shallowRef } from 'vue'
import { useStageSettingStore } from './stores/stageSettings'

const componentState = defineModel<'pending' | 'loading' | 'mounted'>('state', { default: 'pending' })
const settingsStore = useStageSettingStore()
const {
  // stageModelRenderer,
  stageModelSelectedUrl,
  stageModelSelected,
  themeColorsHue,
  themeColorsHueDynamic,
  mouthOpenSize,
  nowSpeaking,
} = storeToRefs(settingsStore)

const paused = defineModel<boolean>('paused', { default: false })
const cursorPosition = ref<Live2DEyeFocusSource | undefined>()
const live2dShadowEnabled = defineModel<boolean>('live2dShadowEnabled', { default: true })
const live2dMaxFps = defineModel<number>('live2dMaxFps', { default: 60 })
const live2dRenderScale = defineModel<number>('live2dRenderScale', { default: 1 })
const stageRenderError = shallowRef<Error>()
// const live2dEyeTracking = defineModel<boolean>('live2dEyeTracking', { default: true })
function handleStageRenderError(error: Error) {
  stageRenderError.value = error
}

</script>