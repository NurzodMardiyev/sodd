<script setup>
import PanelHeader from './PanelHeader.vue';

defineProps({
    rows: { type: Array, required: true }, // [{ hourLabel, day2, day3, diff }]
    grandTotal: { type: Number, default: null }
});

function cls(v) {
    if (v === null || v === undefined) return 'cell-muted';
    if (v > 0) return 'diff--up';
    if (v < 0) return 'diff--down';
    return 'cell-muted';
}
function fmtNum(v) {
    return v === null || v === undefined ? '–' : v.toLocaleString('uz-UZ');
}
function fmtDiff(v) {
    if (v === null || v === undefined) return '–';
    return v > 0 ? `+${v.toLocaleString('uz-UZ')}` : v.toLocaleString('uz-UZ');
}
</script>

<template>
    <section class="panel">
        <PanelHeader icon="pi pi-chart-line" icon-bg="#dcfce7" icon-color="#16a34a" title="Yo'lovchilar oqimi solishtirmasi" />

        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Soat</th>
                        <th>2-kun</th>
                        <th>3-kun</th>
                        <th>Farqi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.hourLabel">
                        <td class="cell-strong">{{ row.hourLabel }}</td>
                        <td class="cell-muted">{{ fmtNum(row.day2) }}</td>
                        <td class="cell-muted">{{ fmtNum(row.day3) }}</td>
                        <td :class="cls(row.diff)">{{ fmtDiff(row.diff) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="grandTotal !== null" class="grand-total">
            <span>Jami tashilgan yo'lovchilar</span>
            <strong>{{ grandTotal.toLocaleString('uz-UZ') }}</strong>
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
.table-scroll {
    flex: 1;
    min-height: 0;
    overflow: auto;
}
table {
    width: 100%;
    border-collapse: collapse;
}
thead {
    position: sticky;
    top: 0;
    z-index: 1;
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
.grand-total {
    flex-shrink: 0;
    margin-top: 0.9rem;
    padding-top: 0.8rem;
    border-top: 1px solid var(--lt-border, #e5e7eb);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--lt-text, #111827);
}
.grand-total strong {
    font-size: 1rem;
    font-weight: 800;
}
</style>
