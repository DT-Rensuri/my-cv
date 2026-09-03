<template>
    <WidgetStage h-full w-full :cursor-position="cursorPosition" :enable-orbit-controls="false" :paused="paused" />
</template>
<script setup lang="ts">
import SuriVTubeLayout from './layouts/SuriVTubeLayout.vue'
import { useMouse } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { WidgetStage } from '@dtrensuri/stage-ui/components/scenes'

defineOptions({
    layout: 'SuriVTubeLayout',
})

const paused = ref(false)
function handleSettingsOpen(open: boolean) {
    paused.value = open
}

const { x: mouseX, y: mouseY } = useMouse()
const cursorPosition = computed(() => ({
    x: mouseX.value,
    y: mouseY.value,
}))
</script>
