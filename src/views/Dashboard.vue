<script setup>
import { ref } from 'vue';
import KpiCardSimple from '@/components/dashboard/KpiCardSimple.vue';
import DistrictFilterBar from '@/components/dashboard/DistrictFilterBar.vue';
import TransportMapCard from '@/components/dashboard/TransportMapCard.vue';
import RouteBusTablePanel from '@/components/dashboard/RouteBusTablePanel.vue';
import LoadListPanel from '@/components/dashboard/LoadListPanel.vue';
import RoutesStreetsPanel from '@/components/dashboard/RoutesStreetsPanel.vue';
import PassengerDiffPanel from '@/components/dashboard/PassengerDiffPanel.vue';
import TrafficTimeTablePanel from '@/components/dashboard/TrafficTimeTablePanel.vue';
import TrafficOverviewPanel from '@/components/dashboard/TrafficOverviewPanel.vue';
import CityEntryTransportPanel from '@/components/dashboard/CityEntryTransportPanel.vue';
import RouteDispatchPanel from '@/components/dashboard/RouteDispatchPanel.vue';
import CongestionPanel from '@/components/dashboard/CongestionPanel.vue';
import IntegrationStatusBar from '@/components/dashboard/IntegrationStatusBar.vue';

// Header kartalardan qaysi biri bosilsa, pastdagi xarita + unga tegishli ma'lumotlar
// shu rejimga o'tadi. Uchta rejim bor: avtobus, metro va tirbandlik (bu holatda
// o'rtadagi ikkita karta ko'chalar yuklamasi va marshrutlar qamroviga almashadi).
const activeView = ref('buses');

// Tirbandlik rejimida tanlangan marshrut — xaritada shu marshrut yo'nalishini
// ko'rsatish uchun TransportMapCard'ga uzatiladi.
const selectedRoute = ref(null);

function selectView(view) {
    if (!view) return;
    activeView.value = view;
    selectedRoute.value = null;
}
function selectRoute(name) {
    selectedRoute.value = selectedRoute.value === name ? null : name;
}

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
        view: 'metro',
        subStats: [
            { label: 'Yer usti', value: '234' },
            { label: 'Yer osti', value: '123' },
        ]
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
        view: 'tirbandlik',
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
    { name: '1 -son', soz: 190, nosoz: 8, yonalishda: 183, yonalishdaEmas: 4, toxtabTurgan: 3, gpsBor: 195, gpsYoq: 3, kameraBor: 190, kameraYoq: 8 },
    { name: '2 -son', soz: 232, nosoz: 5, yonalishda: 227, yonalishdaEmas: 3, toxtabTurgan: 2, gpsBor: 234, gpsYoq: 3, kameraBor: 230, kameraYoq: 7 },
    { name: '4 -son', soz: 180, nosoz: 6, yonalishda: 176, yonalishdaEmas: 2, toxtabTurgan: 2, gpsBor: 183, gpsYoq: 3, kameraBor: 178, kameraYoq: 8 },
    { name: '5 -son', soz: 188, nosoz: 7, yonalishda: 184, yonalishdaEmas: 2, toxtabTurgan: 2, gpsBor: 192, gpsYoq: 3, kameraBor: 187, kameraYoq: 8 },
    { name: '7 -son', soz: 199, nosoz: 6, yonalishda: 195, yonalishdaEmas: 2, toxtabTurgan: 2, gpsBor: 202, gpsYoq: 3, kameraBor: 196, kameraYoq: 9 },
    { name: '8 -son', soz: 243, nosoz: 9, yonalishda: 238, yonalishdaEmas: 3, toxtabTurgan: 2, gpsBor: 248, gpsYoq: 4, kameraBor: 241, kameraYoq: 11 },
    { name: '12 -son', soz: 211, nosoz: 8, yonalishda: 206, yonalishdaEmas: 3, toxtabTurgan: 2, gpsBor: 216, gpsYoq: 3, kameraBor: 209, kameraYoq: 10 },
    { name: '18 -son', soz: 234, nosoz: 11, yonalishda: 228, yonalishdaEmas: 4, toxtabTurgan: 2, gpsBor: 241, gpsYoq: 4, kameraBor: 233, kameraYoq: 12 },
    { name: '"Автосантранс" МЧЖ', soz: 19, nosoz: 1, yonalishda: 18, yonalishdaEmas: 1, toxtabTurgan: 0, gpsBor: 20, gpsYoq: 0, kameraBor: 20, kameraYoq: 0 },
    { name: '"Идеал авто сервис" МЧЖ', soz: 18, nosoz: 1, yonalishda: 17, yonalishdaEmas: 1, toxtabTurgan: 0, gpsBor: 19, gpsYoq: 0, kameraBor: 18, kameraYoq: 1 }
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

// Tirbandlik rejimida "Avtobuslarning holati" o'rniga chiqadigan ko'chalar
// yuklamasi — LoadListPanel bilan bir xil ko'rinishda, lekin chorraxa emas,
// alohida ko'cha kesimida.
const streetsLoadRows = [
    { name: "Farhod ko'chasi", score: 8 },
    { name: "Bunyodkor ko'chasi", score: 7 },
    { name: "Amir Temur shoh ko'chasi", score: 6 },
    { name: "Mustaqillik shoh ko'chasi", score: 5 },
    { name: "Chilonzor ko'chasi", score: 4 },
    { name: "Yunusobod ko'chasi", score: 3 }
];

// Tirbandlik rejimida "Chorraxalar yuklamasi" o'rniga chiqadigan marshrutlar
// kesimida ko'chalar qamrovi — har bir marshrut qaysi ko'chalardan o'tishi va
// nechta ko'chani qamrab olishi. Qatorni bosish xaritada marshrut yo'nalishini
// ko'rsatadi (TransportMapCard'ga selectedRoute sifatida uzatiladi).
const routesStreetsRows = [
    { name: '1 -son', streets: ["Bunyodkor ko'chasi", 'Amir Temur shoh ko\'chasi', "Yunusobod ko'chasi"], asfaltBor: 3, asfaltYoq: 0 },
    { name: '2 -son', streets: ["Farhod ko'chasi", "Lutfiy ko'chasi"], asfaltBor: 1, asfaltYoq: 1 },
    { name: '4 -son', streets: ["Chilonzor ko'chasi", "Bog'ishamol ko'chasi"], asfaltBor: 2, asfaltYoq: 0 },
    { name: '5 -son', streets: ["Mustaqillik shoh ko'chasi", "Navoiy ko'chasi", 'Shota Rustaveli ko\'chasi'], asfaltBor: 2, asfaltYoq: 1 },
    { name: '7 -son', streets: ["Katta halqa yo'li"], asfaltBor: 0, asfaltYoq: 1 },
    { name: '8 -son', streets: ["Bunyodkor ko'chasi", "Mirzo Ulug'bek ko'chasi", 'Amir Temur shoh ko\'chasi'], asfaltBor: 3, asfaltYoq: 0 },
    { name: '12 -son', streets: ["Yunusobod ko'chasi", "Nihol ko'chasi"], asfaltBor: 1, asfaltYoq: 1 },
    { name: '18 -son', streets: ["Chilonzor ko'chasi", "Bog'ishamol ko'chasi", "Mustaqillik shoh ko'chasi"], asfaltBor: 3, asfaltYoq: 0 }
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
    { no: 1, name: 'Keles', highlight: true, kirdi: 38371, chiqdi: 39045 },
    { no: 2, name: 'Xasanboy', kirdi: 13380, chiqdi: 12753 },
    { no: 3, name: 'Uch qahramon', kirdi: 24180, chiqdi: 25763 },
    { no: 4, name: 'Qoramurt', kirdi: 19545, chiqdi: 24597 },
    { no: 5, name: "So'qoq", kirdi: 4039, chiqdi: 3525 },
    { no: 6, name: "Cho'lpon", kirdi: 9598, chiqdi: 9910 },
    { no: 7, name: 'Sharq', highlight: true, kirdi: 43194, chiqdi: 41052 },
    { no: 8, name: 'Bektemir', kirdi: 33020, chiqdi: 35200 },
    { no: 9, name: 'Turbanov', kirdi: 11832, chiqdi: 10928 },
    { no: 10, name: 'Erkin', highlight: true, kirdi: 57355, chiqdi: 51461 },
    { no: 11, name: "O'zbekiston", kirdi: 12898, chiqdi: 13348 },
    { no: 12, name: 'Min suv', kirdi: 25341, chiqdi: 25318 }
];
const cityEntryTotal = { kirdi: 279373, chiqdi: 292900 };

// Yo'nalishga chiqarilgan avtobuslar — avtobuslar saroyi kesimida 06.00 va
// 08.00 holatiga reja/amalda/farqi. "Yer usti transporti" rejimida "Shahar
// chegara postlaridan transport oqimi" o'rniga shu chiqadi (o'sha panel
// tirbandlik rejimiga o'tkazildi).
const dispatchMainRows = [
    { no: 1, name: '1 -son', plan6: 72, actual6: 72, diff6: 0, plan8: 188, actual8: 183, diff8: -5 },
    { no: 2, name: '2 -son', plan6: 142, actual6: 134, diff6: -8, plan8: 227, actual8: 227, diff8: 0 },
    { no: 3, name: '4 -son', plan6: 54, actual6: 51, diff6: -3, plan8: 178, actual8: 176, diff8: -2 },
    { no: 4, name: '5 -son', plan6: 73, actual6: 71, diff6: -2, plan8: 188, actual8: 184, diff8: -4 },
    { no: 5, name: '7 -son', plan6: 73, actual6: 70, diff6: -3, plan8: 197, actual8: 195, diff8: -2 },
    { no: 6, name: '8 -son', plan6: 111, actual6: 96, diff6: -15, plan8: 244, actual8: 238, diff8: -6 },
    { no: 7, name: '12 -son', plan6: 74, actual6: 72, diff6: -2, plan8: 212, actual8: 206, diff8: -6 },
    { no: 8, name: '18 -son', plan6: 119, actual6: 110, diff6: -9, plan8: 238, actual8: 228, diff8: -10 }
];
const dispatchMainTotal = { plan6: 718, actual6: 676, diff6: -43, plan8: 1672, actual8: 1637, diff8: -35 };
const dispatchCompanyRows = [
    { no: 9, name: '"Avtosantrans" MChJ', plan6: 4, actual6: 4, diff6: 0, plan8: 18, actual8: 18, diff8: 0 },
    { no: 10, name: '"Ideal avto servis" MChJ', plan6: 17, actual6: 17, diff6: 0, plan8: 17, actual8: 17, diff8: 0 }
];
const dispatchCompanyTotal = { plan6: 4, actual6: 4, diff6: 0, plan8: 18, actual8: 18, diff8: 0 };
const dispatchGrandTotal = { plan6: 739, actual6: 697, diff6: -42, plan8: 1707, actual8: 1672, diff8: -35 };

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
            <KpiCardSimple v-for="(k, i) in kpis" :key="i" v-bind="k" :clickable="!!k.view" :active="!!k.view && activeView === k.view" @click="selectView(k.view)" />
        </div>

        <DistrictFilterBar v-model="activeDistrict" :districts="districts" />

        <div class="row row--3col" :class="{ 'row--3col-buses': activeView !== 'tirbandlik' }">
            <TransportMapCard :mode="activeView" :selected-route="selectedRoute" />
            <template v-if="activeView === 'tirbandlik'">
                <LoadListPanel title="Ko'chalar yuklamasi" :rows="streetsLoadRows" location-word="ko'chasida" />
                <LoadListPanel title="Chorraxalar yuklamasi" :rows="crossroadsLoadRows" />
            </template>
            <template v-else>
                <RouteBusTablePanel :rows="busStatusRows" />
                <RoutesStreetsPanel :rows="routesStreetsRows" :selected="selectedRoute" @select="selectRoute" />
            </template>
        </div>

        <div class="row row--4col" :class="{ 'row--4col-wide1': activeView === 'buses' }">
            <PassengerDiffPanel v-if="activeView === 'metro'" :rows="passengerDiffRows" :grand-total="763363" />
            <TrafficTimeTablePanel v-else compare-label1="sentyabr (02.09.2026 chorshanba)" compare-label2="sentyabr (03.09.2026 payshanba)" :morning-rows="trafficMorningRows" :evening-rows="trafficEveningRows" />
            <CongestionPanel v-if="activeView !== 'buses'" v-bind="congestion" />
            <CityEntryTransportPanel v-if="activeView === 'tirbandlik'" date-note="02 sentyabr holatiga" :rows="cityEntryRows" :total="cityEntryTotal" />
            <RouteDispatchPanel v-else :main-rows="dispatchMainRows" :main-total="dispatchMainTotal" :company-rows="dispatchCompanyRows" :company-total="dispatchCompanyTotal" :grand-total="dispatchGrandTotal" />
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
/* "Avtobuslarning holati" jadvalida ustunlar ko'p (11 ta) — o'rtadagi ustunga
   biroz ko'proq joy berilsa, gorizontal scroll chiqmasdan sig'adi. */
.row--3col-buses {
    grid-template-columns: 1fr 1.3fr 1fr;
}
.row--4col {
    grid-template-columns: repeat(4, 1fr);
    align-items: stretch;
}
/* "Tirbandlik ko'rsatkichlari" kartasi yer usti transporti rejimida yashiriladi
   (u tirbandlik bo'limiga tegishli) — bo'shagan joy birinchi kartaga (Yo'l
   harakati vaqti bo'yicha solishtirma) qo'shiladi, u ko'proq ustunga ega. */
.row--4col-wide1 {
    grid-template-columns: 2fr 1fr 1fr;
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
