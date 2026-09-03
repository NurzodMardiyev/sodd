<script setup>
import { computed } from 'vue';

// Avtobuslarning holati — avtobuslar saroyi (avtokorxona) kesimida:
// soz / nosoz / yo'nalishda / yo'nalishda emas / to'xtab turibdi / GPS bor-yo'qligi.
// PrimeVue DataTable orqali chiqariladi, jadval oxirida ustunlar bo'yicha JAMI qatori.
const props = defineProps({
    title: { type: String, default: "Avtobuslarning holati (avtobuslar saroyi bo'yicha)" },
    rows: { type: Array, required: true } // [{ name, soz, nosoz, yonalishda, yonalishdaEmas, toxtabTurgan, gpsBor, gpsYoq, kameraBor, kameraYoq }]
});

const rowsWithTotal = computed(() => props.rows.map((row) => ({ ...row, jami: row.soz + row.nosoz })));

const totals = computed(() =>
    rowsWithTotal.value.reduce(
        (acc, row) => {
            acc.jami += row.jami;
            acc.soz += row.soz;
            acc.nosoz += row.nosoz;
            acc.yonalishda += row.yonalishda;
            acc.yonalishdaEmas += row.yonalishdaEmas;
            acc.toxtabTurgan += row.toxtabTurgan;
            acc.gpsBor += row.gpsBor;
            acc.gpsYoq += row.gpsYoq;
            acc.kameraBor += row.kameraBor;
            acc.kameraYoq += row.kameraYoq;
            return acc;
        },
        { jami: 0, soz: 0, nosoz: 0, yonalishda: 0, yonalishdaEmas: 0, toxtabTurgan: 0, gpsBor: 0, gpsYoq: 0, kameraBor: 0, kameraYoq: 0 }
    )
);
</script>

<template>
    <section class="panel">
        <h2 class="title">{{ title }}</h2>

        <div class="table-wrap">
            <DataTable :value="rowsWithTotal" data-key="name" size="small" scrollable scroll-height="flex" class="bus-status-table">
                <Column field="name" header="Avtobuslar saroyi" class="col-name" />
                <Column field="jami" header="Jami">
                    <template #body="{ data }"><span class="status-cell status-jami">{{ data.jami }}</span></template>
                </Column>
                <Column field="soz" header="Soz">
                    <template #body="{ data }"><span class="status-cell status-soz">{{ data.soz }}</span></template>
                </Column>
                <Column field="nosoz" header="Nosoz" >
                    <template #body="{ data }"><span class="status-cell status-nosoz">{{ data.nosoz }}</span></template>
                </Column>
                <Column field="yonalishda" header="Yo'nalishda" >
                    <template #body="{ data }"><span class="status-cell status-onroute">{{ data.yonalishda }}</span></template>
                </Column>
                <Column field="yonalishdaEmas" header="Yo'nalishda emas" >
                    <template #body="{ data }"><span class="status-cell status-offroute">{{ data.yonalishdaEmas }}</span></template>
                </Column>
                <Column field="toxtabTurgan" header="To'xtab turibdi">
                    <template #body="{ data }"><span class="status-cell status-idle">{{ data.toxtabTurgan }}</span></template>
                </Column>
                <Column field="gpsBor" header="GPS bor" >
                    <template #body="{ data }"><span class="status-cell status-soz">{{ data.gpsBor }}</span></template>
                </Column>
                <Column field="gpsYoq" header="GPS yo'q" >
                    <template #body="{ data }"><span class="status-cell status-nosoz">{{ data.gpsYoq }}</span></template>
                </Column>
                <Column field="kameraBor" header="Kamerasi bor" >
                    <template #body="{ data }"><span class="status-cell status-soz">{{ data.kameraBor }}</span></template>
                </Column>
                <Column field="kameraYoq" header="Kamerasi yo'q" >
                    <template #body="{ data }"><span class="status-cell status-nosoz">{{ data.kameraYoq }}</span></template>
                </Column>
            </DataTable>
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
.table-wrap {
    flex: 1;
    min-height: 0;
    display: flex;
}
.status-cell {
    font-weight: 700;
}
.status-jami {
    color: var(--lt-text, #1f2937);
}
.status-soz {
    color: #16a34a;
}
.status-nosoz {
    color: #dc2626;
}
.status-onroute {
    color: #2563eb;
}
.status-offroute {
    color: #d97706;
}
.status-idle {
    color: #6b7280;
}

.bus-status-table {
    width: 100%;
    font-size: 0.85rem;
}
.bus-status-table :deep(.col-name) {
    text-align: left;
    font-weight: 600;
    white-space: nowrap;
}
.bus-status-table :deep(.p-datatable-thead > tr > th) {
    background: #f1f5f9;
    color: #1f2937;
    font-weight: 700;
    text-align: center;
    padding: 0.7rem 0.8rem;
}
.bus-status-table :deep(.p-datatable-tbody > tr > td) {
    text-align: center;
    padding: 0.6rem 0.8rem;
}
.bus-status-table :deep(.p-datatable-tfoot > tr > td) {
    background: #f1f5f9;
    color: #1f2937;
    font-weight: 700;
    text-align: center;
    padding: 0.7rem 0.8rem;
}
.bus-status-table :deep(.p-datatable-tfoot > tr > td:nth-child(1)) {
    text-align: left;
}
</style>
