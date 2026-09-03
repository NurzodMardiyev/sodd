<script setup>
import PanelHeader from './PanelHeader.vue';

defineProps({
    rows: { type: Array, required: true } // [{ name, planned, actual, intervalMin, color, highlight }]
});
const emit = defineEmits(['view-all']);
</script>

<template>
    <section class="panel">
        <PanelHeader icon="pi pi-directions" icon-bg="#dbeafe" icon-color="#2563eb" title="4. Metro yo'nalishi holati" />
        <div class="sub-heading">
            <strong>"Toshkent metropoliteni" AJ</strong>
            <span>Metro yo'nalishi (tig'iz vaqt \u2013 soat 07.00-10.00gacha)</span>
        </div>

        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th rowspan="2" class="align-bottom">Yo'nalish nomi</th>
                        <th colspan="2" class="group-head">Harakat tarkibi soni</th>
                        <th rowspan="2" class="align-bottom">Interval<br />(daqiqa)</th>
                    </tr>
                    <tr>
                        <th class="sub-head">Reja</th>
                        <th class="sub-head">Amalda</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.name">
                        <td :class="row.highlight ? 'cell-highlight' : 'cell-strong'">{{ row.name }}</td>
                        <td :class="row.highlight ? 'cell-highlight-center' : 'cell-muted'">{{ row.planned }}</td>
                        <td :class="row.highlight ? 'cell-highlight-center' : 'cell-muted'">{{ row.actual }}</td>
                        <td>
                            <span class="interval-pill" :style="{ background: '#fff59d', color: '#111827' }">{{ row.intervalMin }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <a href="#" class="footer-link" @click.prevent="emit('view-all')">
            Barcha yo'nalishlar <i class="pi pi-arrow-right"></i>
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
    overflow: hidden;
}
.sub-heading {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    margin: -0.3rem 0 0.8rem;
    font-size: 0.8rem;
    color: var(--lt-text, #111827);
}
.cell-highlight {
    font-weight: 700;
    color: #dc2626;
}
.cell-highlight-center {
    font-weight: 700;
    color: #dc2626;
    text-align: center;
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
    padding: 0.5rem 0.5rem;
    border-bottom: 1px solid var(--lt-border, #e5e7eb);
    background: var(--surface-hover, #f9fafb);
}
.group-head {
    text-align: center;
    border-bottom: 1px solid var(--lt-border, #e5e7eb);
}
.sub-head {
    text-align: center;
}
.align-bottom {
    vertical-align: bottom;
}
tbody td {
    padding: 0.6rem 0.5rem;
    font-size: 0.82rem;
    border-bottom: 1px solid var(--lt-border, #f1f2f4);
}
tbody td:nth-child(2),
tbody td:nth-child(3) {
    text-align: center;
}
.cell-muted {
    color: var(--lt-text-secondary, #6b7280);
    text-align: center;
}
.cell-strong {
    font-weight: 700;
    color: var(--lt-text, #111827);
}
.interval-pill {
    display: inline-block;
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
}
.footer-link {
    flex-shrink: 0;
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
