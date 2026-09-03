<script setup>
import { computed } from 'vue';
import PanelHeader from './PanelHeader.vue';

const props = defineProps({
    compareLabel1: { type: String, default: '' },
    compareLabel2: { type: String, default: '' },
    morningRows: { type: Array, required: true }, // [{ no, time, v1, v2, diff, pct }]
    eveningRows: { type: Array, required: true } // [{ no, time, v1, v2, diff, pct }] — v2/diff/pct null bo'lishi mumkin
});

function fmtNum(v) {
    return v === null || v === undefined ? '–' : v.toLocaleString('uz-UZ');
}

// Kun bo'yicha bitta chiziqli diagramma: ertalabki 5 nuqtada ikkala kun (v1/v2)
// taqqoslanadi, kechki 4 nuqtada faqat joriy kun (v2) ma'lumoti mavjud emas.
const points = computed(() => [...props.morningRows, ...props.eveningRows]);

const VB_W = 640;
const VB_H = 200;
const PAD_L = 46;
const PAD_R = 12;
const PAD_T = 14;
const PAD_B = 28;
const plotW = VB_W - PAD_L - PAD_R;
const plotH = VB_H - PAD_T - PAD_B;

const maxVal = computed(() => Math.max(1, ...points.value.flatMap((p) => [p.v1 ?? 0, p.v2 ?? 0])));

const xAt = (i) => PAD_L + (points.value.length > 1 ? (i / (points.value.length - 1)) * plotW : plotW / 2);
const yAt = (v) => PAD_T + plotH - (v / maxVal.value) * plotH;

const path = (key) => {
    let d = '';
    points.value.forEach((p, i) => {
        const v = p[key];
        if (v === null || v === undefined) return;
        const cmd = d ? 'L' : 'M';
        d += `${cmd}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)} `;
    });
    return d.trim();
};
const path1 = computed(() => path('v1'));
const path2 = computed(() => path('v2'));

const dots1 = computed(() => points.value.map((p, i) => ({ x: xAt(i), y: yAt(p.v1 ?? 0), v: p.v1, time: p.time })).filter((d) => d.v !== null && d.v !== undefined));
const dots2 = computed(() => points.value.map((p, i) => ({ x: xAt(i), y: yAt(p.v2 ?? 0), v: p.v2, time: p.time })).filter((d) => d.v !== null && d.v !== undefined));

const yTicks = computed(() => {
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => {
        const v = Math.round((maxVal.value / steps) * i);
        return { v, y: yAt(v) };
    });
});
</script>

<template>
    <section class="panel">
        <PanelHeader icon="pi pi-chart-line" icon-bg="#dbeafe" icon-color="#2563eb" title="2. Kunlik yo'l harakati intensivligi" />

        <div class="legend">
            <span class="legend-item"><span class="legend-line legend-line--1"></span>{{ compareLabel1 || '1-kun' }}</span>
            <span class="legend-item"><span class="legend-line legend-line--2"></span>{{ compareLabel2 || '2-kun' }}</span>
        </div>

        <div class="chart-wrap">
            <svg :viewBox="`0 0 ${VB_W} ${VB_H}`" class="chart-svg" preserveAspectRatio="none">
                <line v-for="t in yTicks" :key="t.v" :x1="PAD_L" :x2="VB_W - PAD_R" :y1="t.y" :y2="t.y" class="gridline" />
                <text v-for="t in yTicks" :key="'lbl' + t.v" :x="PAD_L - 8" :y="t.y + 3" class="ytick">{{ fmtNum(t.v) }}</text>

                <path :d="path1" class="line line--1" fill="none" />
                <path :d="path2" class="line line--2" fill="none" />

                <g v-for="(d, i) in dots1" :key="'d1' + i">
                    <circle :cx="d.x" :cy="d.y" r="4" class="dot dot--1">
                        <title>{{ d.time }} — {{ compareLabel1 || '1-kun' }}: {{ fmtNum(d.v) }}</title>
                    </circle>
                </g>
                <g v-for="(d, i) in dots2" :key="'d2' + i">
                    <circle :cx="d.x" :cy="d.y" r="4" class="dot dot--2">
                        <title>{{ d.time }} — {{ compareLabel2 || '2-kun' }}: {{ fmtNum(d.v) }}</title>
                    </circle>
                </g>

                <text v-for="(p, i) in points" :key="'x' + i" :x="xAt(i)" :y="VB_H - 8" class="xtick" text-anchor="middle">{{ p.time.split('-')[0] }}</text>
            </svg>
        </div>
    </section>
</template>

<style scoped>
.panel {
    --chart-series-1: #2a78d6;
    --chart-series-2: #eb6834;
    border-radius: 12px;
    border: 1px solid var(--lt-border, #e5e7eb);
    background: var(--lt-card, #fff);
    padding: 1.2rem 1.3rem;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
:global(.app-dark) .panel {
    --chart-series-1: #3987e5;
    --chart-series-2: #d95926;
}
.legend {
    flex-shrink: 0;
    display: flex;
    gap: 1rem;
    margin: 0.7rem 0 0.6rem;
}
.legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    color: var(--lt-text-secondary, #6b7280);
}
.legend-line {
    width: 0.9rem;
    height: 2px;
    border-radius: 2px;
}
.legend-line--1 {
    background: var(--chart-series-1);
}
.legend-line--2 {
    background: var(--chart-series-2);
}
.chart-wrap {
    width: 100%;
    flex: 1;
    min-height: 0;
}
.chart-svg {
    width: 100%;
    height: 100%;
    min-height: 8rem;
    overflow: visible;
}
.gridline {
    stroke: var(--lt-border, #e5e7eb);
    stroke-width: 1;
}
.ytick {
    font-size: 8px;
    fill: var(--lt-text-secondary, #9ca3af);
    text-anchor: end;
}
.xtick {
    font-size: 8px;
    fill: var(--lt-text-secondary, #9ca3af);
}
.line {
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}
.line--1 {
    stroke: var(--chart-series-1);
}
.line--2 {
    stroke: var(--chart-series-2);
    stroke-dasharray: 5 4;
}
.dot {
    stroke: var(--lt-card, #fff);
    stroke-width: 1.5;
}
.dot--1 {
    fill: var(--chart-series-1);
}
.dot--2 {
    fill: var(--chart-series-2);
}
</style>
