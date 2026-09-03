<script setup>
defineProps({
    text: { type: String, required: true },
    connected: { type: Boolean, default: true }
});
</script>

<template>
    <div class="status-bar">
        <span>{{ text }}</span>
        <span class="dot" :class="{ 'dot--on': connected }"></span>
    </div>
</template>

<style scoped>
.status-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8rem;
    font-size: 0.78rem;
    color: var(--lt-text-secondary, #6b7280);
}
.dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #d1d5db;
}
.dot--on {
    background: #16a34a;
}
</style>
