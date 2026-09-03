<script setup>
import PanelHeader from './PanelHeader.vue';

// Yo'nalishga chiqarilgan avtobuslar — avtobuslar saroyi kesimida, 06:00 va
// 08:00 holatiga reja/amalda/farqi. Hujjatdagi jadvalning aniq nusxasi —
// guruh "JAMI" va umumiy "Jami avtobuslar chiqdi" qatorlari hujjatda qanday
// bo'lsa, shundayligicha (qayta hisoblanmagan holda) chiqadi.
defineProps({
    mainRows: { type: Array, required: true }, // [{ no, name, plan6, actual6, diff6, plan8, actual8, diff8 }]
    mainTotal: { type: Object, required: true },
    companyRows: { type: Array, required: true },
    companyTotal: { type: Object, required: true },
    grandTotal: { type: Object, required: true }
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
        <PanelHeader icon="pi pi-send" icon-bg="#dbeafe" icon-color="#2563eb" title="Yo'nalishga chiqarilgan avtobuslar" />

        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th rowspan="2" class="col-no">№</th>
                        <th rowspan="2" class="col-name">Avtobuslar saroyi</th>
                        <th colspan="3">06.00</th>
                        <th colspan="3">08.00</th>
                    </tr>
                    <tr>
                        <th class="sub">reja</th>
                        <th class="sub">amalda</th>
                        <th class="sub">farqi</th>
                        <th class="sub">reja</th>
                        <th class="sub">amalda</th>
                        <th class="sub">farqi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in mainRows" :key="'m' + row.no">
                        <td class="col-no">{{ row.no }}.</td>
                        <td class="col-name">{{ row.name }}</td>
                        <td class="cell-muted">{{ fmtNum(row.plan6) }}</td>
                        <td class="cell-muted">{{ fmtNum(row.actual6) }}</td>
                        <td :class="cls(row.diff6)">{{ fmtDiff(row.diff6) }}</td>
                        <td class="cell-muted">{{ fmtNum(row.plan8) }}</td>
                        <td class="cell-muted">{{ fmtNum(row.actual8) }}</td>
                        <td :class="cls(row.diff8)">{{ fmtDiff(row.diff8) }}</td>
                    </tr>
                    <tr class="section-row">
                        <td colspan="2">JAMI:</td>
                        <td>{{ fmtNum(mainTotal.plan6) }}</td>
                        <td>{{ fmtNum(mainTotal.actual6) }}</td>
                        <td :class="cls(mainTotal.diff6)">{{ fmtDiff(mainTotal.diff6) }}</td>
                        <td>{{ fmtNum(mainTotal.plan8) }}</td>
                        <td>{{ fmtNum(mainTotal.actual8) }}</td>
                        <td :class="cls(mainTotal.diff8)">{{ fmtDiff(mainTotal.diff8) }}</td>
                    </tr>

                    <tr v-for="row in companyRows" :key="'c' + row.no">
                        <td class="col-no">{{ row.no }}.</td>
                        <td class="col-name">{{ row.name }}</td>
                        <td class="cell-muted">{{ fmtNum(row.plan6) }}</td>
                        <td class="cell-muted">{{ fmtNum(row.actual6) }}</td>
                        <td :class="cls(row.diff6)">{{ fmtDiff(row.diff6) }}</td>
                        <td class="cell-muted">{{ fmtNum(row.plan8) }}</td>
                        <td class="cell-muted">{{ fmtNum(row.actual8) }}</td>
                        <td :class="cls(row.diff8)">{{ fmtDiff(row.diff8) }}</td>
                    </tr>
                    <tr class="section-row">
                        <td colspan="2">JAMI:</td>
                        <td>{{ fmtNum(companyTotal.plan6) }}</td>
                        <td>{{ fmtNum(companyTotal.actual6) }}</td>
                        <td :class="cls(companyTotal.diff6)">{{ fmtDiff(companyTotal.diff6) }}</td>
                        <td>{{ fmtNum(companyTotal.plan8) }}</td>
                        <td>{{ fmtNum(companyTotal.actual8) }}</td>
                        <td :class="cls(companyTotal.diff8)">{{ fmtDiff(companyTotal.diff8) }}</td>
                    </tr>

                    <tr class="grand-row">
                        <td colspan="2">Jami avtobuslar chiqdi:</td>
                        <td>{{ fmtNum(grandTotal.plan6) }}</td>
                        <td>{{ fmtNum(grandTotal.actual6) }}</td>
                        <td :class="cls(grandTotal.diff6)">{{ fmtDiff(grandTotal.diff6) }}</td>
                        <td>{{ fmtNum(grandTotal.plan8) }}</td>
                        <td>{{ fmtNum(grandTotal.actual8) }}</td>
                        <td :class="cls(grandTotal.diff8)">{{ fmtDiff(grandTotal.diff8) }}</td>
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
.col-name {
    text-align: left;
    font-weight: 600;
    color: var(--lt-text, #111827);
}
.section-row td {
    background: #eef2f7;
    color: var(--lt-text, #111827);
    font-weight: 700;
}
.section-row td:first-child {
    text-align: left;
}
.grand-row td {
    background: #f1f5f9;
    color: var(--lt-text, #111827);
    font-weight: 800;
}
.grand-row td:first-child {
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
