<script setup>
import PanelHeader from './PanelHeader.vue';

defineProps({
    items: { type: Array, required: true } // [{ label, value }]
});
</script>

<template>
    <section class="panel">
        <PanelHeader icon="pi pi-hourglass" icon-bg="#f3f4f6" icon-color="#6b7280" title="Kutilayotgan ko'rsatkichlar" />
        <div class="items-row">
            <div v-for="(item, i) in items" :key="i" class="item">
                <span class="item-label">{{ item.label }}</span>
                <span class="item-value">{{ item.value }}</span>
            </div>
        </div>
    </section>
</template>

<style scoped>
.panel {
    border-radius: 12px;
    border: 1px solid var(--lt-border, #e5e7eb);
    background: var(--lt-card, #fff);
    padding: 1.2rem 1.3rem;
}
.items-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem 2rem;
}
.item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
}
.item-label {
    color: var(--lt-text-secondary, #6b7280);
}
.item-value {
    font-weight: 700;
    color: var(--lt-text, #111827);
}
</style>
