import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Har bir sahifa hozircha bitta umumiy "tayyorlanmoqda" ko'rinishidan foydalanadi —
// mazmun yozilganda shu component'ni o'z SFC'iga almashtirish kifoya, route yo'li
// (`path`) va sidebar (useModuleNav.js) o'zgarishsiz qoladi.
const Placeholder = () => import('@/views/PlaceholderView.vue');

// Sahifa sarlavhasi PlaceholderView.vue'ga `meta.title` orqali yetkaziladi.
const page = (path, name, title) => ({ path, name, component: Placeholder, meta: { title } });

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            { path: '', redirect: '/dashboard' },
            { path: 'dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue') },

            // ── Yer usti transporti ──
            page('transport', 'transport', 'Yer usti transporti'),
            page('transport/avtobus', 'transport-avtobus', 'Avtobus'),
            page('transport/marshrut', 'transport-marshrut', 'Mashrut'),
            page('transport/taksi', 'transport-taksi', 'Taxi'),

            // ── Metro ──
            page('metro', 'metro', 'Metro'),

            // ── Ta'lim ──
            page('talim', 'talim', "Ta'lim"),
            page('talim/otm', 'talim-otm', 'OTM'),
            page('talim/maktablar', 'talim-maktablar', 'Maktablar'),
            page('talim/bogchalar', 'talim-bogchalar', "Bog'chalar"),

            // ── Tirbandlik ──
            page('tirbandlik', 'tirbandlik', 'Tirbandlik'),
            page('tirbandlik/hal-etilgan', 'tirbandlik-hal-etilgan', 'Tirbandlik — hal etilgan'),
            page('tirbandlik/jarayonda', 'tirbandlik-jarayonda', 'Tirbandlik — jarayonda'),

            // ── Ijtimoiy tarmoq ──
            page('ijtimoiy-tarmoq', 'ijtimoiy-tarmoq', 'Ijtimoiy tarmoq'),
            page('ijtimoiy-tarmoq/hal-etilgan', 'ijtimoiy-tarmoq-hal-etilgan', 'Ijtimoiy tarmoq — hal etilgan'),
            page('ijtimoiy-tarmoq/jarayonda', 'ijtimoiy-tarmoq-jarayonda', 'Ijtimoiy tarmoq — jarayonda'),

            // ── Mobil brigada ──
            page('mobil-brigada', 'mobil-brigada', 'Mobil brigada'),
            page('mobil-brigada/onlayn', 'mobil-brigada-onlayn', 'Mobil brigada — onlayn'),
            page('mobil-brigada/oflayn', 'mobil-brigada-oflayn', 'Mobil brigada — oflayn'),

            // ── Yo'l ta'miri ──
            page('yol-tamiri', 'yol-tamiri', "Yo'l ta'miri"),
            page('yol-tamiri/jarayonda', 'yol-tamiri-jarayonda', "Yo'l ta'miri — jarayonda"),
            page('yol-tamiri/hal-etilgan', 'yol-tamiri-hal-etilgan', "Yo'l ta'miri — hal etilgan"),

            // ── Hisobot ──
            page('hisobot', 'hisobot', 'Hisobot'),

            { path: ':pathMatch(.*)*', redirect: '/dashboard' }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
