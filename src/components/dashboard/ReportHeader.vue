<script setup>
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    dateNote: { type: String, default: '' }
});
</script>

<template>
    <div class="report-header">
        <h1 class="report-title">{{ title }}</h1>
        <div class="report-meta">
            <span v-if="subtitle" class="report-subtitle">{{ subtitle }}</span>
            <span v-if="dateNote" class="report-date">{{ dateNote }}</span>
        </div>
    </div>
</template>

<style scoped>
.report-header {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}
.report-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--lt-text, #111827);
    line-height: 1.4;
    margin: 0;
}
.report-meta {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
}
.report-subtitle {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--lt-primary, #2563eb);
}
.report-date {
    font-size: 0.8rem;
    color: var(--lt-text-secondary, #6b7280);
}
</style>
