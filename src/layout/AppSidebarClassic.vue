<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { apps as allApps, getSubMenu, sidebarOpen, toggleSidebar } from '@/layout/composables/useModuleNav';

// `hidden: true` belgilangan app'lar sidebar'da chiqmaydi
const apps = allApps.filter((a) => !a.hidden);

// "Klassik" to'liq balandlikdagi, oq fonli, ochiq/yopiq holatga ega sidebar —
// loyihaning yagona navigatsiya komponenti (AppLayout.vue shu komponentni ishlatadi).
const route = useRoute();

const openAppId = ref(null);
const openModuleId = ref(null);

function isAppActive(app) {
    if (app.activeMatch) return route.path === app.activeMatch || route.path.startsWith(app.activeMatch + '/');
    if (app.to) return route.path === app.to;
    return app.modules.some((m) => route.path === m.to || route.path.startsWith(m.to + '/'));
}
function isModuleActive(to) {
    return route.path === to || route.path.startsWith(to + '/');
}
function isSubActive(to) {
    return route.path === to;
}

// Chevron tugmasi — faqat guruhni yig'adi/ochadi, navigatsiya qilmaydi.
function onAppClick(app) {
    if (!sidebarOpen.value) sidebarOpen.value = true;
    openAppId.value = openAppId.value === app.id ? null : app.id;
}
// Guruh sarlavhasining o'zi bosilganda — app o'z sahifasiga o'tadi (router-link)
// va guruh ochiq holatga keladi (yopilmaydi, aks holda o'tgan zahoti ichki
// havolalar ko'zdan yo'qoladi).
function onAppNavigate(app) {
    if (!sidebarOpen.value) sidebarOpen.value = true;
    openAppId.value = app.id;
}
function onModuleClick(mod) {
    if (!sidebarOpen.value) sidebarOpen.value = true;
    openModuleId.value = openModuleId.value === mod.to ? null : mod.to;
}

// Joriy manzilga mos app/modulni avtomatik ochiq holatga keltiradi.
function syncActiveFromRoute() {
    // Avval ichki havola (modul) bo'yicha, topilmasa app'ning o'z sahifasi
    // (`to`/`activeMatch`) bo'yicha — ikkala holatda ham guruh ochiq turadi.
    const byModule = apps.find((a) => a.modules?.some((m) => route.path === m.to || route.path.startsWith(m.to + '/')));
    if (byModule) {
        openAppId.value = byModule.id;
        const mod = byModule.modules.find((m) => route.path === m.to || route.path.startsWith(m.to + '/'));
        if (mod && getSubMenu(mod)) openModuleId.value = mod.to;
        return;
    }
    const byApp = apps.find((a) => a.modules?.length && isAppActive(a));
    if (byApp) openAppId.value = byApp.id;
}
// Boshlang'ich holatda hech qaysi app joriy manzilga mos kelmasa ham, birinchi
// modulli app ochiq holatda tursin.
onMounted(() => {
    syncActiveFromRoute();
    if (!openAppId.value) {
        const firstGroup = apps.find((a) => a.modules?.length);
        if (firstGroup) openAppId.value = firstGroup.id;
    }
});
watch(() => route.path, syncActiveFromRoute);
</script>

<template>
    <aside class="asc-sidebar" :class="{ 'asc-sidebar--collapsed': !sidebarOpen }">
        <div class="asc-header">
            <span v-if="sidebarOpen" class="asc-header-title">Menyu</span>
            <button type="button" class="asc-toggle" @click="toggleSidebar" :title="sidebarOpen ? 'Yopish' : 'Ochish'">
                <i class="pi" :class="sidebarOpen ? 'pi-angle-double-left' : 'pi-angle-double-right'"></i>
            </button>
        </div>

        <nav class="asc-nav">
            <template v-for="app in apps" :key="app.id">
                <!-- Modulsiz app — to'g'ridan-to'g'ri havola -->
                <router-link v-if="!app.modules.length" :to="app.to" class="asc-item" :class="{ 'asc-item--active': isAppActive(app) }" :title="app.label">
                    <span class="asc-item-icon"><font-awesome-icon :icon="app.faIcon" /></span>
                    <span v-if="sidebarOpen" class="asc-item-label">{{ app.label }}</span>
                </router-link>

                <!-- Modulli app — o'zi ham havola, chevron orqali ichki havolalari ochiladi -->
                <div v-else class="asc-group">
                    <component
                        :is="app.to ? 'router-link' : 'button'"
                        :to="app.to"
                        :type="app.to ? undefined : 'button'"
                        class="asc-item asc-item--btn"
                        :class="{ 'asc-item--active': isAppActive(app) }"
                        :title="app.label"
                        @click="app.to ? onAppNavigate(app) : onAppClick(app)"
                    >
                        <span class="asc-item-icon"><font-awesome-icon :icon="app.faIcon" /></span>
                        <span v-if="sidebarOpen" class="asc-item-label">{{ app.label }}</span>
                        <button v-if="sidebarOpen" type="button" class="asc-chevron-btn" :title="openAppId === app.id ? 'Yopish' : 'Ochish'" @click.prevent.stop="onAppClick(app)">
                            <i class="pi pi-chevron-down asc-item-chevron" :class="{ 'asc-item-chevron--open': openAppId === app.id }"></i>
                        </button>
                    </component>

                    <div v-if="sidebarOpen && openAppId === app.id" class="asc-submodules">
                        <template v-for="mod in app.modules" :key="mod.to">
                            <!-- Ichki submenyuga ega modul -->
                            <div v-if="getSubMenu(mod)" class="asc-subgroup">
                                <button type="button" class="asc-subitem asc-subitem--btn" :class="{ 'asc-subitem--active': isModuleActive(mod.to) }" @click="onModuleClick(mod)">
                                    <span class="asc-subitem-label">{{ mod.label }}</span>
                                    <i class="pi pi-chevron-down asc-subitem-chevron" :class="{ 'asc-subitem-chevron--open': openModuleId === mod.to }"></i>
                                </button>
                                <div v-if="openModuleId === mod.to" class="asc-leafitems">
                                    <router-link v-for="item in getSubMenu(mod).items" :key="item.to" :to="item.to" class="asc-leaf" :class="{ 'asc-leaf--active': isSubActive(item.to) }">
                                        {{ item.label }}
                                    </router-link>
                                </div>
                            </div>
                            <!-- To'g'ridan-to'g'ri havola modul -->
                            <router-link v-else :to="mod.to" class="asc-subitem" :class="{ 'asc-subitem--active': isModuleActive(mod.to) }">
                                <span class="asc-subitem-label">{{ mod.label }}</span>
                            </router-link>
                        </template>
                    </div>
                </div>
            </template>
        </nav>
    </aside>
</template>

<style scoped>
/* Grid item. Yig'ilish animatsiyasi SHU YERDA: `transition: width` har kadrda
   oraliq kenglik beradi, grid'ning `auto` ustuni esa uni kuzatadi. */
.asc-sidebar {
    grid-area: sidebar;
    width: var(--classic-width);
    height: 100%;
    background: #ffffff;
    border: 1px solid var(--surface-border, #e2e8f0);
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: width var(--sidebar-transition);
}
.asc-sidebar--collapsed {
    width: var(--classic-width-collapsed);
}

/* Mobil — rail o'rniga pastki AppBottomNav.vue va topbar'dagi AppMobileMenu.vue
   ishlatiladi, shu bois bu yerda klassik sidebar butunlay yashiriladi. DIQQAT:
   991px — AppLayout.vue/AppTopbar.vue/AppSidebar.vue bilan mos qiymat. */
@media (max-width: 991px) {
    .asc-sidebar {
        display: none;
    }
}

.asc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    flex-shrink: 0;
    padding: 0 0.9rem;
    border-bottom: 1px solid var(--surface-border, #eef1f5);
}
.asc-sidebar--collapsed .asc-header {
    justify-content: center;
    padding: 0;
}
.asc-header-title {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
}
.asc-toggle {
    width: 1.8rem;
    height: 1.8rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    flex-shrink: 0;
    transition:
        background 0.15s,
        color 0.15s;
}
.asc-toggle:hover {
    background: #f1f5f9;
    color: #475569;
}

.asc-nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.6rem;
    scrollbar-width: thin;
    scrollbar-color: var(--surface-border, #e2e8f0) transparent;
}
.asc-nav::-webkit-scrollbar {
    width: 4px;
}

/* ── 1-daraja: app'lar (Bosh sahifa, ...) ── */
.asc-item {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    width: 100%;
    padding: 0.6rem 0.65rem;
    margin-bottom: 2px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: #334155;
    text-decoration: none;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition:
        background 0.15s,
        color 0.15s;
    outline: none;
}
.asc-item:focus-visible {
    box-shadow: 0 0 0 2px #bfdbfe;
    outline: none;
}
.asc-sidebar--collapsed .asc-item {
    justify-content: center;
    padding: 0.65rem;
}
.asc-item:hover {
    background: #f8fafc;
    color: #1e293b;
}
.asc-item--active {
    background: #eff6ff;
    color: #2563eb;
}
.asc-item--active:hover {
    background: #eff6ff;
    color: #2563eb;
}
.asc-item-icon {
    width: 1.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1rem;
}
.asc-item-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.asc-item-chevron {
    font-size: 0.65rem;
    color: #94a3b8;
    transition: transform 0.18s;
    flex-shrink: 0;
}
.asc-item-chevron--open {
    transform: rotate(180deg);
}
/* Chevron sarlavha havolasi ICHIDA turadi — bosilganda navigatsiya emas, faqat
   guruh yig'iladi/ochiladi (template'dagi @click.prevent.stop). */
.asc-chevron-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.4rem;
    height: 1.4rem;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s;
}
.asc-chevron-btn:hover {
    background: rgba(100, 116, 139, 0.12);
}
.asc-chevron-btn:focus-visible {
    box-shadow: 0 0 0 2px #bfdbfe;
    outline: none;
}

/* ── 2-daraja: modullar (ikonkasiz, chiziqcha bilan indent) ── */
.asc-submodules {
    margin: 2px 0 12px 1.15rem;
    padding-left: 0.75rem;
    border-left: 1px solid #e8ecf1;
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.asc-subitem {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.48rem 0.6rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #64748b;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    transition:
        background 0.13s,
        color 0.13s;
    outline: none;
}
.asc-subitem:focus-visible {
    box-shadow: 0 0 0 2px #bfdbfe;
    outline: none;
}
.asc-subitem:hover {
    background: #f8fafc;
    color: #334155;
}
.asc-subitem--active {
    background: #eff6ff;
    color: #2563eb;
    font-weight: 700;
}
.asc-subitem-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.asc-subitem-chevron {
    font-size: 0.6rem;
    color: #cbd5e1;
    transition: transform 0.18s;
    flex-shrink: 0;
}
.asc-subitem-chevron--open {
    transform: rotate(180deg);
}

/* ── 3-daraja: leaf itemlar ── */
.asc-leafitems {
    margin: 1px 0 4px 0.6rem;
    padding-left: 0.7rem;
    border-left: 1px solid #e8ecf1;
    display: flex;
    flex-direction: column;
    gap: 1px;
}
.asc-leaf {
    display: block;
    padding: 0.44rem 0.6rem;
    border-radius: 8px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    outline: none;
    transition:
        background 0.13s,
        color 0.13s;
}
.asc-leaf:hover {
    background: #f8fafc;
    color: #334155;
}
.asc-leaf:focus-visible {
    box-shadow: 0 0 0 2px #bfdbfe;
}
.asc-leaf--active {
    background: #eff6ff;
    color: #2563eb;
    font-weight: 700;
}
</style>

<style>
.app-dark .asc-sidebar {
    background: var(--surface-card, #1e293b) !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
}
.app-dark .asc-header {
    border-bottom-color: rgba(255, 255, 255, 0.08) !important;
}
.app-dark .asc-item,
.app-dark .asc-subitem,
.app-dark .asc-leaf {
    color: rgba(255, 255, 255, 0.8) !important;
}
.app-dark .asc-item:hover,
.app-dark .asc-subitem:hover,
.app-dark .asc-leaf:hover {
    background: rgba(255, 255, 255, 0.06) !important;
    color: #fff !important;
}
.app-dark .asc-item:focus-visible,
.app-dark .asc-subitem:focus-visible,
.app-dark .asc-leaf:focus-visible {
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.45) !important;
}
.app-dark .asc-item--active,
.app-dark .asc-subitem--active,
.app-dark .asc-leaf--active {
    position: relative;
    background: rgba(96, 165, 250, 0.16) !important;
    color: #93c5fd !important;
}
.app-dark .asc-item--active::before,
.app-dark .asc-subitem--active::before,
.app-dark .asc-leaf--active::before {
    content: '';
    position: absolute;
    left: -0.6rem;
    top: 15%;
    height: 70%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: #60a5fa;
}
.app-dark .asc-item--active:hover,
.app-dark .asc-subitem--active:hover,
.app-dark .asc-leaf--active:hover {
    background: rgba(96, 165, 250, 0.22) !important;
    color: #93c5fd !important;
}
.app-dark .asc-item-chevron,
.app-dark .asc-subitem-chevron {
    color: rgba(255, 255, 255, 0.4) !important;
}
.app-dark .asc-submodules,
.app-dark .asc-leafitems {
    border-left-color: rgba(255, 255, 255, 0.1) !important;
}
.app-dark .asc-toggle {
    color: rgba(255, 255, 255, 0.5) !important;
}
.app-dark .asc-toggle:hover {
    background: rgba(255, 255, 255, 0.08) !important;
    color: #fff !important;
}
</style>
