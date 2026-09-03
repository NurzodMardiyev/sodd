<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import AppFooter from './AppFooter.vue';
import AppSidebarClassic from './AppSidebarClassic.vue';
import AppTopbar from './AppTopbar.vue';
import { useLayout } from '@/layout/composables/layout';

const { layoutState } = useLayout();

// Sahifa almashganda mobil off-canvas menyu avtomatik yopiladi.
const route = useRoute();
watch(
    () => route.path,
    () => {
        layoutState.staticMenuMobileActive = false;
    }
);
</script>

<template>
    <div class="layout-wrapper" :class="{ 'layout-mobile-active': layoutState.staticMenuMobileActive }">
        <AppTopbar />
        <AppSidebarClassic />
        <div v-if="layoutState.staticMenuMobileActive" class="layout-mobile-mask" @click="layoutState.staticMenuMobileActive = false"></div>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view v-slot="{ Component, route: currentRoute }">
                    <component :is="Component" :key="currentRoute.path" />
                </router-view>
            </div>
            <AppFooter />
        </div>
    </div>
    <Toast />
</template>

<style>
/* Qobiq — CSS Grid: topbar butun kenglikni oladi, sidebar `auto` ustunni
   (o'z kengligiga qarab), kontent qolganini. */
.layout-wrapper {
    display: grid !important;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
        'topbar topbar'
        'sidebar main';
    gap: var(--layout-gutter);
    padding: var(--layout-gutter);
    height: 100vh !important;
    min-height: 100vh;
    box-sizing: border-box;
    position: relative;
}
/* `min-height: 0` — grid item'ning avtomatik `min-height: auto` polini bekor
   qiladi, aks holda qobiq viewportdan oshib ketib ikkinchi scrollbar paydo bo'ladi. */
.layout-main-container {
    grid-area: main !important;
    position: relative;
    padding: 0 !important;
    margin: 0 !important;
    max-width: none !important;
    height: 100% !important;
    min-height: 0 !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    scrollbar-width: none !important;
}
/* Dashboard.vue o'zini 100vh'ga sig'dirishi uchun `.layout-main` chinakam
   balandlikka (`height:100%`, `auto` emas) ega bo'lishi SHART — aks holda
   pastdagi flex/grid bolalar `height:100%`ni "aniqlanmagan" deb hisoblab
   e'tiborsiz qoldiradi va sahifa o'z tabiiy (haddan tashqari baland) bo'yiga
   cho'ziladi. `.layout-main-container`dagi `overflow-y:auto` xavfsizlik
   to'ri sifatida qoladi — agar biror sahifa baribir sig'may qolsa, forsiz
   scroll (ko'rinmas scrollbar bilan) hamon ishlayveradi. */
.layout-main {
    padding: 0 !important;
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    height: 100% !important;
    min-height: 0 !important;
    box-sizing: border-box !important;
}
.layout-main-container::-webkit-scrollbar {
    display: none;
}

/* Mobil qobiq — sidebar ustuni butunlay olib tashlanadi (AppSidebarClassic.vue
   mobilda o'zi yashiriladi va topbar'dagi hamburger orqali off-canvas sifatida
   ochiladi). DIQQAT: 991px — AppSidebarClassic.vue/AppTopbar.vue'dagi bir xil
   qiymat bilan mos kelishi SHART. */
@media (max-width: 991px) {
    .layout-wrapper {
        grid-template-columns: 1fr;
        grid-template-areas:
            'topbar'
            'main';
    }
}

.layout-mobile-mask {
    position: fixed;
    inset: 0;
    background: var(--maskbg, rgba(0, 0, 0, 0.45));
    z-index: var(--z-backdrop);
}
</style>
