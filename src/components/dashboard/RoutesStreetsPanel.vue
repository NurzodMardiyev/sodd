<script setup>
// Marshrutlar kesimida ko'chalar qamrovi — har bir marshrut nechta ko'chadan
// o'tishi va aynan qaysi ko'chalardan o'tishini ko'rsatadi. RouteBusTablePanel
// bilan bir xil PrimeVue DataTable ko'rinishida. Qatorni bosish xaritada shu
// marshrut yo'nalishini ko'rsatish uchun tanlaydi (Dashboard.vue TransportMapCard'ga
// `selected-route` sifatida uzatadi).
const props = defineProps({
    title: { type: String, default: "Marshrutlar kesimida ko'chalar qamrovi" },
    rows: { type: Array, required: true }, // [{ name, streets: [] }]
    selected: { type: String, default: null }
});
const emit = defineEmits(['select']);

function rowClass(data) {
    return { 'route-row--active': data.name === props.selected };
}
</script>

<template>
    <section class="panel">
        <h2 class="title">{{ title }}</h2>

        <div class="table-wrap">
            <DataTable :value="rows" data-key="name" size="small" scrollable scroll-height="flex" class="routes-table" :row-class="rowClass" @row-click="emit('select', $event.data.name)">
                <Column field="name" header="Marshrut" class="col-name" />
                <Column header="Ko'chalar soni" style="width: 8.5rem">
                    <template #body="{ data }"><span class="count-cell">{{ data.streets.length }} ta</span></template>
                </Column>
                <Column header="A_palasa bor" style="width: 8rem">
                    <template #body="{ data }"><span class="status-cell status-yes">{{ data.asfaltBor }}</span></template>
                </Column>
                <Column header="A_palasa yo'q" style="width: 8rem">
                    <template #body="{ data }"><span class="status-cell status-no">{{ data.asfaltYoq }}</span></template>
                </Column>
                <Column header="Qamrab olingan ko'chalar">
                    <template #body="{ data }">
                        <div class="street-line" :title="data.streets.join(', ')">{{ data.streets.join(', ') }}</div>
                    </template>
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
.count-cell {
    font-weight: 700;
    color: #2563eb;
}
.status-cell {
    font-weight: 700;
}
.status-yes {
    color: #16a34a;
}
.status-no {
    color: #dc2626;
}
.street-line {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.78rem;
    color: var(--lt-text-secondary, #4b5563);
}

.routes-table {
    width: 100%;
    font-size: 0.85rem;
}
.routes-table :deep(.col-name) {
    text-align: left;
    font-weight: 600;
    white-space: nowrap;
}
.routes-table :deep(.p-datatable-thead > tr > th) {
    background: #f1f5f9;
    color: #1f2937;
    font-weight: 700;
    text-align: center;
    padding: 0.7rem 0.8rem;
}
.routes-table :deep(.p-datatable-thead > tr > th:first-child) {
    text-align: left;
}
.routes-table :deep(.p-datatable-tbody > tr > td) {
    text-align: center;
    padding: 0.6rem 0.8rem;
}
.routes-table :deep(.p-datatable-tbody > tr > td:nth-child(5)) {
    text-align: left;
}
.routes-table :deep(.p-datatable-tbody > tr) {
    cursor: pointer;
}
.routes-table :deep(.p-datatable-tbody > tr:hover) {
    background: var(--surface-hover, #f9fafb);
}
.routes-table :deep(.p-datatable-tbody > tr.route-row--active) {
    background: #eff6ff;
}
.routes-table :deep(.p-datatable-tbody > tr.route-row--active > td) {
    box-shadow: inset 0 0 0 9999px rgba(37, 99, 235, 0.06);
}
</style>
