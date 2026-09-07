<template>
  <section
    class="relative bg-background h-screen w-screen overflow-hidden flex h-full w-full items-center justify-center">
    <Live2DScene ref="live2dSceneRef" v-model:state="componentState"
      class="h-full w-full min-h-[100px] min-w-[50%] flex-1 max-lg:min-w-full" :model-src="stageModelSelectedUrl"
      :model-id="stageModelSelected" :cursor-position="cursorPosition" :mouth-open-size="mouthOpenSize"
      :now-speaking="nowSpeaking" :paused="paused" :theme-colors-hue="themeColorsHue"
      :theme-colors-hue-dynamic="themeColorsHueDynamic" :live2d-shadow-enabled="live2dShadowEnabled"
      :live2d-max-fps="live2dMaxFps" :live2d-render-scale="live2dRenderScale" @error="handleStageRenderError" />

    <!-- Settings toggle button -->
    <button class="fixed bottom-5 left-5 z-[50] grid place-items-center h-14 w-14 pixel-border-sm pixel-press"
      :style="{ background: 'var(--color-accent)', color: 'var(--color-background)' }" aria-label="Mở cài đặt Live2D"
      @click="settingsOpen = !settingsOpen">
      <Settings class="h-6 w-6" />
    </button>

    <!-- Settings overlay -->
    <Live2DSettingsOverlay :open="settingsOpen" @close="settingsOpen = false" />
  </section>
</template>
<script setup lang="ts">
import { defaultLive2DMotionControlDynamics, Live2DScene, useLive2DMotionControl, useLive2dParams, useSettingsLive2d } from '@dtrensuri/stage-ui-live2d'
import type { Live2DEyeFocusSource } from '@dtrensuri/stage-ui-live2d'
import { storeToRefs } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import { Settings } from 'lucide-vue-next'
import { useStageSettingStore } from '@/stores/stageSettings'
import ProjectLayouts from '@/layouts/ProjectLayouts.vue'
import Live2DSettingsOverlay from '@/components/live2d/Live2DSettingsOverlay.vue'
import { useMouse } from '@vueuse/core'

defineOptions({
  layout: ProjectLayouts,
});

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

const settingsLive2d = useSettingsLive2d()

const {
  live2dMotionDriver,
  live2dEyeTracking,
  live2dModelEyeOffset,
  live2dIdleAnimationEnabled,
  live2dForceIdleEyeAnimation,
  live2dAutoBlinkEnabled,
  live2dForceAutoBlinkEnabled,
  live2dExpressionEnabled,
  live2dShadowEnabled,
  live2dMaxFps,
  live2dRenderScale
} = storeToRefs(settingsLive2d)

const live2dMotionControl = useLive2DMotionControl()
const {
  control: live2dControl,
  breathControl: live2dBreathControl,
  exclusiveOwnerId: live2dExclusiveOwnerId,
} = storeToRefs(live2dMotionControl)

const live2dParams = useLive2dParams()
const {
  position: live2dModelPosition,
  currentMotion: live2dCurrentModelMotion,
  availableMotions: live2dAvailableModelMotions,
  motionMap: live2dModelMotionMap,
  scale: live2dModelScale,
  modelParameters: live2dModelParameters,
} = storeToRefs(live2dParams)

const live2dMotionControlDynamics = ref(defaultLive2DMotionControlDynamics)

const paused = defineModel<boolean>('paused', { default: false })
const { x: mouseX, y: mouseY } = useMouse()
const cursorPosition = computed(() => ({
  x: mouseX.value,
  y: mouseY.value
}))
const stageRenderError = shallowRef<Error>()
const settingsOpen = ref(false)
function handleStageRenderError(error: Error) {
  stageRenderError.value = error
}

</script>