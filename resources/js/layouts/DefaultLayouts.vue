<script setup lang="ts">
import ChatBot from '@/components/chatbots/ChatBot.vue';
import Navbar from '@/components/Navbar.vue';
import { useAvatarStore } from '@/stores/avatar';
import { onMounted, onBeforeUnmount, onBeforeMount } from 'vue';
import AppLoader from '@/components/AppLoader.vue';

const props = defineProps({
    showTagProfile: {
        type: Boolean,
        default: true,
    },
});

const avatarStore = useAvatarStore();

const handleResize = () => {
    avatarStore.windowWidth = window.innerWidth;
    avatarStore.windowHeight = window.innerHeight;
    avatarStore.goBack();
};

onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<template>
    <div class="min-h-screen bg-background text-ink">
        <AppLoader />
        <Navbar :show-tag-profile="showTagProfile"/>
        <main>
            <slot />
        </main>
        <ChatBot />
    </div>
</template>