<script setup>
import PanelHeader from './PanelHeader.vue';

// Yo'l harakati vaqti bo'yicha solishtirma jadvali — "Yer usti transporti"
// rejimida "Yo'lovchilar oqimi solishtirmasi" (metroga tegishli) o'rniga
// chiqadi. Ertalabki/kechki vaqt bo'limlariga bo'lingan, ikkita kunni
// solishtiradigan hujjatdagi jadvalning aniq nusxasi.
defineProps({
    compareLabel1: { type: String, default: '' },
    compareLabel2: { type: String, default: '' },
    morningRows: { type: Array, required: true }, // [{ no, time, v1, v2, diff, pct }]
    eveningRows: { type: Array, required: true } // [{ no, time, v1, v2, diff, pct }] — v2/diff/pct null bo'lishi mumkin
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
function fmtPct(v) {
    if (v === null || v === undefined) return '–';
    return v > 0 ? `+${v}%` : `${v}%`;
}
</script>

<template>
    <section class="panel">
        <PanelHeader icon="pi pi-clock" icon-bg="#dbeafe" icon-color="#2563eb" title="Yo'l harakati vaqti bo'yicha solishtirma" />

        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th rowspan="2" class="col-no">№</th>
                        <th rowspan="2" class="col-time">Harakat vaqti</th>
                        <th colspan="2">O'quv davri</th>
                        <th colspan="2">O'sish farqi</th>
                    </tr>
                    <tr>
                        <th class="sub">{{ compareLabel1 }}</th>
                        <th class="sub">{{ compareLabel2 }}</th>
                        <th class="sub">sonda</th>
                        <th class="sub">%</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="section-row">
                        <td colspan="6">Ertalabki vaqt</td>
                    </tr>
                    <tr v-for="row in morningRows" :key="'m' + row.no">
                        <td class="col-no">{{ row.no }}.</td>
                        <td class="col-time">{{ row.time }}</td>
                        <td class="cell-muted">{{ fmtNum(row.v1) }}</td>
                        <td class="cell-muted">{{ fmtNum(row.v2) }}</td>
                        <td :class="cls(row.diff)">{{ fmtDiff(row.diff) }}</td>
                        <td :class="cls(row.pct)">{{ fmtPct(row.pct) }}</td>
                    </tr>

                    <tr class="section-row">
                        <td colspan="6">Kechki vaqt</td>
                    </tr>
                    <tr v-for="row in eveningRows" :key="'e' + row.no">
                        <td class="col-no">{{ row.no }}.</td>
                        <td class="col-time">{{ row.time }}</td>
                        <td class="cell-muted">{{ fmtNum(row.v1) }}</td>
                        <td class="cell-muted">{{ fmtNum(row.v2) }}</td>
                        <td :class="cls(row.diff)">{{ fmtDiff(row.diff) }}</td>
                        <td :class="cls(row.pct)">{{ fmtPct(row.pct) }}</td>
                    </tr>
                </tbody>
            </table>
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
.table-scroll {
    flex: 1;
    min-height: 0;
    overflow: auto;
}
table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
}
th,
td {
    border: 1px solid var(--lt-border, #e5e7eb);
    padding: 0.55rem 0.5rem;
    text-align: center;
    white-space: nowrap;
}
thead {
    position: sticky;
    top: 0;
    z-index: 1;
}
thead tr:first-child th {
    background: #f1f5f9;
    color: #1f2937;
    font-weight: 700;
    font-size: 0.85rem;
}
thead tr:last-child th.sub {
    background: #f8fafc;
    color: var(--lt-text-secondary, #6b7280);
    font-weight: 600;
    font-size: 0.75rem;
}
.col-no {
    width: 2rem;
}
.col-time {
    text-align: left;
    font-weight: 600;
    color: var(--lt-text, #111827);
}
.section-row td {
    background: #eef2f7;
    color: var(--lt-text, #111827);
    font-weight: 700;
    text-align: left;
}
.cell-muted {
    color: var(--lt-text-secondary, #6b7280);
}
.diff--up {
    color: #16a34a;
    font-weight: 700;
}
.diff--down {
    color: #dc2626;
    font-weight: 700;
}
</style>
