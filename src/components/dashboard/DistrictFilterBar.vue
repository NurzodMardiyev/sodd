<script setup>
defineProps({
    districts: { type: Array, required: true }, // string[]
    modelValue: { type: String, required: true }
});
defineEmits(['update:modelValue']);
</script>

<template>
    <div class="district-bar">
        <button v-for="d in districts" :key="d" type="button" class="district-chip" :class="{ 'district-chip--active': modelValue === d }" @click="$emit('update:modelValue', d)">
            {{ d }}
        </button>
    </div>
</template>

<style scoped>
.district-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;
    flex-shrink: 0;
    background: var(--lt-card, #fff);
    padding: 0.5rem;
    border-radius: 0.2rem;
}
.district-bar::-webkit-scrollbar {
    display: none;
}
.district-chip {
    flex-shrink: 0;
    padding: 0.4rem 0.9rem;
    border-radius: 4px;
    border: 1px solid var(--lt-border, #e5e7eb);
    background: var(--lt-card, #fff);
    color: var(--lt-text-secondary, #6b7280);
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition:
        background 0.15s,
        color 0.15s,
        border-color 0.15s;
}
.district-chip:hover {
    border-color: var(--primary-color, #2a78d6);
    color: var(--lt-text, #111827);
}
.district-chip--active {
    background: var(--primary-color, #2a78d6);
    border-color: var(--primary-color, #2a78d6);
    color: #fff;
}
</style>
