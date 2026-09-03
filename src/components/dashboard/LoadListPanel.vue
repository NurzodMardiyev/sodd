<script setup>
import { computed } from 'vue';
import PanelHeader from './PanelHeader.vue';

// Umumiy "yuklama ro'yxati" karta — chorraxalar va ko'chalar yuklamasi uchun
// bir xil ko'rinishda ishlatiladi (faqat sarlavha/matn va ma'lumotlar farqlanadi).
// YXTEM/svetofor sensorlaridan jonli (live) formatda keladigan 1-10 ballik
// tirbandlik ko'rsatkichi. Hozircha ma'lumotlar static — API ulanganda `rows`
// propi tegishli service javobiga almashtiriladi, kartaning o'zi va "Jonli"
// indikatori shu zahoti haqiqiy oqimga ishlay boshlaydi.
const props = defineProps({
    title: { type: String, required: true },
    icon: { type: String, default: 'pi pi-directions' },
    iconBg: { type: String, default: '#fee2e2' },
    iconColor: { type: String, default: '#dc2626' },
    rows: { type: Array, required: true }, // [{ name, score }] — score: 1-10 ball
    locationWord: { type: String, default: 'kesishmasida' } // ogohlantirish matnida: "... {locationWord} N ballik tirbandlik"
});

function level(score) {
    if (score >= 8) return 'critical';
    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
}
const LEVEL_COLOR = { critical: '#dc2626', high: '#ea580c', medium: '#d97706', low: '#16a34a' };
const LEVEL_LABEL = { critical: 'Yuqori', high: "Yuqori o'rtacha", medium: "O'rtacha", low: 'Past' };

const sortedRows = computed(() => [...props.rows].sort((a, b) => b.score - a.score).map((r) => ({ ...r, lvl: level(r.score) })));
const critical = computed(() => sortedRows.value.filter((r) => r.lvl === 'critical'));
</script>

<template>
    <section class="panel">
        <div class="header-row">
            <PanelHeader :icon="icon" :icon-bg="iconBg" :icon-color="iconColor" :title="title" />
            <span class="live-badge"><span class="live-dot"></span>Jonli</span>
        </div>

        <div v-if="critical.length" class="alert-banner">
            <i class="pi pi-exclamation-triangle"></i>
            <span v-for="(row, i) in critical" :key="row.name">
                <strong>{{ row.name }}</strong> {{ locationWord }} <strong>{{ row.score }} ballik</strong> tirbandlik aniqlandi!<template v-if="i < critical.length - 1"> </template>
            </span>
        </div>

        <div class="list">
            <div v-for="row in sortedRows" :key="row.name" class="row-item">
                <span class="dot" :style="{ background: LEVEL_COLOR[row.lvl] }"></span>
                <span class="name">{{ row.name }}</span>
                <span class="bar-track">
                    <span class="bar-fill" :style="{ width: row.score * 10 + '%', background: LEVEL_COLOR[row.lvl] }"></span>
                </span>
                <span class="score" :style="{ color: LEVEL_COLOR[row.lvl] }">{{ row.score }}</span>
                <span class="level-label" :style="{ color: LEVEL_COLOR[row.lvl] }">{{ LEVEL_LABEL[row.lvl] }}</span>
            </div>
        </div>
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
    overflow: hidden;
}
.header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.header-row :deep(.panel-header) {
    margin-bottom: 0;
}
.live-badge {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    font-weight: 700;
    color: #16a34a;
    background: #dcfce7;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    margin-bottom: 1rem;
}
.live-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #16a34a;
    animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.4;
        transform: scale(1.3);
    }
}
.alert-banner {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
    border-radius: 8px;
    padding: 0.55rem 0.7rem;
    font-size: 0.78rem;
    line-height: 1.4;
    margin-bottom: 0.8rem;
}
.alert-banner i {
    color: #dc2626;
    font-size: 0.9rem;
    margin-top: 0.1rem;
}
.list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
}
.row-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
}
.dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    flex-shrink: 0;
}
.name {
    flex: 1 1 auto;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--lt-text, #111827);
}
.bar-track {
    width: 4.5rem;
    flex-shrink: 0;
    height: 0.4rem;
    border-radius: 999px;
    background: var(--surface-hover, #f1f5f9);
    overflow: hidden;
}
.bar-fill {
    display: block;
    height: 100%;
    border-radius: 999px;
}
.score {
    width: 1.2rem;
    flex-shrink: 0;
    text-align: right;
    font-weight: 800;
}
.level-label {
    width: 6rem;
    flex-shrink: 0;
    text-align: right;
    font-size: 0.7rem;
    font-weight: 600;
}
</style>
