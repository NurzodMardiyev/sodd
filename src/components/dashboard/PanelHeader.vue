<script setup>
defineProps({
    icon: { type: String, required: true },
    iconBg: { type: String, required: true },
    iconColor: { type: String, required: true },
    title: { type: String, required: true }
});
</script>

<template>
    <div class="panel-header">
        <span class="panel-icon" :style="{ background: iconBg, color: iconColor }"><i :class="icon"></i></span>
        <h2>{{ title }}</h2>
    </div>
</template>

<style scoped>
.panel-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 1rem;
}
.panel-icon {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
}
.panel-header h2 {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--lt-text, #111827);
}
</style>
