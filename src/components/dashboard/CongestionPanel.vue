<script setup>
import { computed } from 'vue';
import PanelHeader from './PanelHeader.vue';

const props = defineProps({
    crossroads: { type: Number, required: true },
    ypxStaff: { type: Number, required: true },
    detectedCongestion: { type: Number, required: true },
    segments: { type: Array, required: true }, // [{ label, value, color }]
    total: { type: Number, required: true },
    legendTitle: { type: String, default: 'Svetoforlar' }
});
const emit = defineEmits(['view-details']);

const sum = computed(() => props.segments.reduce((s, x) => s + x.value, 0) || 1);
const RADIUS = 40;
const CIRC = 2 * Math.PI * RADIUS;
const arcs = computed(() => {
    let offset = 0;
    return props.segments.map((seg) => {
        const pct = seg.value / sum.value;
        const dash = pct * CIRC;
        const arc = { ...seg, dasharray: `${dash} ${CIRC - dash}`, dashoffset: -offset };
        offset += dash;
        return arc;
    });
});
</script>

<template>
    <section class="panel">
        <PanelHeader icon="pi pi-car" icon-bg="#ede9fe" icon-color="#7c3aed" title="3. Tirbandlik ko'rsatkichlari" />

        <div class="body">
            <div class="stats-col">
                <div class="stat-box">
                    <div class="stat-label">Chorraqlar (dona)</div>
                    <div class="stat-value">{{ crossroads }}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Jalb etilgan YPX xodimlari (dona)</div>
                    <div class="stat-value">{{ ypxStaff }}</div>
                </div>
                <div class="stat-box stat-box--accent">
                    <div class="stat-label">YXTEM aniqlagan tirbandliklar</div>
                    <div class="stat-value">{{ detectedCongestion }}</div>
                </div>
            </div>

            <div class="donut-col">
                <div class="donut-wrap">
                    <svg viewBox="0 0 100 100" class="donut-svg">
                        <circle v-for="(arc, i) in arcs" :key="i" cx="50" cy="50" r="40" fill="none" :stroke="arc.color" stroke-width="15" :stroke-dasharray="arc.dasharray" :stroke-dashoffset="arc.dashoffset" transform="rotate(-90 50 50)" />
                    </svg>
                    <div class="donut-center">
                        <div class="donut-total">{{ total }}</div>
                        <div class="donut-total-label">Jami</div>
                    </div>
                </div>

                <div class="legend">
                    <div class="legend-title">{{ legendTitle }}</div>
                    <div v-for="seg in segments" :key="seg.label" class="legend-row">
                        <span class="legend-dot" :style="{ background: seg.color }"></span>
                        <span class="legend-label">{{ seg.label }}</span>
                        <span class="legend-value">{{ seg.value }}</span>
                    </div>
                </div>
            </div>
        </div>

        <a href="#" class="footer-link" @click.prevent="emit('view-details')">
            Batafsil ma'lumot <i class="pi pi-arrow-right"></i>
        </a>
    </section>
</template>

<style scoped>
.panel {
    border-radius: 12px;
    border: 1px solid var(--lt-border, #e5e7eb);
    background: var(--lt-card, #fff);
    padding: 1.2rem 1.3rem;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
.body {
    display: flex;
    gap: 1rem;
    flex: 1;
    min-height: 0;
}
.stats-col {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    width: 40%;
    flex-shrink: 0;
}
.stat-box {
    padding: 0.8rem;
    border-radius: 10px;
    background: var(--surface-hover, #f9fafb);
    border: 1px solid var(--lt-border, #e5e7eb);
}
.stat-label {
    font-size: 0.72rem;
    color: var(--lt-text-secondary, #6b7280);
}
.stat-value {
    margin-top: 0.2rem;
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--lt-text, #111827);
}
.stat-box--accent {
    background: #fff59d;
    border-color: #eab308;
}
.stat-box--accent .stat-label {
    color: #78716c;
}
.stat-box--accent .stat-value {
    color: #111827;
}
.donut-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.7rem;
}
.donut-wrap {
    position: relative;
    width: 7.5rem;
    height: 7.5rem;
}
.donut-svg {
    width: 100%;
    height: 100%;
}
.donut-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.donut-total {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--lt-text, #111827);
}
.donut-total-label {
    font-size: 0.62rem;
    color: var(--lt-text-secondary, #6b7280);
}
.legend {
    width: 100%;
}
.legend-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--lt-text, #111827);
    text-align: center;
    margin-bottom: 0.4rem;
}
.legend-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    padding: 0.15rem 0;
}
.legend-dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 2px;
    flex-shrink: 0;
}
.legend-label {
    flex: 1;
    color: var(--lt-text, #111827);
}
.legend-value {
    font-weight: 700;
    color: var(--lt-text, #111827);
}
.footer-link {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.9rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #2563eb;
    text-decoration: none;
}
.footer-link i {
    font-size: 0.65rem;
}
</style>
