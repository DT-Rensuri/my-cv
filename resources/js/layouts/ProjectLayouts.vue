<script setup lang="ts">
import DefaultLayouts from '@/layouts/DefaultLayouts.vue';

// Project pages reuse the default layout but never show the tag profile.
</script>

<template>
    <DefaultLayouts :show-tag-profile="false">
        <slot />
    </DefaultLayouts>
</template>