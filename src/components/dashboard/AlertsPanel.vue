<script setup>
import PanelHeader from './PanelHeader.vue';

defineProps({
    items: { type: Array, required: true } // [{ icon, iconColor, title, description, time }]
});
const emit = defineEmits(['view-all']);
</script>

<template>
    <section class="panel">
        <PanelHeader icon="pi pi-exclamation-triangle" icon-bg="#fee2e2" icon-color="#dc2626" title="6. Xabarlar va eslatmalar" />

        <div class="list">
            <div v-for="(item, i) in items" :key="i" class="item">
                <span class="item-icon" :style="{ color: item.iconColor }"><i :class="item.icon"></i></span>
                <div class="item-body">
                    <div class="item-title">{{ item.title }}</div>
                    <div class="item-desc">{{ item.description }}</div>
                </div>
                <span class="item-time">{{ item.time }}</span>
            </div>
        </div>

        <a href="#" class="footer-link" @click.prevent="emit('view-all')">
            Barcha xabarlar <i class="pi pi-arrow-right"></i>
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
.list {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    flex: 1;
}
.item {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
}
.item-icon {
    font-size: 1rem;
    margin-top: 0.1rem;
    flex-shrink: 0;
}
.item-body {
    flex: 1;
    min-width: 0;
}
.item-title {
    font-size: 0.83rem;
    font-weight: 700;
    color: var(--lt-text, #111827);
    line-height: 1.4;
}
.item-desc {
    margin-top: 0.1rem;
    font-size: 0.76rem;
    color: var(--lt-text-secondary, #6b7280);
}
.item-time {
    flex-shrink: 0;
    font-size: 0.72rem;
    color: var(--lt-text-secondary, #9ca3af);
    white-space: nowrap;
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
