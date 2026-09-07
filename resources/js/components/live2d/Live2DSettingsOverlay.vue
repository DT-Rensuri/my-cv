<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsLive2d, useLive2dParams } from '@dtrensuri/stage-ui-live2d'
import { useStageSettingStore } from '@/stores/stageSettings'
import { Settings, X } from 'lucide-vue-next'

defineProps<{
    open: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

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
} = storeToRefs(live2dParams)

const motionDriverOptions = ['magic', 'universal'] as const
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
                    <div class="space-y-3 max-h-[calc(85vh-48px)] overflow-y-auto" style="scrollbar-width: none; -ms-overflow-style: none; -webkit-scrollbar: none;">
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
                            <span class="font-pixel text-px-14 text-ink">Eye Offset</span>
                            <span class="font-pixel text-px-14 text-ink-dim">X: {{ live2dModelEyeOffset.x }}, Y: {{
                                live2dModelEyeOffset.y }}</span>
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

                        <!-- Demo-only live values -->
                        <div class="mt-4 pt-4 border-t-2 border-line">
                            <p class="font-pixel text-px-14 text-ink-dim mb-2">Demo (live values)</p>
                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Mouth Open</span>
                                <span class="font-pixel text-px-14 text-ink-dim">{{ mouthOpenSize.toFixed(2) }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="font-pixel text-px-14 text-ink">Now Speaking</span>
                                <span class="font-pixel text-px-14 text-ink-dim">{{ nowSpeaking ? 'YES' : 'NO' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>