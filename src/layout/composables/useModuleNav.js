import { ref } from 'vue';

// ---------------------------------------------------------------------------
// Ilova/modul ro'yxati — AppSidebarClassic.vue shu yerdan o'qiydi. Ro'yxat
// Dashboard.vue'dagi KPI kartalari bilan bir xil: har bir karta — mustaqil
// sahifa (route). Kartaning pastida raqamli bo'linmalari (subStats) bo'lsa,
// o'sha bo'linmalar shu app'ning ichki havolalari (`modules`) bo'ladi.
//
// App shakli:  { id, label, faIcon, to, activeMatch?, hidden?, modules: [{ to, label }] }
//   - `to`      — app'ning o'z sahifasi (modullari bo'lsa ham bosilsa ochiladi)
//   - `modules` — ichki havolalar; bo'sh bo'lsa app oddiy havola bo'lib qoladi
//   - `hidden`  — true bo'lsa sidebar'da ko'rinmaydi (route esa ishlayveradi);
//                 hozircha faqat Boshqaruv paneli ko'rsatiladi
// Modulning yana ichki submenyusi kerak bo'lsa:
//   moduleMenus[mod.to] = { items: [{ to, label }] }
//
// Yangi sahifa qo'shilganda: shu massivga element + src/router/index.js'ga
// mos route + faIcon'ni src/plugins/fontawesome.js'ga qo'shish kifoya.
// ---------------------------------------------------------------------------

export const apps = [
    {
        id: 'dashboard',
        label: 'Boshqaruv paneli',
        faIcon: 'gauge-high',
        to: '/dashboard',
        modules: []
    },
    {
        id: 'ground-transport',
        label: 'Yer usti transporti',
        faIcon: 'bus',
        hidden: true,
        to: '/transport',
        activeMatch: '/transport',
        modules: [
            { to: '/transport/avtobus', label: 'Avtobus' },
            { to: '/transport/marshrut', label: 'Mashrut' },
            { to: '/transport/taksi', label: 'Taxi' }
        ]
    },
    {
        id: 'metro',
        label: 'Metro',
        faIcon: 'train-subway',
        hidden: true,
        to: '/metro',
        modules: []
    },
    {
        id: 'education',
        label: "Ta'lim",
        faIcon: 'graduation-cap',
        hidden: true,
        to: '/talim',
        activeMatch: '/talim',
        modules: [
            { to: '/talim/otm', label: 'OTM' },
            { to: '/talim/maktablar', label: 'Maktablar' },
            { to: '/talim/bogchalar', label: "Bog'chalar" }
        ]
    },
    {
        id: 'congestion',
        label: 'Tirbandlik',
        faIcon: 'traffic-light',
        hidden: true,
        to: '/tirbandlik',
        activeMatch: '/tirbandlik',
        modules: [
            { to: '/tirbandlik/hal-etilgan', label: 'Hal etilgan' },
            { to: '/tirbandlik/jarayonda', label: 'Jarayonda' }
        ]
    },
    {
        id: 'social',
        label: 'Ijtimoiy tarmoq',
        faIcon: 'share-nodes',
        hidden: true,
        to: '/ijtimoiy-tarmoq',
        activeMatch: '/ijtimoiy-tarmoq',
        modules: [
            { to: '/ijtimoiy-tarmoq/hal-etilgan', label: 'Hal etilgan' },
            { to: '/ijtimoiy-tarmoq/jarayonda', label: 'Jarayonda' }
        ]
    },
    {
        id: 'mobile-brigade',
        label: 'Mobil brigada',
        faIcon: 'people-group',
        hidden: true,
        to: '/mobil-brigada',
        activeMatch: '/mobil-brigada',
        modules: [
            { to: '/mobil-brigada/onlayn', label: 'Onlayn' },
            { to: '/mobil-brigada/oflayn', label: 'Oflayn' }
        ]
    },
    {
        id: 'road-repair',
        label: "Yo'l ta'miri",
        faIcon: 'road',
        hidden: true,
        to: '/yol-tamiri',
        activeMatch: '/yol-tamiri',
        modules: [
            { to: '/yol-tamiri/jarayonda', label: 'Jarayonda' },
            { to: '/yol-tamiri/hal-etilgan', label: 'Hal etilgan' }
        ]
    },
    {
        id: 'report',
        label: 'Hisobot',
        faIcon: 'chart-column',
        hidden: true,
        to: '/hisobot',
        modules: []
    }
];

// Hozircha uchinchi darajali (modul ichidagi) submenyu yo'q — sidebar buni
// qo'llab-quvvatlaydi, kerak bo'lganda shu obyektga qo'shiladi.
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
