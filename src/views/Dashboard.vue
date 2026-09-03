<script setup>
import { ref } from 'vue';
import KpiCardSimple from '@/components/dashboard/KpiCardSimple.vue';
import DistrictFilterBar from '@/components/dashboard/DistrictFilterBar.vue';
import TransportMapCard from '@/components/dashboard/TransportMapCard.vue';
import RouteBusTablePanel from '@/components/dashboard/RouteBusTablePanel.vue';
import CrossroadsLoadPanel from '@/components/dashboard/CrossroadsLoadPanel.vue';
import PassengerDiffPanel from '@/components/dashboard/PassengerDiffPanel.vue';
import TrafficOverviewPanel from '@/components/dashboard/TrafficOverviewPanel.vue';
import CityEntryTransportPanel from '@/components/dashboard/CityEntryTransportPanel.vue';
import CongestionPanel from '@/components/dashboard/CongestionPanel.vue';
import IntegrationStatusBar from '@/components/dashboard/IntegrationStatusBar.vue';

// Header kartalardan qaysi biri bosilsa, pastdagi xarita + unga tegishli ma'lumotlar
// shu rejimga o'tadi. Hozircha ikkita rejim bor: avtobus (transport/tirbandlik
// kartalari) va metro.
const activeView = ref('buses');

// Tuman bo'yicha filtr — hozircha faqat UI, ma'lumotlar ulanganda tanlangan
// tumanga qarab har bir panel massivini filtrlash kifoya.
const districts = ["Barchasi", 'Uchtepa', 'Yunusobod', "Mirzo Ulug'bek", 'Mirobod', 'Shayhontohur', 'Chilonzor', 'Yangi hayot', 'Yashnobod', 'Bektemir', 'Olmazor', 'Sergeli', 'Yakkasaroy'];
const activeDistrict = ref('Barchasi');

// ---------------------------------------------------------------------------
// STATIK DEMO MA'LUMOTLARI - "MA'LUMOTNOMA (03.09.2026 yil soat 09.00 holatiga)"
// hujjatidagi BARCHA ma'lumotlar shu yerda, hech narsa tashlab ketilmagan.
// API ulanganda har bir massivni tegishli service javobiga almashtirish kifoya.
// ---------------------------------------------------------------------------

const kpis = [
    {
        icon: 'pi pi-car',
        iconBg: '#dbeafe',
        iconColor: '#2563eb',
        label: 'Yer usti transporti',
        value: '739',
        percentText: "+4.2% - o'tgan kunga nisbatan (Jami chiqdi)",
        percentColor: '#2563eb',
        view: 'buses',
        // Yer usti transportining turlar bo'yicha (avtobus/marshrut/taksi) bo'linishi —
        // KpiCardSimple.vue'dagi ixtiyoriy pastki qator sifatida chiqadi.
        subStats: [
            { label: 'Avtobus', value: '234' },
            { label: 'Mashrut', value: '234' },
            { label: 'Taxi', value: '263' }
        ]
    },
    {
        icon: 'pi pi-directions',
        iconBg: '#e0e7ff',
        iconColor: '#4338ca',
        label: 'Metro',
        value: '435',
        view: 'metro'
        // turlari hozircha yo'q — subStats keyinroq qo'shiladi
    },
    {
        icon: 'pi pi-graduation-cap',
        iconBg: '#ccfbf1',
        iconColor: '#0d9488',
        label: "Ta'lim",
        value: '463',
        subStats: [
            { label: 'OTM', value: '234' },
            { label: 'Maktablar', value: '123' },
            { label: 'Bog\'chalar', value: '13' }
        ]
    },
    {
        icon: 'pi pi-ban',
        iconBg: '#ffe4e6',
        iconColor: '#e11d48',
        label: 'Tirbandlik',
        value: '2 352',
        subStats: [
            { label: 'Hal etilgan', value: '223' },
            { label: 'Jarayonda', value: '263' }
        ]
    },
    {
        icon: 'pi pi-share-alt',
        iconBg: '#fce7f3',
        iconColor: '#db2777',
        label: 'Ijtimoiy tarmoq',
        value: '7 352',
        subStats: [
            { label: 'Hal etilgan', value: '2 734' },
            { label: 'Jarayonda', value: '3 565' }
        ]
    },
    {
        icon: 'pi pi-mobile',
        iconBg: '#cffafe',
        iconColor: '#0891b2',
        label: 'Mobil brigada',
        value: '236',
        subStats: [
            { label: 'Onlayn', value: '23' },
            { label: 'Oflayn', value: '23' }
        ]
    },
    {
        icon: 'pi pi-wrench',
        iconBg: '#fef3c7',
        iconColor: '#d97706',
        label: "Yo'l ta'miri",
        value: '7 356',
        subStats: [
            { label: 'Jarayonda', value: '2 345' },
            { label: 'Hal etilgan', value: '2 354' }
        ]
    },
    {
        // Hisobot — hozircha bo'sh, ma'lumot kelganda to'ldiriladi.
        icon: 'pi pi-chart-bar',
        iconBg: '#f3f4f6',
        iconColor: '#6b7280',
        label: 'Hisobot',
        value: '–'
    }
];

// Avtobuslarning holati (soz/nosoz/yo'nalishda/yo'nalishda emas/to'xtab turibdi)
// avtobuslar saroyi kesimida \u2014 RouteBusTablePanel'dagi PrimeVue DataTable uchun.
const busStatusRows = [
    { name: '1 -son', soz: 190, nosoz: 8, yonalishda: 183, yonalishdaEmas: 4, toxtabTurgan: 3, gpsBor: 195, gpsYoq: 3 },
    { name: '2 -son', soz: 232, nosoz: 5, yonalishda: 227, yonalishdaEmas: 3, toxtabTurgan: 2, gpsBor: 234, gpsYoq: 3 },
    { name: '4 -son', soz: 180, nosoz: 6, yonalishda: 176, yonalishdaEmas: 2, toxtabTurgan: 2, gpsBor: 183, gpsYoq: 3 },
    { name: '5 -son', soz: 188, nosoz: 7, yonalishda: 184, yonalishdaEmas: 2, toxtabTurgan: 2, gpsBor: 192, gpsYoq: 3 },
    { name: '7 -son', soz: 199, nosoz: 6, yonalishda: 195, yonalishdaEmas: 2, toxtabTurgan: 2, gpsBor: 202, gpsYoq: 3 },
    { name: '8 -son', soz: 243, nosoz: 9, yonalishda: 238, yonalishdaEmas: 3, toxtabTurgan: 2, gpsBor: 248, gpsYoq: 4 },
    { name: '12 -son', soz: 211, nosoz: 8, yonalishda: 206, yonalishdaEmas: 3, toxtabTurgan: 2, gpsBor: 216, gpsYoq: 3 },
    { name: '18 -son', soz: 234, nosoz: 11, yonalishda: 228, yonalishdaEmas: 4, toxtabTurgan: 2, gpsBor: 241, gpsYoq: 4 },
    { name: '"Автосантранс" МЧЖ', soz: 19, nosoz: 1, yonalishda: 18, yonalishdaEmas: 1, toxtabTurgan: 0, gpsBor: 20, gpsYoq: 0 },
    { name: '"Идеал авто сервис" МЧЖ', soz: 18, nosoz: 1, yonalishda: 17, yonalishdaEmas: 1, toxtabTurgan: 0, gpsBor: 19, gpsYoq: 0 }
];

// Chorraxalar yuklamasi — YXTEM sensorlaridan jonli (live) formatda keladigan
// 1-10 ballik tirbandlik ko'rsatkichi. Hozircha static demo (API ulanganda
// tegishli service javobiga almashtiriladi).
const crossroadsLoadRows = [
    { name: "Farhod ko'chasi — Lutfiy ko'chasi", score: 9 },
    { name: "Bunyodkor ko'chasi — Amir Temur shoh ko'chasi", score: 6 },
    { name: "Katta halqa yo'li — Chilonzor", score: 5 },
    { name: "Mustaqillik shoh ko'chasi — Navoiy ko'chasi", score: 4 },
    { name: "Shota Rustaveli — Bog'ishamol", score: 3 },
    { name: "Yunusobod — Nihol", score: 2 }
];

const passengerDiffRows = [
    { hourLabel: '05.00-06.00', day2: 6523, day3: 4751, diff: -1772 },
    { hourLabel: '06.00-07.00', day2: 21481, day3: 15796, diff: -5685 },
    { hourLabel: '07.00-08.00', day2: 53692, day3: 47516, diff: -6176 },
    { hourLabel: '08.00-09.00', day2: 64278, day3: 62404, diff: -1874 },
    { hourLabel: '09.00-10.00', day2: 45797, day3: 41732, diff: -4065 },
    { hourLabel: '10.00-11.00', day2: 36647, day3: 32415, diff: -4232 }
];

const trafficMorningRows = [
    { no: 1, time: '05:00-06:00', v1: 81005, v2: 79624, diff: -1381, pct: -2 },
    { no: 2, time: '06:00-07:00', v1: 221812, v2: 224691, diff: 2879, pct: 1 },
    { no: 3, time: '07:00-08:00', v1: 270992, v2: 297557, diff: 26565, pct: 10 },
    { no: 4, time: '08:00-09:00', v1: 244677, v2: 260640, diff: 15963, pct: 7 },
    { no: 5, time: '09:00-10:00', v1: 230690, v2: 240478, diff: 9788, pct: 4 }
];
const trafficEveningRows = [
    { no: 6, time: '16:00-17:00', v1: 244074, v2: null, diff: null, pct: null },
    { no: 7, time: '17:00-18:00', v1: 262009, v2: null, diff: null, pct: null },
    { no: 8, time: '18:00-19:00', v1: 282229, v2: null, diff: null, pct: null },
    { no: 9, time: '19:00-20:00', v1: 249149, v2: null, diff: null, pct: null }
];

const cityEntryRows = [
    { no: 1, name: '\u041a\u0435\u043b\u0435\u0441', highlight: true, kirdi: 38371, chiqdi: 39045 },
    { no: 2, name: '\u0425\u0430\u0441\u0430\u043d\u0431\u043e\u0439', kirdi: 13380, chiqdi: 12753 },
    { no: 3, name: '\u0423\u0447 \u049b\u0430\u04b3\u0440\u0430\u043c\u043e\u043d', kirdi: 24180, chiqdi: 25763 },
    { no: 4, name: '\u049a\u043e\u0440\u0430\u043c\u0443\u0440\u0442', kirdi: 19545, chiqdi: 24597 },
    { no: 5, name: '\u0421\u045e\u049b\u043e\u049b', kirdi: 4039, chiqdi: 3525 },
    { no: 6, name: '\u0427\u045e\u043b\u043f\u043e\u043d', kirdi: 9598, chiqdi: 9910 },
    { no: 7, name: '\u0428\u0430\u0440\u049b', highlight: true, kirdi: 43194, chiqdi: 41052 },
    { no: 8, name: '\u0411\u0435\u043a\u0442\u0435\u043c\u0438\u0440', kirdi: 33020, chiqdi: 35200 },
    { no: 9, name: '\u0422\u0443\u0440\u0431\u0430\u043d\u043e\u0432', kirdi: 11832, chiqdi: 10928 },
    { no: 10, name: '\u042d\u0440\u043a\u0438\u043d', highlight: true, kirdi: 57355, chiqdi: 51461 },
    { no: 11, name: '\u040e\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u043e\u043d', kirdi: 12898, chiqdi: 13348 },
    { no: 12, name: '\u041c\u0438\u043d \u0441\u0443\u0432', kirdi: 25341, chiqdi: 25318 }
];
const cityEntryTotal = { kirdi: 279373, chiqdi: 292900 };

const congestion = {
    crossroads: 123,
    ypxStaff: 544,
    detectedCongestion: 2,
    segments: [
        { label: '\u0421\u041e\u0417', value: 339, color: '#3b82f6' },
        { label: '\u041d\u041e\u0421\u041e\u0417', value: 13, color: '#ef4444' }
    ],
    total: 352,
    legendTitle: 'Svetoforlar'
};

</script>

<template>
    <div class="transport-page">
        <div class="kpi-row">
            <KpiCardSimple v-for="(k, i) in kpis" :key="i" v-bind="k" :clickable="!!k.view" :active="!!k.view && activeView === k.view" @click="k.view && (activeView = k.view)" />
        </div>

        <DistrictFilterBar v-model="activeDistrict" :districts="districts" />

        <div class="row row--3col">
            <TransportMapCard :mode="activeView" />
            <RouteBusTablePanel :rows="busStatusRows" />
            <CrossroadsLoadPanel :rows="crossroadsLoadRows" />
        </div>


        <div class="row row--4col">
            <PassengerDiffPanel :rows="passengerDiffRows" :grand-total="763363" />
            <CongestionPanel v-bind="congestion" />
            <CityEntryTransportPanel date-note="02 sentyabr holatiga" :rows="cityEntryRows" :total="cityEntryTotal" />
            <TrafficOverviewPanel compare-label1="sentyabr (02.09.2026 chorshanba)" compare-label2="sentyabr (03.09.2026 payshanba)" :morning-rows="trafficMorningRows" :evening-rows="trafficEveningRows" />
        </div>
    </div>
</template>

<style scoped>
.transport-page {
    /* Loyihaning global mavzu (light/dark) tokenlariga alias — App qobig'idagi
       .app-dark klassi almashganda bu qiymatlar avtomatik yangilanadi, shu
       tufayli quyidagi barcha dashboard komponentlari (var(--lt-*, ...) orqali
       meros oladi) qo'shimcha o'zgarishsiz qorong'i rejimga moslashadi. */
    --lt-bg: var(--surface-ground);
    --lt-card: var(--surface-card);
    --lt-border: var(--surface-border);
    --lt-text: var(--text-color);
    --lt-text-secondary: var(--text-color-secondary);
    --lt-primary: var(--primary-color);

    color: var(--lt-text);
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    font-family: 'Inter', 'Segoe UI', sans-serif;
    /* Butun dashboard bitta ekranga (100vh) sig'ishi kerak — sarlavha qatorlari
       (kpi, tuman filtri, integratsiya paneli) o'z tabiiy balandligini oladi,
       ikkita "katta" qator (`.row`) esa qolgan bo'shliqni teng bo'lishadi.
       AppLayout.vue'dagi `.layout-main{height:100%}` shu balandlikni beradi. */
    height: 100%;
    min-height: 0;
    overflow: hidden;
}
.kpi-row {
    flex-shrink: 0;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 0.7rem;
}
.row {
    display: grid;
    gap: 1.1rem;
    flex: 1 1 0;
    min-height: 0;
}
.row--3col {
    grid-template-columns: repeat(3, 1fr);
    align-items: stretch;
}
.row--4col {
    grid-template-columns: repeat(4, 1fr);
    align-items: stretch;
}
@media (max-width: 1500px) {
    .kpi-row {
        grid-template-columns: repeat(3, 1fr);
    }
    .row--4col {
        grid-template-columns: repeat(2, 1fr);
    }
}
/* Tor ekranlarda qatorlar bitta ustunga tushadi — bunda barchasini bitta
   ekran balandligiga sig'dirib bo'lmaydi, shu bois shu holatda (va faqat shu
   holatda) qator o'zining ichki vertikal scroll'iga qaytadi. */
@media (max-width: 1300px) {
    .row--3col {
        grid-template-columns: 1fr;
        overflow-y: auto;
    }
}
@media (max-width: 900px) {
    .row--4col {
        grid-template-columns: 1fr;
        overflow-y: auto;
    }
}
@media (max-width: 700px) {
    .kpi-row {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
