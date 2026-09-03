<script setup>
import PanelHeader from './PanelHeader.vue';

defineProps({
    rows: { type: Array, required: true } // [{ time, current, previous, diff, pct }] — diff/pct null bo'lishi mumkin
});
const emit = defineEmits(['view-full']);

function cls(v) {
    if (v === null || v === undefined) return 'cell-muted';
    if (v > 0) return 'diff--up';
    if (v < 0) return 'diff--down';
    return 'cell-muted';
}
function fmtNum(v) {
    return v === null || v === undefined ? '\u2013' : v.toLocaleString('uz-UZ');
}
function fmtDiff(v) {
    if (v === null || v === undefined) return '\u2013';
    return v > 0 ? `+${v.toLocaleString('uz-UZ')}` : v.toLocaleString('uz-UZ');
}
function fmtPct(v) {
    if (v === null || v === undefined) return '\u2013';
    return v > 0 ? `+${v}%` : `${v}%`;
}
</script>

<template>
    <section class="panel">
        <PanelHeader icon="pi pi-clock" icon-bg="#dcfce7" icon-color="#16a34a" title="2. Yo'l harakati (ertalabki vaqt)" />

        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Vaqt</th>
                        <th>Ukv davri</th>
                        <th>Utgan yil</th>
                        <th>Farqi</th>
                        <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.time">
                        <td class="cell-strong">{{ row.time }}</td>
                        <td class="cell-muted">{{ fmtNum(row.current) }}</td>
                        <td class="cell-muted">{{ fmtNum(row.previous) }}</td>
                        <td :class="cls(row.diff)">{{ fmtDiff(row.diff) }}</td>
                        <td :class="cls(row.pct)">{{ fmtPct(row.pct) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <a href="#" class="footer-link" @click.prevent="emit('view-full')">
            To'liq jadval <i class="pi pi-arrow-right"></i>
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
    display: flex;
    flex-direction: column;
}
.table-scroll {
    overflow-x: auto;
    flex: 1;
}
table {
    width: 100%;
    border-collapse: collapse;
}
thead th {
    text-align: left;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--lt-text-secondary, #6b7280);
    padding: 0.55rem 0.5rem;
    border-bottom: 1px solid var(--lt-border, #e5e7eb);
    background: var(--surface-hover, #f9fafb);
    white-space: nowrap;
}
tbody td {
    padding: 0.55rem 0.5rem;
    font-size: 0.8rem;
    border-bottom: 1px solid var(--lt-border, #f1f2f4);
    white-space: nowrap;
}
.cell-muted {
    color: var(--lt-text-secondary, #6b7280);
}
.cell-strong {
    font-weight: 700;
    color: var(--lt-text, #111827);
}
.diff--up {
    color: #16a34a;
    font-weight: 700;
}
.diff--down {
    color: #dc2626;
    font-weight: 700;
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
