<script setup>
import { computed } from 'vue';
import PanelHeader from './PanelHeader.vue';

const props = defineProps({
    dateNote: { type: String, default: '' },
    rows: { type: Array, required: true }, // [{ no, name, kirdi, chiqdi, highlight }]
    total: { type: Object, required: true } // { kirdi, chiqdi }
});

function fmtNum(v) {
    return v === null || v === undefined ? '–' : v.toLocaleString('uz-UZ');
}

// Gorizontal guruhlangan ustunli diagramma — 12 ta post nomi vertikal o'qda,
// shu bois vertikal ustunlardan ko'ra bu yerda o'qilishi osonroq.
const ROW_H = 30;
const GAP = 10;
const CHART_H = computed(() => props.rows.length * (ROW_H + GAP));
const maxValue = computed(() => Math.max(1, ...props.rows.flatMap((r) => [r.kirdi || 0, r.chiqdi || 0])));
const barWidth = (v) => `${((v || 0) / maxValue.value) * 100}%`;
</script>

<template>
    <section class="panel">
        <div class="header-row">
            <PanelHeader icon="pi pi-map-marker" icon-bg="#ede9fe" icon-color="#7c3aed" title="Shahar chegara postlaridan transport oqimi" />
            <span v-if="dateNote" class="date-note">{{ dateNote }}</span>
        </div>

        <div class="legend">
            <span class="legend-item"><span class="legend-dot legend-dot--kirdi"></span>Kirdi</span>
            <span class="legend-item"><span class="legend-dot legend-dot--chiqdi"></span>Chiqdi</span>
        </div>

        <div class="chart-scroll">
            <div class="chart" :style="{ height: CHART_H + 'px' }">
                <div v-for="row in rows" :key="row.no" class="chart-row" :style="{ height: ROW_H * 2 + 'px', marginBottom: GAP + 'px' }">
                    <div class="row-label" :class="{ 'row-label--highlight': row.highlight }">{{ row.name }}</div>
                    <div class="row-bars">
                        <div class="bar-track">
                            <div class="bar bar--kirdi" :style="{ width: barWidth(row.kirdi) }">
                                <title>{{ row.name }} — Kirdi: {{ fmtNum(row.kirdi) }}</title>
                            </div>
                            <span class="bar-value">{{ fmtNum(row.kirdi) }}</span>
                        </div>
                        <div class="bar-track">
                            <div class="bar bar--chiqdi" :style="{ width: barWidth(row.chiqdi) }">
                                <title>{{ row.name }} — Chiqdi: {{ fmtNum(row.chiqdi) }}</title>
                            </div>
                            <span class="bar-value">{{ fmtNum(row.chiqdi) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="total-row">
            <span>Jami:</span>
            <span class="total-value"><span class="dot dot--kirdi"></span>Kirdi {{ fmtNum(total.kirdi) }}</span>
            <span class="total-value"><span class="dot dot--chiqdi"></span>Chiqdi {{ fmtNum(total.chiqdi) }}</span>
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
.header-row {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
}
.date-note {
    font-size: 0.78rem;
    color: var(--lt-text-secondary, #6b7280);
    white-space: nowrap;
    margin-top: 0.15rem;
}
.legend {
    flex-shrink: 0;
    display: flex;
    gap: 1rem;
    margin: 0.7rem 0 0.9rem;
}
.legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    color: var(--lt-text-secondary, #6b7280);
}
.legend-dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 3px;
}
.legend-dot--kirdi {
    background: var(--chart-series-1);
}
.legend-dot--chiqdi {
    background: var(--chart-series-2);
}
.chart-scroll {
    flex: 1;
    min-height: 0;
    overflow: auto;
}
.chart-row {
    display: grid;
    grid-template-columns: 8rem 1fr;
    align-items: center;
    gap: 0.6rem;
}
.row-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--lt-text, #111827);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.row-label--highlight {
    color: #dc2626;
}
.row-bars {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 14rem;
}
.bar-track {
    position: relative;
    height: 13px;
    background: var(--surface-hover, #f1f5f9);
    border-radius: 4px;
    display: flex;
    align-items: center;
}
.bar {
    height: 100%;
    border-radius: 4px;
    min-width: 4px;
    transition: width 0.4s ease;
}
.bar--kirdi {
    background: var(--chart-series-1);
}
.bar--chiqdi {
    background: var(--chart-series-2);
}
.bar-value {
    margin-left: 0.4rem;
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--lt-text-secondary, #6b7280);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}
.total-row {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    margin-top: 1rem;
    padding-top: 0.8rem;
    border-top: 1px solid var(--lt-border, #e5e7eb);
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--lt-text, #111827);
}
.total-value {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-variant-numeric: tabular-nums;
}
.dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
}
.dot--kirdi {
    background: var(--chart-series-1);
}
.dot--chiqdi {
    background: var(--chart-series-2);
}
</style>
