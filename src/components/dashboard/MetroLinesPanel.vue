<script setup>
import { computed, ref } from 'vue';

// Metro yo'nalishlari — "metro" rejimida RouteBusTablePanel o'rniga chiqadi
// (Dashboard.vue). Har bir yo'nalish: rang, bekatlar soni, umumiy sig'im;
// ochilganda bekatlar ro'yxati va har bir bekat sig'imi.
const props = defineProps({
    title: { type: String, default: "Metro yo'nalishlari (bekatlar bo'yicha)" },
    lines: { type: Array, required: true } // [{ id, name, color, stations: [{ name, capacity }] }]
});

// Dastlab barchasi yig'iq — 4 yo'nalish sarlavhasi bir vaqtda ko'rinadi.
const openId = ref(null);
function toggle(id) {
    openId.value = openId.value === id ? null : id;
}

const fmt = (n) => (n == null ? '–' : new Intl.NumberFormat('ru-RU').format(n));

const rows = computed(() =>
    props.lines.map((line) => ({
        ...line,
        stationCount: line.stations.length,
        capacity: line.stations.reduce((sum, s) => sum + (s.capacity ?? 0), 0)
    }))
);
const totals = computed(() => ({
    stations: rows.value.reduce((a, l) => a + l.stationCount, 0),
    capacity: rows.value.reduce((a, l) => a + l.capacity, 0)
}));
</script>

<template>
    <section class="panel">
        <h2 class="title">{{ title }}</h2>

        <div class="lines">
            <div v-for="line in rows" :key="line.id" class="line" :class="{ 'line--open': openId === line.id }">
                <button type="button" class="line-head" @click="toggle(line.id)">
                    <span class="line-dot" :style="{ background: line.color }"></span>
                    <span class="line-name">{{ line.name }}</span>
                    <span class="line-stat"
                        ><b>{{ line.stationCount }}</b> bekat</span
                    >
                    <span class="line-stat"
                        ><b>{{ fmt(line.capacity) }}</b> sig'im</span
                    >
                    <i class="pi pi-chevron-down line-chevron"></i>
                </button>

                <div v-if="openId === line.id" class="line-body">
                    <table>
                        <thead>
                            <tr>
                                <th class="th-num">№</th>
                                <th class="th-name">Bekat</th>
                                <th class="th-cap">Sig'im</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(st, i) in line.stations" :key="st.name">
                                <td class="td-num">{{ i + 1 }}</td>
                                <td class="td-name">
                                    <span class="st-ring" :style="{ borderColor: line.color }"></span>
                                    {{ st.name }}
                                </td>
                                <td class="td-cap">{{ fmt(st.capacity) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="footer">
            <span>JAMI:</span>
            <span
                ><b>{{ totals.stations }}</b> bekat</span
            >
            <span
                ><b>{{ fmt(totals.capacity) }}</b> sig'im</span
            >
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
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.title {
    flex-shrink: 0;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--lt-text, #111827);
    margin-bottom: 0.9rem;
}
.lines {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    scrollbar-width: thin;
}

.line {
    flex-shrink: 0; /* ro'yxat scroll bo'lsin, sarlavhalar siqilmasin */
    border: 1px solid var(--lt-border, #e5e7eb);
    border-radius: 10px;
    overflow: hidden;
}
.line-head {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.75rem;
    border: none;
    background: #f8fafc;
    color: var(--lt-text, #111827);
    font-size: 0.85rem;
    cursor: pointer;
    text-align: left;
}
.line--open .line-head {
    background: #f1f5f9;
}
.line-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    flex-shrink: 0;
}
.line-name {
    flex: 1;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.line-stat {
    color: var(--lt-text-secondary, #6b7280);
    white-space: nowrap;
    font-size: 0.8rem;
}
.line-stat b {
    color: var(--lt-text, #111827);
}
.line-chevron {
    font-size: 0.65rem;
    color: #94a3b8;
    transition: transform 0.18s;
}
.line--open .line-chevron {
    transform: rotate(180deg);
}

.line-body table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
}
.line-body th {
    font-weight: 600;
    color: var(--lt-text-secondary, #6b7280);
    padding: 0.35rem 0.75rem;
    border-bottom: 1px solid var(--lt-border, #e5e7eb);
    text-align: left;
}
.line-body td {
    padding: 0.32rem 0.75rem;
    border-bottom: 1px solid var(--lt-border, #f1f5f9);
}
.line-body tr:last-child td {
    border-bottom: none;
}
.th-num,
.td-num {
    width: 2rem;
    color: var(--lt-text-secondary, #9ca3af);
}
.td-name {
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.45rem;
}
.st-ring {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    border: 2px solid;
    background: #fff;
    flex-shrink: 0;
}
.th-cap,
.td-cap {
    text-align: right;
    font-weight: 700;
    white-space: nowrap;
}
.th-cap {
    font-weight: 600;
}

.footer {
    flex-shrink: 0;
    display: flex;
    gap: 1rem;
    margin-top: 0.7rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    background: #f1f5f9;
    font-size: 0.85rem;
    font-weight: 700;
    color: #1f2937;
}
.footer span:not(:first-child) {
    font-weight: 500;
}
</style>
