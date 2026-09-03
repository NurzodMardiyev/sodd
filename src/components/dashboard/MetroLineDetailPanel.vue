<script setup>
// Yuklamasi eng yuqori metro yo'nalishi bo'yicha soatlik ma'lumot — metro
// rejimida CongestionPanel + CityEntryTransportPanel o'rnida (2 ustun) chiqadi.
// PrimeVue DataTable, oxirida JAMI qatori (Dashboard.vue'dan `totals` orqali).
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: "Yuklamasi eng yuqori yo'nalish" },
    lineColor: { type: String, default: '#E53E3E' },
    day2Label: { type: String, default: '2-sentabr' },
    day3Label: { type: String, default: '3-sentabr' },
    rows: { type: Array, required: true }, // [{ hourLabel, intervalMin, trains, capacity, day2, day3 }]
    totals: { type: Object, default: null } // { capacity, day2, day3 }
});

const fmt = (v) => (v === null || v === undefined ? '–' : v.toLocaleString('uz-UZ'));
</script>

<template>
    <section class="panel">
        <div class="head">
            <span class="line-dot" :style="{ background: lineColor }"></span>
            <div class="head-text">
                <h2 class="title">{{ title }}</h2>
                <span class="subtitle">{{ subtitle }}</span>
            </div>
        </div>

        <div class="table-wrap">
            <DataTable :value="rows" data-key="hourLabel" size="small" scrollable scroll-height="flex" class="line-table">
                <Column header="№" class="col-num" :footer="'JAMI:'">
                    <template #body="{ index }">{{ index + 1 }}</template>
                </Column>
                <Column field="hourLabel" header="Oraliq vaqt" class="col-hour" />
                <Column field="intervalMin" header="Interval (daqiqa)">
                    <template #body="{ data }"
                        ><span class="pill">{{ data.intervalMin }}</span></template
                    >
                </Column>
                <Column field="trains" header="Yo'nalishdagi harakat tarkibi" />
                <Column field="capacity" header="Maksimal yo'lovchi tashish qobiliyati (reja)" :footer="totals ? fmt(totals.capacity) : ''">
                    <template #body="{ data }">{{ fmt(data.capacity) }}</template>
                </Column>
                <Column field="day2" :header="`Tashilgan yo'lovchi soni (${day2Label})`" :footer="totals ? fmt(totals.day2) : ''">
                    <template #body="{ data }"
                        ><span class="cell-day2">{{ fmt(data.day2) }}</span></template
                    >
                </Column>
                <Column field="day3" :header="`Tashilgan yo'lovchi soni (${day3Label})`" :footer="totals ? fmt(totals.day3) : ''">
                    <template #body="{ data }"
                        ><span class="cell-day3">{{ fmt(data.day3) }}</span></template
                    >
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
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.head {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 0.9rem;
}
.line-dot {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    flex-shrink: 0;
}
.head-text {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}
.title {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--lt-text, #111827);
}
.subtitle {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--lt-text-secondary, #6b7280);
}
.table-wrap {
    flex: 1;
    min-height: 0;
    display: flex;
}
.line-table {
    width: 100%;
    font-size: 0.8rem;
}
.line-table :deep(.col-num) {
    width: 2.5rem;
    color: var(--lt-text-secondary, #9ca3af);
}
.line-table :deep(.col-hour) {
    font-weight: 700;
    white-space: nowrap;
}
.line-table :deep(.p-datatable-thead > tr > th) {
    background: #f1f5f9;
    color: #1f2937;
    font-weight: 700;
    font-size: 0.72rem;
    text-align: center;
    padding: 0.45rem 0.5rem;
    line-height: 1.25;
}
.line-table :deep(.p-datatable-tbody > tr > td) {
    text-align: center;
    padding: 0.35rem 0.5rem;
    white-space: nowrap;
}
.line-table :deep(.p-datatable-tfoot > tr > td) {
    background: #f1f5f9;
    color: #1f2937;
    font-weight: 700;
    text-align: center;
    padding: 0.45rem 0.5rem;
}
.pill {
    display: inline-block;
    min-width: 2rem;
    padding: 0.1rem 0.45rem;
    border-radius: 999px;
    background: #fff59d;
    color: #111827;
    font-weight: 700;
}
.cell-day2 {
    font-weight: 700;
    color: #2563eb;
}
.cell-day3 {
    font-weight: 700;
    color: #16a34a;
}
</style>
