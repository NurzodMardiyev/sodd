<script setup>
import { watch } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { currentLang } from '@/composables/useLanguage.js';
import { getPrimeVueLocale } from '@/composables/primevueLocales.js';

// Butun ilovada qayerda Calendar/DatePicker ishlatilgan bo'lsa, tilga mos.
const primevue = usePrimeVue();
const baseLocale = { ...primevue.config.locale };
watch(
    currentLang,
    (lang) => {
        primevue.config.locale = getPrimeVueLocale(lang, baseLocale);
    },
    { immediate: true }
);
</script>

<template>
    <router-view />
</template>

<style scoped></style>
