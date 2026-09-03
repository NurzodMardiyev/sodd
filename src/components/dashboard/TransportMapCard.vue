<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { loadYandexMaps } from '@/composables/useYandexMaps';
import { METRO_LINES, METRO_TRANSFERS, findStation } from '@/data/tashkentMetro';

const props = defineProps({
    mode: { type: String, required: true }, // 'buses' | 'metro' | 'tirbandlik'
    selectedRoute: { type: String, default: null } // tanlangan marshrut nomi — bo'lsa, faqat shu marshrut chiziladi va xarita unga markazlashadi
});

// ---------------------------------------------------------------------------
// Avtobus marshrutlari — TAXMINIY/DEMO KOORDINATALAR, haqiqiy GPS/marshrut
// manbai ulanmaguncha rejimni ko'rgazmali ko'rsatish uchun. API ulanganda shu
// massivni tegishli service javobiga almashtirish kifoya.
// Metro yo'nalishlari esa haqiqiy — src/data/tashkentMetro.js (rasmiy sxema
// ranglari + real koordinatalar).
// ---------------------------------------------------------------------------
const TASHKENT_CENTER = [41.2995, 69.2401];
const DEFAULT_ZOOM = 12;

const BUS_ROUTES = [
    {
        name: '1 -son',
        color: '#2a78d6',
        stops: [
            [41.2646, 69.2163],
            [41.2758, 69.2288],
            [41.2872, 69.2405],
            [41.2995, 69.2401],
            [41.3123, 69.2701]
        ]
    },
    {
        name: '2 -son',
        color: '#9333ea',
        stops: [
            [41.2589, 69.2544],
            [41.2701, 69.2477],
            [41.2823, 69.2611],
            [41.2951, 69.2489],
            [41.3072, 69.2665]
        ]
    },
    {
        name: '4 -son',
        color: '#0891b2',
        stops: [
            [41.2751, 69.2977],
            [41.2861, 69.2812],
            [41.2872, 69.2405],
            [41.2905, 69.2185]
        ]
    },
    {
        name: '5 -son',
        color: '#65a30d',
        stops: [
            [41.3268, 69.2461],
            [41.3151, 69.2551],
            [41.2995, 69.2401],
            [41.2872, 69.2405],
            [41.2758, 69.2288]
        ]
    },
    {
        name: '7 -son',
        color: '#f59e0b',
        stops: [
            [41.3391, 69.2884],
            [41.3255, 69.2789],
            [41.3123, 69.2701],
            [41.2988, 69.2787]
        ]
    },
    {
        name: '8 -son',
        color: '#eb6834',
        stops: [
            [41.3352, 69.2029],
            [41.322, 69.222],
            [41.311, 69.2612],
            [41.2988, 69.2787],
            [41.2823, 69.2965]
        ]
    },
    {
        name: '12 -son',
        color: '#e11d48',
        stops: [
            [41.3123, 69.2701],
            [41.3072, 69.2665],
            [41.2951, 69.2489],
            [41.2823, 69.2611],
            [41.2751, 69.2977]
        ]
    },
    {
        name: '18 -son',
        color: '#1baf7a',
        stops: [
            [41.2751, 69.2977],
            [41.2861, 69.2812],
            [41.2995, 69.2401],
            [41.3151, 69.2318],
            [41.3268, 69.2461]
        ]
    }
];

const mapEl = ref(null);
let ymaps = null;
let map = null;
let objects = null;

// Bekat belgisi — rasmiy sxemadagi kabi: oq markaz + yo'nalish rangidagi halqa.
// Placemark uchun SVG data-URI (rang bo'yicha keshlanadi).
const STATION_ICON_SIZE = 14;
const stationIconCache = {};
function stationIcon(color) {
    if (!stationIconCache[color]) {
        const s = STATION_ICON_SIZE;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2 - 2}" fill="#fff" stroke="${color}" stroke-width="3"/></svg>`;
        stationIconCache[color] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }
    return stationIconCache[color];
}

// Metro hover tooltip: yo'nalish nomi (rang belgisi bilan); bekat ustida bo'lsa
// bekat nomi ham qo'shiladi. Chiziq ustida — faqat yo'nalish.
function metroHint(line, station) {
    const dot = `<span style="display:inline-block;width:.6em;height:.6em;border-radius:50%;background:${line.color};margin-right:.35em;vertical-align:middle"></span>`;
    const head = `<div style="font-weight:600">${dot}${line.name}</div>`;
    return station ? head + `<div style="margin-top:2px">Bekat: <b>${station.name}</b></div>` : head;
}

function drawBuses() {
    const routes = props.selectedRoute ? BUS_ROUTES.filter((r) => r.name === props.selectedRoute) : BUS_ROUTES;
    routes.forEach((route) => {
        objects.add(new ymaps.Polyline(route.stops, { hintContent: `${route.name} marshruti` }, { strokeColor: route.color, strokeWidth: props.selectedRoute ? 6 : 4, strokeOpacity: 0.9 }));
        route.stops.forEach((pt) => {
            objects.add(new ymaps.Placemark(pt, { hintContent: `${route.name} — bekat` }, { preset: 'islands#circleIcon', iconColor: route.color }));
        });
    });

    if (props.selectedRoute && routes.length) {
        const lats = routes[0].stops.map((s) => s[0]);
        const lngs = routes[0].stops.map((s) => s[1]);
        map.setBounds(
            [
                [Math.min(...lats), Math.min(...lngs)],
                [Math.max(...lats), Math.max(...lngs)]
            ],
            { checkZoomRange: true, zoomMargin: 40 }
        );
    } else {
        map.setCenter(TASHKENT_CENTER, DEFAULT_ZOOM);
    }
}

function drawMetro() {
    // O'tish bog'lovchilari — chiziqlar OSTIDA qolishi uchun avval chiziladi.
    METRO_TRANSFERS.forEach(([a, b]) => {
        const sa = findStation(a);
        const sb = findStation(b);
        if (!sa || !sb) return;
        objects.add(new ymaps.Polyline([sa.coords, sb.coords], { hintContent: `O'tish: ${a} ↔ ${b}` }, { strokeColor: '#64748b', strokeWidth: 3, strokeStyle: 'dash', strokeOpacity: 0.8 }));
    });
    // Yo'nalish chiziqlari (rasmiy sxema ranglari).
    METRO_LINES.forEach((line) => {
        objects.add(
            new ymaps.Polyline(
                line.stations.map((s) => s.coords),
                { hintContent: metroHint(line) },
                { strokeColor: line.color, strokeWidth: 5, strokeOpacity: 0.95, zIndex: 100 }
            )
        );
    });
    // Bekatlar — chiziqlar USTIDA.
    METRO_LINES.forEach((line) => {
        line.stations.forEach((s) => {
            objects.add(
                new ymaps.Placemark(
                    s.coords,
                    { hintContent: metroHint(line, s), balloonContentHeader: s.name, balloonContentBody: `<span style="color:${line.color};font-weight:600">${line.name}</span>` },
                    { iconLayout: 'default#image', iconImageHref: stationIcon(line.color), iconImageSize: [STATION_ICON_SIZE, STATION_ICON_SIZE], iconImageOffset: [-STATION_ICON_SIZE / 2, -STATION_ICON_SIZE / 2], zIndex: 200 }
                )
            );
        });
    });
}

function render() {
    if (!objects) return;
    objects.removeAll();
    if (props.mode === 'metro') {
        drawMetro();
        // Butun metro tarmog'i ko'rinadigan qilib masshtablash.
        map.setBounds(objects.getBounds(), { checkZoomRange: true, zoomMargin: 16 });
    } else {
        drawBuses(); // markazlash/masshtab drawBuses ichida (tanlangan marshrutga qarab)
    }
}

onMounted(async () => {
    ymaps = await loadYandexMaps();
    map = new ymaps.Map(mapEl.value, { center: TASHKENT_CENTER, zoom: DEFAULT_ZOOM, controls: ['zoomControl'] });
    objects = new ymaps.GeoObjectCollection();
    map.geoObjects.add(objects);
    render();
});

watch(() => [props.mode, props.selectedRoute], render);

const title = computed(() => {
    if (props.mode === 'metro') return 'Metro xaritasi';
    if (props.selectedRoute) return `${props.selectedRoute} marshruti yo'nalishi`;
    if (props.mode === 'tirbandlik') return "Ko'chalar va marshrutlar xaritasi";
    return "Avtobus yo'nalishlari xaritasi";
});

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
            <span>{{ title }}</span>
            <!-- Metro rejimida yo'nalishlar legendasi (rasmiy sxema ranglari) -->
            <div v-if="mode === 'metro'" class="map-legend">
                <span v-for="line in METRO_LINES" :key="line.id" class="map-legend-item" :title="line.name">
                    <i class="map-legend-dot" :style="{ background: line.color }"></i>
                    {{ line.name.replace(" yo'nalishi", '') }}
                </span>
            </div>
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
.map-legend {
    margin-left: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.75rem;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--lt-text-secondary, #6b7280);
}
.map-legend-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    white-space: nowrap;
}
.map-legend-dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    flex-shrink: 0;
}
.map-el {
    flex: 1;
    min-height: 0;
    border-radius: 10px;
    overflow: hidden;
}
</style>
