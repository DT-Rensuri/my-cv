<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { usePiniaSynced } from '@dtrensuri/stage-ui/libs/pinia'
import { useChatStore } from '@dtrensuri/stage-ui/stores/chat'
import { useVisionStore } from '@dtrensuri/stage-ui/stores/modules/vision'
import { useHearingStore } from '@dtrensuri/stage-ui/stores/modules/hearing'
import { useSpeechStore } from '@dtrensuri/stage-ui/stores/modules/speech'
import { useArtistryStore } from '@dtrensuri/stage-ui/stores/modules/artistry'
import { useDisplayModelsStore } from '@dtrensuri/stage-ui/stores/display-models'
import { useContextBridgeStore } from '@dtrensuri/stage-ui/stores/mods/api/context-bridge'
import { useInferencePreload } from '@dtrensuri/stage-ui/composables'
import { StageTransitionGroup } from '@dtrensuri/ui-transitions'
import { useI18n } from 'vue-i18n'
import { toast, Toaster } from 'vue-sonner'
import { useTheme } from '@dtrensuri/ui'
import { storeToRefs } from 'pinia'
import { useSettings } from '@dtrensuri/stage-ui/stores/settings'

const syncedPinia = usePiniaSynced()
const chatStore = useChatStore()
const speechStore = useSpeechStore()
const displayModelsStore = useDisplayModelsStore()
const contextBridgeStore = useContextBridgeStore()
const inferencePreload = useInferencePreload()
const { isDark } = useTheme()
const settingsStore = useSettings()
const settings = storeToRefs(settingsStore)

useArtistryStore()
// useConsciousnessStore()
useHearingStore()
useSpeechStore()
// useSettingsStageModel()
useVisionStore()

const { t } = useI18n()

const primaryColor = computed(() => {
  return isDark.value
    ? `color-mix(in srgb, oklch(95% var(--chromatic-chroma-900) calc(var(--chromatic-hue) + ${0})) 70%, oklch(50% 0 360))`
    : `color-mix(in srgb, oklch(95% var(--chromatic-chroma-900) calc(var(--chromatic-hue) + ${0})) 90%, oklch(90% 0 360))`
})

const secondaryColor = computed(() => {
  return isDark.value
    ? `color-mix(in srgb, oklch(95% var(--chromatic-chroma-900) calc(var(--chromatic-hue) + ${180})) 70%, oklch(50% 0 360))`
    : `color-mix(in srgb, oklch(95% var(--chromatic-chroma-900) calc(var(--chromatic-hue) + ${180})) 90%, oklch(90% 0 360))`
})

const tertiaryColor = computed(() => {
  return isDark.value
    ? `color-mix(in srgb, oklch(95% var(--chromatic-chroma-900) calc(var(--chromatic-hue) + ${60})) 70%, oklch(50% 0 360))`
    : `color-mix(in srgb, oklch(95% var(--chromatic-chroma-900) calc(var(--chromatic-hue) + ${60})) 90%, oklch(90% 0 360))`
})

const colors = computed(() => {
  return [primaryColor.value, secondaryColor.value, tertiaryColor.value, isDark.value ? '#121212' : '#FFFFFF']
})

onMounted(() => {
    document.body.classList.add('suri-vtube')
})
</script>
<template>
    <StageTransitionGroup :primary-color="primaryColor" :secondary-color="secondaryColor"
        :tertiary-color="tertiaryColor" :colors="colors" :z-index="100"
        :disable-transitions="settings.disableTransitions.value"
        :use-page-specific-transitions="settings.usePageSpecificTransitions.value">
        <slot />
    </StageTransitionGroup>

    <ToasterRoot @close="id => toast.dismiss(id)">
        <Toaster />
    </ToasterRoot>

    <!-- <OnboardingDialog v-model="showingSetup" :extra-steps="onboardingExtraSteps" @configured="handleSetupConfigured"
        @skipped="handleSetupSkipped" />

    <PerformanceOverlay /> -->
</template>