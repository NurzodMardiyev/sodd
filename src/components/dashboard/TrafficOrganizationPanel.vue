<script setup>
import PanelHeader from './PanelHeader.vue';

defineProps({
    corridors: { type: Object, required: true }, // { planned, actual, diff }
    workingItems: { type: Array, required: true }, // [{ label, color }]
    obstructions: { type: Array, required: true } // [{ label, count }]
});
const emit = defineEmits(['view-details']);
</script>

<template>
    <section class="panel">
        <PanelHeader icon="pi pi-directions" icon-bg="#ffedd5" icon-color="#ea580c" title="5. Yo'l harakatini tashkil etish" />

        <div class="sub-title">Tashkil etilgan yo'l koridorlari</div>
        <div class="corridor-row">
            <table class="corridor-table">
                <thead>
                    <tr>
                        <th>Reja</th>
                        <th>Amalda</th>
                        <th>Farqi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="cell-strong">{{ corridors.planned }}</td>
                        <td class="cell-strong">{{ corridors.actual }}</td>
                        <td class="diff--down">{{ corridors.diff }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="working-list">
                <div class="working-title">Ishlamoqda</div>
                <div v-for="item in workingItems" :key="item.label" class="working-row">
                    <span class="dot" :style="{ background: item.color }"></span>
                    <span>{{ item.label }}</span>
                </div>
            </div>
        </div>

        <div class="sub-title sub-title--spaced">To'siqlik holati</div>
        <table class="obstruction-table">
            <tbody>
                <tr v-for="row in obstructions" :key="row.label">
                    <td class="cell-muted">{{ row.label }}</td>
                    <td class="cell-strong cell-right">{{ row.count }}</td>
                </tr>
            </tbody>
        </table>

        <a href="#" class="footer-link" @click.prevent="emit('view-details')">
            Batafsil ma'lumot <i class="pi pi-arrow-right"></i>
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
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
.sub-title {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--lt-text, #111827);
    margin-bottom: 0.5rem;
}
.sub-title--spaced {
    margin-top: 1rem;
}
.corridor-row {
    display: flex;
    gap: 1rem;
}
.corridor-table {
    flex: 1;
    border-collapse: collapse;
    border: 1px solid var(--lt-border, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
}
.corridor-table th {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--lt-text-secondary, #6b7280);
    background: var(--surface-hover, #f9fafb);
    padding: 0.45rem;
    text-align: center;
    border-bottom: 1px solid var(--lt-border, #e5e7eb);
}
.corridor-table td {
    padding: 0.7rem 0.45rem;
    text-align: center;
    font-size: 0.9rem;
}
.working-list {
    width: 45%;
    flex-shrink: 0;
}
.working-title {
    font-size: 0.72rem;
    color: var(--lt-text-secondary, #6b7280);
    margin-bottom: 0.4rem;
}
.working-row {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.78rem;
    color: var(--lt-text, #111827);
    padding: 0.15rem 0;
}
.dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    flex-shrink: 0;
}
.obstruction-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--lt-border, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
}
.obstruction-table td {
    padding: 0.55rem 0.7rem;
    font-size: 0.82rem;
    border-bottom: 1px solid var(--lt-border, #f1f2f4);
}
.obstruction-table tr:last-child td {
    border-bottom: none;
}
.cell-right {
    text-align: right;
}
.cell-muted {
    color: var(--lt-text-secondary, #6b7280);
}
.cell-strong {
    font-weight: 700;
    color: var(--lt-text, #111827);
}
.diff--down {
    color: #dc2626;
    font-weight: 700;
}
.footer-link {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #2563eb;
    text-decoration: none;
}
.footer-link i {
    font-size: 0.65rem;
}
</style>
