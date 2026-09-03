import { ref } from 'vue';

// ---------------------------------------------------------------------------
// Ilova/modul ro'yxati — AppSidebarClassic.vue shu yerdan o'qiydi. Hozircha
// loyihada bitta haqiqiy sahifa bor (Dashboard), shu bois "apps" bitta
// to'g'ridan-to'g'ri havolali elementdan iborat. Yangi sahifa qo'shilganda
// shu massivga yangi element (yoki mavjud app'ga yangi "modules" elementi)
// qo'shish kifoya — sidebar avtomatik yangilanadi.
//
// App shakli:  { id, label, faIcon, to?, modules: [{ to, label, faIcon }] }
// Submenyuli modul uchun moduleMenus[mod.to] = { items: [{ to, label, icon }] }
// ---------------------------------------------------------------------------

export const apps = [
    {
        id: 'dashboard',
        label: 'Boshqaruv paneli',
        faIcon: 'gauge-high',
        to: '/dashboard',
        modules: []
    }
];

// Hozircha ichki submenyuga ega modul yo'q — kelajakda kengaytirish uchun tayyor.
export const moduleMenus = {};

export function getSubMenu(mod) {
    return moduleMenus[mod.to] ?? null;
}

// ── Klassik sidebar ochiq/yopiq holati (foydalanuvchi tanlovi saqlanadi) ──
const SIDEBAR_OPEN_KEY = 'codd_sidebar_open';
export const sidebarOpen = ref(localStorage.getItem(SIDEBAR_OPEN_KEY) !== '0');

export function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
    localStorage.setItem(SIDEBAR_OPEN_KEY, sidebarOpen.value ? '1' : '0');
}
