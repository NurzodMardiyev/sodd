<script setup>
defineProps({
    icon: { type: String, required: true },
    iconBg: { type: String, required: true },
    iconColor: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    percentText: { type: String, default: '' },
    percentColor: { type: String, default: '' },
    subStats: { type: Array, default: () => [] }, // ixtiyoriy: [{ label, value }] — masalan Avtobus/Mashrut/Taxi bo'linmasi
    clickable: { type: Boolean, default: false },
    active: { type: Boolean, default: false }
});
defineEmits(['click']);
</script>

<template>
    <component :is="clickable ? 'button' : 'div'" type="button" class="kpi-card" :class="{ 'kpi-card--clickable': clickable, 'kpi-card--active': active }" @click="clickable && $emit('click')">
        <div class="kpi-card--icon">
            <div class="kpi-text">
                <div class="kpi-label">{{ label }}</div>
                <div class="kpi-value">{{ value }}</div>
            </div>
            <div class="kpi-icon" :style="{ background: iconBg, color: iconColor }"><i :class="icon"></i></div>
        </div>
        <div v-if="subStats.length" class="kpi-substats">
            <div v-for="(s, i) in subStats" :key="i" class="kpi-substat">
                <div class="kpi-substat-value">{{ s.value }}</div>
                <div class="kpi-substat-label">{{ s.label }}</div>
            </div>
        </div>
    </component>
</template>

<style scoped>
.kpi-card {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    border: 1px solid var(--lt-border, #e5e7eb);
    background: var(--lt-card, #fff);
    text-align: left;
    width: 100%;
    font-family: inherit;
}
.kpi-card--icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
}
.kpi-text {
    min-width: 0;
}
.kpi-card--clickable {
    cursor: pointer;
    transition:
        border-color 0.15s,
        box-shadow 0.15s,
        transform 0.1s;
}
.kpi-card--clickable:hover {
    border-color: var(--primary-color, #2a78d6);
    transform: translateY(-1px);
}
.kpi-card--active {
    border-color: var(--primary-color, #2a78d6);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #2a78d6) 25%, transparent);
}
.kpi-icon {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
}
.kpi-value {
    font-size: 1.55rem;
    font-weight: 800;
    color: var(--lt-text, #111827);
    font-variant-numeric: tabular-nums;
    line-height: 1.2;
}
.kpi-label {
    margin-top: 0.5rem;
    font-size: 0.82rem;
    color: var(--lt-text-secondary, #6b7280);
}
.kpi-percent {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
}
.kpi-substats {
    display: flex;
    padding-top: 0.3rem;
    border-top: 1px solid var(--lt-border, #e5e7eb);
}
.kpi-substat {
    flex: 1;
    min-width: 0;
    text-align: center;
}
.kpi-substat + .kpi-substat {
    border-left: 1px solid var(--lt-border, #e5e7eb);
}
.kpi-substat-value {
    font-size: 1rem;
    font-weight: 800;
    color: var(--lt-text, #111827);
    font-variant-numeric: tabular-nums;
}
.kpi-substat-label {
    margin-top: 0;
    font-size: 0.7rem;
    color: var(--lt-text-secondary, #6b7280);
}
</style>
