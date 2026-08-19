<script setup lang="ts">
import About from '@/components/About.vue';
import Contact from '@/components/Contact.vue';
import Education from '@/components/Education.vue';
import Experience from '@/components/Experience.vue';
import Hero from '@/components/Hero.vue';
import Skills from '@/components/Skills.vue';
import DefaultLayouts from '@/layouts/DefaultLayouts.vue';

defineOptions({
    layout: DefaultLayouts,
});
</script>

<template>
    <Hero />
    <About />
    <Education />
    <Experience />
    <Skills />
    <Contact />
</template>
