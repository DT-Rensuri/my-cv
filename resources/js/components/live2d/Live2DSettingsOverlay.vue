<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsLive2d, useLive2dParams } from '@dtrensuri/stage-ui-live2d'
import { useStageSettingStore } from '@/stores/stageSettings'
import { Settings, X } from 'lucide-vue-next'
import { ref } from 'vue'
import { useSpeech } from '@/composables/useSpeech'

defineProps<{
    open: boolean,
    cursorPosition: { x: number, y: number }
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const { stopSpeech, speak } = useSpeech()
const sampleVoiceText = 'Xin chào, tôi là Suri! Tôi có thể giúp gì cho bạn? Hãy thử hỏi tôi về các dự án của tôi, hoặc yêu cầu tôi kể một câu chuyện vui. Bạn cũng có thể yêu cầu tôi hát một bài hát, hoặc đọc một đoạn văn bản.'
// --- Live2D settings (persisted in localStorage) ---
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
    live2dRenderScale,
} = storeToRefs(settingsLive2d)

// --- Stage settings (theme + model) ---
const settingsStore = useStageSettingStore()
const {
    themeColorsHue,
    themeColorsHueDynamic,
    mouthOpenSize,
    nowSpeaking,
} = storeToRefs(settingsStore)

// --- View control (position / scale) ---
const live2dParams = useLive2dParams()
const {
    position: live2dModelPosition,
    scale: live2dModelScale,
    currentMotion: live2dCurrentModelMotion,
    availableMotions: live2dAvailableModelMotions,
    motionMap: live2dModelMotionMap,
    modelParameters: live2dModelParameters,
} = storeToRefs(live2dParams)

const motionDriverOptions = ['magic', 'universal'] as const

const selectedModelIdleMotion = ref<{
    motionName: string
    motionIndex: number
    fileName: string
} | undefined>(
    live2dAvailableModelMotions.value.find(
        motion =>
            motion.motionName === live2dCurrentModelMotion.value.group &&
            motion.motionIndex === live2dCurrentModelMotion.value.index
    )
)

function handleIdleMotionChange(selectedMotion: { motionName: string, motionIndex: number, fileName: string } | undefined) {
    if (!selectedMotion) return

    localStorage.setItem('selected-runtime-motion', selectedMotion.fileName)
    localStorage.setItem('selected-runtime-motion-group', selectedMotion.motionName)
    localStorage.setItem('selected-runtime-motion-index', selectedMotion.motionIndex.toString())

    live2dCurrentModelMotion.value.group = selectedMotion.motionName
    live2dCurrentModelMotion.value.index = selectedMotion.motionIndex

    console.log('Selected motion changed to:', selectedMotion)
}
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-200" leave-to-class="opacity-0">
            <div v-if="open" class="fixed inset-0 z-[55] grid place-items-start p-4" @click.self="emit('close')">
                <div class="w-full max-w-md overflow-y-auto bg-panel pixel-border p-5 mt-10">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="font-pixel text-px-20 text-ink flex items-center gap-2">
                            <Settings class="h-5 w-5" />
                            Live2D Settings
                        </h2>
                        <button
                            class="grid place-items-center h-8 w-8 pixel-border-sm pixel-press bg-background text-ink"
                            aria-label="Đóng settings" @click="emit('close')">
                            <X class="h-4 w-4" />
                        </button>
                    </div>

                    <!-- Live2D toggles -->
                    <div class="space-y-3 max-h-[calc(85vh-48px)] overflow-y-auto"
                        style="scrollbar-width: none; -ms-overflow-style: none; -webkit-scrollbar: none;">
                        <!-- Demo-only live values -->
                        <div class="space-y-1">
                            <p class="font-pixel text-px-14 text-ink-dim mb-2">Demo (live values)</p>
                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Mouse Position</span>
                                <span class="font-pixel text-px-14 text-ink-dim">{{ cursorPosition.x }}, {{ cursorPosition.y }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Mouth Open</span>
                                <span class="font-pixel text-px-14 text-ink-dim">{{ mouthOpenSize.toFixed(2) }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Now Speaking</span>
                                <span class="font-pixel text-px-14 text-ink-dim">{{ nowSpeaking ? 'YES' : 'NO' }}</span>
                            </div>

                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Voice Demo</span>
                                <button class="pixel-border-sm pixel-press bg-background text-ink font-pixel text-px-14 px-2 py-1"
                                    @click="speak(sampleVoiceText)">
                                    Demo Voice
                                </button>
                            </div>
                        </div>

                        <div class="mt-4 border-t-2 border-line">
                            <p class="font-pixel text-px-14 text-ink-dim mt-2">Model Motion Settings</p>
                        </div>

                        <label class="flex items-center justify-between gap3">
                            <span class="font-pixel text-px-14 text-ink">IDLE Motion</span>
                            <select v-model="selectedModelIdleMotion"
                                class="pixel-border-sm bg-background text-ink font-pixel text-px-14 px-2 py-1"
                                @change="handleIdleMotionChange(selectedModelIdleMotion)">
                                <option v-for="motion in live2dAvailableModelMotions" :key="motion.motionIndex"
                                    :value="motion">
                                    {{ motion.fileName.split('/').pop() || motion.fileName }}
                                </option>
                            </select>
                        </label>

                        <div class="mt-4 border-t-2 border-line">
                            <p class="font-pixel text-px-14 text-ink-dim mt-2">Live2D Settings</p>
                        </div>

                        <label class="flex items-center justify-between gap-3">
                            <span class="font-pixel text-px-14 text-ink">Motion Driver</span>
                            <select v-model="live2dMotionDriver"
                                class="pixel-border-sm bg-background text-ink font-pixel text-px-14 px-2 py-1">
                                <option v-for="opt in motionDriverOptions" :key="opt" :value="opt">
                                    {{ opt }}
                                </option>
                            </select>
                        </label>

                        <label class="flex items-center justify-between gap-3">
                            <span class="font-pixel text-px-14 text-ink">Eye Tracking</span>
                            <input v-model="live2dEyeTracking" type="checkbox"
                                class="h-5 w-5 accent-[var(--color-accent)]" />
                        </label>

                        <label class="flex items-center justify-between gap-3">
                            <span class="font-pixel text-px-14 text-ink">Idle Animation</span>
                            <input v-model="live2dIdleAnimationEnabled" type="checkbox"
                                class="h-5 w-5 accent-[var(--color-accent)]" />
                        </label>

                        <label class="flex items-center justify-between gap-3">
                            <span class="font-pixel text-px-14 text-ink">Force Idle Eye</span>
                            <input v-model="live2dForceIdleEyeAnimation" type="checkbox"
                                class="h-5 w-5 accent-[var(--color-accent)]" />
                        </label>

                        <label class="flex items-center justify-between gap-3">
                            <span class="font-pixel text-px-14 text-ink">Auto Blink</span>
                            <input v-model="live2dAutoBlinkEnabled" type="checkbox"
                                class="h-5 w-5 accent-[var(--color-accent)]" />
                        </label>

                        <label class="flex items-center justify-between gap-3">
                            <span class="font-pixel text-px-14 text-ink">Force Auto Blink</span>
                            <input v-model="live2dForceAutoBlinkEnabled" type="checkbox"
                                class="h-5 w-5 accent-[var(--color-accent)]" />
                        </label>

                        <label class="flex items-center justify-between gap-3">
                            <span class="font-pixel text-px-14 text-ink">Expression</span>
                            <input v-model="live2dExpressionEnabled" type="checkbox"
                                class="h-5 w-5 accent-[var(--color-accent)]" />
                        </label>

                        <label class="flex items-center justify-between gap-3">
                            <span class="font-pixel text-px-14 text-ink">Shadow</span>
                            <input v-model="live2dShadowEnabled" type="checkbox"
                                class="h-5 w-5 accent-[var(--color-accent)]" />
                        </label>

                        <!-- Numeric sliders -->
                        <div class="space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Max FPS</span>
                                <span class="font-pixel text-px-14 text-ink-dim">{{ live2dMaxFps }}</span>
                            </div>
                            <input v-model.number="live2dMaxFps" type="range" min="0" max="120" step="1"
                                class="w-full accent-[var(--color-accent)]" />
                        </div>

                        <div class="space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Render Scale</span>
                                <span class="font-pixel text-px-14 text-ink-dim">{{ live2dRenderScale }}</span>
                            </div>
                            <input v-model.number="live2dRenderScale" type="range" min="0.5" max="4" step="0.5"
                                class="w-full accent-[var(--color-accent)]" />
                        </div>

                        <div class="space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Model X</span>
                                <span class="font-pixel text-px-14 text-ink-dim">{{ live2dModelPosition.x }}</span>
                            </div>
                            <input v-model.number="live2dModelPosition.x" type="range" min="-500" max="500" step="1"
                                class="w-full accent-[var(--color-accent)]" />
                        </div>

                        <div class="space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Model Y</span>
                                <span class="font-pixel text-px-14 text-ink-dim">{{ live2dModelPosition.y }}</span>
                            </div>
                            <input v-model.number="live2dModelPosition.y" type="range" min="-500" max="500" step="1"
                                class="w-full accent-[var(--color-accent)]" />
                        </div>

                        <div class="space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Scale</span>
                                <span class="font-pixel text-px-14 text-ink-dim">{{ live2dModelScale }}</span>
                            </div>
                            <input v-model.number="live2dModelScale" type="range" min="0.01" max="3" step="0.01"
                                class="w-full accent-[var(--color-accent)]" />
                        </div>

                        <div class="mt-4 border-t-2 border-line">
                            <p class="font-pixel text-px-14 text-ink-dim mt-2">Theme Settings</p>
                        </div>

                        <!-- Theme -->
                        <div class="space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Theme Hue</span>
                                <span class="font-pixel text-px-14 text-ink-dim">{{ themeColorsHue.toFixed(1) }}</span>
                            </div>
                            <input v-model.number="themeColorsHue" type="range" min="0" max="360" step="1"
                                class="w-full accent-[var(--color-accent)]" />
                        </div>

                        <label class="flex items-center justify-between gap-3">
                            <span class="font-pixel text-px-14 text-ink">Dynamic Hue</span>
                            <input v-model="themeColorsHueDynamic" type="checkbox"
                                class="h-5 w-5 accent-[var(--color-accent)]" />
                        </label>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>