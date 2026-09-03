<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { loadYandexMaps } from '@/composables/useYandexMaps';

const props = defineProps({
    mode: { type: String, required: true } // 'buses' | 'metro'
});

// ---------------------------------------------------------------------------
// TAXMINIY/DEMO KOORDINATALAR — haqiqiy GPS/marshrut manbai ulanmaguncha,
// xaritada faqat rejimni ko'rgazmali ko'rsatish uchun. API ulanganda shu
// massivlarni tegishli service javobiga almashtirish kifoya.
// ---------------------------------------------------------------------------
const TASHKENT_CENTER = [41.2995, 69.2401];

const BUS_ROUTES = [
    { name: '1-son', color: '#2a78d6', stops: [[41.2646, 69.2163], [41.2758, 69.2288], [41.2872, 69.2405], [41.2995, 69.2401], [41.3123, 69.2701]] },
    { name: '8-son', color: '#eb6834', stops: [[41.3352, 69.2029], [41.322, 69.222], [41.311, 69.2612], [41.2988, 69.2787], [41.2823, 69.2965]] },
    { name: '18-son', color: '#1baf7a', stops: [[41.2751, 69.2977], [41.2861, 69.2812], [41.2995, 69.2401], [41.3151, 69.2318], [41.3268, 69.2461]] }
];

const METRO_LINES = [
    { name: "Chilonzor yo'nalishi", color: '#e34948', stations: [[41.2646, 69.2163], [41.2812, 69.2311], [41.2951, 69.2489], [41.3072, 69.2665], [41.3123, 69.2701]] },
    { name: "O'zbekiston yo'nalishi", color: '#2a78d6', stations: [[41.3268, 69.2461], [41.3151, 69.2551], [41.3123, 69.2701], [41.303, 69.2839], [41.2909, 69.2951]] },
    { name: "Yunusobod yo'nalishi", color: '#1baf7a', stations: [[41.3123, 69.2701], [41.3255, 69.2789], [41.3391, 69.2884], [41.3512, 69.2971]] },
    { name: "Yer usti xalqa yo'nalishi", color: '#eda100', stations: [[41.2988, 69.2787], [41.3123, 69.2701], [41.3072, 69.2665], [41.2951, 69.2489], [41.2823, 69.2611], [41.2909, 69.2951], [41.2988, 69.2787]] }
];

const mapEl = ref(null);
let ymaps = null;
let map = null;
let objects = null;

function drawBuses() {
    BUS_ROUTES.forEach((route) => {
        objects.add(new ymaps.Polyline(route.stops, { hintContent: `${route.name} marshruti` }, { strokeColor: route.color, strokeWidth: 4, strokeOpacity: 0.85 }));
        route.stops.forEach((pt) => {
            objects.add(new ymaps.Placemark(pt, { hintContent: `${route.name} — bekat` }, { preset: 'islands#circleIcon', iconColor: route.color }));
        });
    });
}

function drawMetro() {
    METRO_LINES.forEach((line) => {
        objects.add(new ymaps.Polyline(line.stations, { hintContent: line.name }, { strokeColor: line.color, strokeWidth: 5, strokeOpacity: 0.9 }));
        line.stations.forEach((pt) => {
            objects.add(new ymaps.Placemark(pt, { hintContent: line.name }, { preset: 'islands#circleIcon', iconColor: line.color }));
        });
    });
}

function render() {
    if (!objects) return;
    objects.removeAll();
    if (props.mode === 'metro') drawMetro();
    else drawBuses();
}

onMounted(async () => {
    ymaps = await loadYandexMaps();
    map = new ymaps.Map(mapEl.value, { center: TASHKENT_CENTER, zoom: 12, controls: ['zoomControl'] });
    objects = new ymaps.GeoObjectCollection();
    map.geoObjects.add(objects);
    render();
});

watch(() => props.mode, render);

onBeforeUnmount(() => {
    if (map) {
        map.destroy();
        map = null;
    }
});
</script>

<template>
    <section class="panel map-panel">
        <div class="map-title">
            <i class="pi pi-map"></i>
            <span>{{ mode === 'metro' ? 'Metro xaritasi' : 'Avtobus yo’nalishlari xaritasi' }}</span>
        </div>
        <div ref="mapEl" class="map-el"></div>
    </section>
</template>

<style scoped>
.panel {
    border-radius: 12px;
    border: 1px solid var(--lt-border, #e5e7eb);
    background: var(--lt-card, #fff);
    padding: 1rem;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
}
.map-title {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--lt-text, #111827);
    margin-bottom: 0.75rem;
}
.map-el {
    flex: 1;
    min-height: 0;
    border-radius: 10px;
    overflow: hidden;
}
</style>
