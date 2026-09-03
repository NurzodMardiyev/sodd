<script setup>
import { computed, ref } from 'vue';
import { METRO_LINES } from '@/data/tashkentMetro';
import KpiCardSimple from '@/components/dashboard/KpiCardSimple.vue';
import DistrictFilterBar from '@/components/dashboard/DistrictFilterBar.vue';
import TransportMapCard from '@/components/dashboard/TransportMapCard.vue';
import RouteBusTablePanel from '@/components/dashboard/RouteBusTablePanel.vue';
import LoadListPanel from '@/components/dashboard/LoadListPanel.vue';
import RoutesStreetsPanel from '@/components/dashboard/RoutesStreetsPanel.vue';
import MetroLinesPanel from '@/components/dashboard/MetroLinesPanel.vue';
import MetroLineDetailPanel from '@/components/dashboard/MetroLineDetailPanel.vue';
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
const districts = ['Barchasi', 'Uchtepa', 'Yunusobod', "Mirzo Ulug'bek", 'Mirobod', 'Shayhontohur', 'Chilonzor', 'Yangi hayot', 'Yashnobod', 'Bektemir', 'Olmazor', 'Sergeli', 'Yakkasaroy'];
const activeDistrict = ref('Barchasi');

// ---------------------------------------------------------------------------
// STATIK DEMO MA'LUMOTLARI - "MA'LUMOTNOMA (03.09.2026 yil soat 09.00 holatiga)"
// hujjatidagi BARCHA ma'lumotlar shu yerda, hech narsa tashlab ketilmagan.
// API ulanganda har bir massivni tegishli service javobiga almashtirish kifoya.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// METRO — bekatlar sig'imi. Hozircha ma'lumot YO'Q — barcha bekatlar 0.
// Rasmiy raqamlar kelganda shu obyektga bekat nomi (src/data/tashkentMetro.js
// bilan bir xil) => sig'im ko'rinishida yoziladi; yozilmagan bekat 0 qoladi.
// ---------------------------------------------------------------------------
const metroStationCapacity = {};
const metroLines = computed(() => METRO_LINES.map((line) => ({ ...line, stations: line.stations.map((s) => ({ ...s, capacity: metroStationCapacity[s.name] ?? 0 })) })));

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
            { label: 'Yer osti', value: '123' }
        ]
        // turlari hozircha yo'q — subStats keyinroq qo'shiladi
    },
    {
        icon: 'pi pi-graduation-cap',
        iconBg: '#ccfbf1',
        iconColor: '#0d9488',
        label: "Ta'lim",
        value: '416',
        subStats: [
            { label: 'OTM', value: '95' },
            { label: 'Maktablar', value: '328' },
            { label: "Bog'chalar", value: '0' }
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
    { name: 'Yunusobod — Nihol', score: 2 }
];

// Metro rejimida shu panel "Stansiyalar yuklamasi" bo'lib chiqadi (1-10 ball).
// Hozircha static demo — API ulanganda almashtiriladi. Bo'sh massiv bo'lsa
// panel "Ma'lumot yig'ilmoqda" ko'rsatadi.
const stationLoadRows = [
    { name: 'Chilonzor', score: 9 },
    { name: 'Beruniy', score: 8 },
    { name: 'Alisher Navoiy', score: 8 },
    { name: 'Paxtakor', score: 7 },
    { name: "Buyuk ipak yo'li", score: 7 },
    // Eng kam yuklangan bekatlar
    { name: 'Turkiston', score: 2 },
    { name: 'Tuzel', score: 2 },
    { name: 'Chinor', score: 1 }
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
    { name: '1 -son', streets: ["Bunyodkor ko'chasi", "Amir Temur shoh ko'chasi", "Yunusobod ko'chasi"], asfaltBor: 3, asfaltYoq: 0 },
    { name: '2 -son', streets: ["Farhod ko'chasi", "Lutfiy ko'chasi"], asfaltBor: 1, asfaltYoq: 1 },
    { name: '4 -son', streets: ["Chilonzor ko'chasi", "Bog'ishamol ko'chasi"], asfaltBor: 2, asfaltYoq: 0 },
    { name: '5 -son', streets: ["Mustaqillik shoh ko'chasi", "Navoiy ko'chasi", "Shota Rustaveli ko'chasi"], asfaltBor: 2, asfaltYoq: 1 },
    { name: '7 -son', streets: ["Katta halqa yo'li"], asfaltBor: 0, asfaltYoq: 1 },
    { name: '8 -son', streets: ["Bunyodkor ko'chasi", "Mirzo Ulug'bek ko'chasi", "Amir Temur shoh ko'chasi"], asfaltBor: 3, asfaltYoq: 0 },
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

// Metro — yo'lovchilar oqimi solishtirmasi (02.09 va 03.09, soatlar bo'yicha).
// 03.09 uchun 17.00 dan keyingi soatlar hali kelmagan — null (jadvalda '–').
const metroPassengerDiffRows = [
    { hourLabel: '05.00-06.00', day2: 6523, day3: 4751, diff: -1772 },
    { hourLabel: '06.00-07.00', day2: 21481, day3: 15796, diff: -5685 },
    { hourLabel: '07.00-08.00', day2: 53692, day3: 47516, diff: -6176 },
    { hourLabel: '08.00-09.00', day2: 64278, day3: 62404, diff: -1874 },
    { hourLabel: '09.00-10.00', day2: 45797, day3: 41732, diff: -4065 },
    { hourLabel: '10.00-11.00', day2: 36647, day3: 32415, diff: -4232 },
    { hourLabel: '16.00-17.00', day2: 32692, day3: 30059, diff: -2633 },
    { hourLabel: '17.00-18.00', day2: 41627, day3: null, diff: null },
    { hourLabel: '18.00-19.00', day2: 52443, day3: null, diff: null },
    { hourLabel: '19.00-20.00', day2: 35894, day3: null, diff: null }
];
const metroPassengerDiffTotals = { day2: 391074, day3: 234673, diff: null };

// Yuklamasi eng yuqori yo'nalish — Chilonzor yo'nalishi bo'yicha soatlik
// ma'lumot (interval, harakat tarkibi, reja sig'imi, 02.09 va 03.09 tashilgan).
// 03.09 uchun 17.00 dan keyingi soatlar hali kelmagan — null.
const chilonzorLineRows = [
    { hourLabel: '05.00-06.00', intervalMin: 12, trains: 7, capacity: 7000, day2: 2322, day3: 1988 },
    { hourLabel: '06.00-07.00', intervalMin: 5, trains: 11, capacity: 16100, day2: 8479, day3: 7046 },
    { hourLabel: '07.00-08.00', intervalMin: 2.7, trains: 27, capacity: 28980, day2: 20165, day3: 20833 },
    { hourLabel: '08.00-09.00', intervalMin: 2.5, trains: 28, capacity: 33600, day2: 24322, day3: 26323 },
    { hourLabel: '09.00-10.00', intervalMin: 3, trains: 26, capacity: 29400, day2: 15746, day3: 17230 },
    { hourLabel: '10.00-11.00', intervalMin: 5, trains: 15, capacity: 16800, day2: 12992, day3: 13335 },
    { hourLabel: '11.00-12.00', intervalMin: 4.8, trains: 16, capacity: 17150, day2: 13486, day3: 13347 },
    { hourLabel: '12.00-13.00', intervalMin: 4.5, trains: 18, capacity: 18620, day2: 14638, day3: 15645 },
    { hourLabel: '13.00-14.00', intervalMin: 4.5, trains: 18, capacity: 18620, day2: 15319, day3: 16911 },
    { hourLabel: '14.00-15.00', intervalMin: 4.5, trains: 18, capacity: 18620, day2: 14166, day3: 15208 },
    { hourLabel: '15.00-16.00', intervalMin: 4.5, trains: 18, capacity: 18620, day2: 14689, day3: 15322 },
    { hourLabel: '16.00-17.00', intervalMin: 3, trains: 26, capacity: 28000, day2: 16350, day3: 15037 },
    { hourLabel: '17.00-18.00', intervalMin: 3, trains: 26, capacity: 28000, day2: 5219, day3: null },
    { hourLabel: '18.00-19.00', intervalMin: 3, trains: 26, capacity: 28000, day2: 26226, day3: null },
    { hourLabel: '19.00-20.00', intervalMin: 3.5, trains: 22, capacity: 23380, day2: 17951, day3: null },
    { hourLabel: '20.00-21.00', intervalMin: 4.5, trains: 17, capacity: 18900, day2: 13425, day3: null },
    { hourLabel: '21.00-22.00', intervalMin: 5.5, trains: 14, capacity: 15400, day2: 8868, day3: null },
    { hourLabel: '22.00-23.00', intervalMin: 7, trains: 12, capacity: 12250, day2: 6683, day3: null },
    { hourLabel: '23.00-00.00', intervalMin: 10.5, trains: 8, capacity: 7980, day2: 5285, day3: null }
];
const chilonzorLineTotals = { capacity: 385420, day2: 256331, day3: 178225 };

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
            <!-- Metro rejimida avtobus jadvali o'rniga yo'nalishlar/bekatlar paneli, chorraxalar o'rniga stansiyalar yuklamasi -->
            <template v-else-if="activeView === 'metro'">
                <MetroLinesPanel :lines="metroLines" />
                <LoadListPanel title="Stansiyalar yuklamasi" location-word="bekatida" :show-alert="false" :rows="stationLoadRows" />
            </template>
            <template v-else>
                <RouteBusTablePanel :rows="busStatusRows" />
                <RoutesStreetsPanel :rows="routesStreetsRows" :selected="selectedRoute" @select="selectRoute" />
            </template>
        </div>

        <div class="row row--4col" :class="{ 'row--4col-wide1': activeView === 'buses' }">
            <PassengerDiffPanel v-if="activeView === 'metro'" :rows="metroPassengerDiffRows" :totals="metroPassengerDiffTotals" label2="2-sentyabr" label3="3-sentyabr" />
            <TrafficTimeTablePanel v-else compare-label1="sentyabr (02.09.2026 chorshanba)" compare-label2="sentyabr (03.09.2026 payshanba)" :morning-rows="trafficMorningRows" :evening-rows="trafficEveningRows" />
            <!-- Metro rejimida tirbandlik + dispetcher kartalari o'rniga bitta keng karta (2 ustun) -->
            <MetroLineDetailPanel v-if="activeView === 'metro'" class="span-2" title="Yuklamasi eng yuqori yo'nalish" subtitle="Chilonzor yo'nalishi" line-color="#E53E3E" :rows="chilonzorLineRows" :totals="chilonzorLineTotals" />
            <template v-else>
                <CongestionPanel v-if="activeView !== 'buses'" v-bind="congestion" />
                <CityEntryTransportPanel v-if="activeView === 'tirbandlik'" date-note="02 sentyabr holatiga" :rows="cityEntryRows" :total="cityEntryTotal" />
                <RouteDispatchPanel v-else :main-rows="dispatchMainRows" :main-total="dispatchMainTotal" :company-rows="dispatchCompanyRows" :company-total="dispatchCompanyTotal" :grand-total="dispatchGrandTotal" />
            </template>
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
/* Ikki ustunni egallaydigan karta (metro rejimidagi yo'nalish jadvali) */
.row--4col .span-2 {
    grid-column: span 2;
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
    .row--4col .span-2 {
        grid-column: auto;
    }
}
@media (max-width: 700px) {
    .kpi-row {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
