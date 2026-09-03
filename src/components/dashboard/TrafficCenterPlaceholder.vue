<script setup>
import PanelHeader from './PanelHeader.vue';

defineProps({
    title: { type: String, required: true }
});
</script>

<template>
    <section class="panel">
        <PanelHeader icon="pi pi-map" icon-bg="#f3f4f6" icon-color="#6b7280" :title="title" />
        <div class="placeholder-body">
            <i class="pi pi-video placeholder-icon"></i>
            <span class="placeholder-text">Monitoring integratsiyasi tez orada ulanadi</span>
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
}
.placeholder-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    min-height: 8rem;
    border: 1px dashed var(--lt-border, #e5e7eb);
    border-radius: 10px;
    color: var(--lt-text-secondary, #9ca3af);
}
.placeholder-icon {
    font-size: 1.8rem;
}
.placeholder-text {
    font-size: 0.8rem;
    text-align: center;
    padding: 0 1rem;
}
</style>
