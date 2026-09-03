<script setup>
defineProps({
    icon: { type: String, required: true },
    iconBg: { type: String, required: true },
    iconColor: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    sub: { type: String, required: true },
    trendPct: { type: String, required: true }, // masalan "4.2%" yoki "-14.3%"
    trendPositive: { type: Boolean, required: true },
    trendNote: { type: String, required: true }
});
</script>

<template>
    <div class="kpi-card">
        <div class="kpi-icon" :style="{ background: iconBg, color: iconColor }"><i :class="icon"></i></div>
        <div class="kpi-label">{{ label }}</div>
        <div class="kpi-value">{{ value }}</div>
        <div class="kpi-sub">{{ sub }}</div>
        <div class="kpi-trend" :class="trendPositive ? 'trend--up' : 'trend--down'">
            <i class="pi" :class="trendPositive ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
            <span class="trend-pct">{{ trendPct }}</span>
            <span class="trend-note">{{ trendNote }}</span>
        </div>
    </div>
</template>

<style scoped>
.kpi-card {
    padding: 1.1rem 1.2rem;
    border-radius: 12px;
    border: 1px solid var(--lt-border, #e5e7eb);
    background: var(--lt-card, #fff);
}
.kpi-icon {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    margin-bottom: 0.7rem;
}
.kpi-label {
    font-size: 0.82rem;
    color: var(--lt-text-secondary, #6b7280);
}
.kpi-value {
    margin-top: 0.15rem;
    font-size: 1.55rem;
    font-weight: 800;
    color: var(--lt-text, #111827);
    font-variant-numeric: tabular-nums;
}
.kpi-sub {
    margin-top: 0.1rem;
    font-size: 0.75rem;
    color: var(--lt-text-secondary, #9ca3af);
}
.kpi-trend {
    margin-top: 0.6rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
}
.kpi-trend i {
    font-size: 0.65rem;
}
.trend-pct {
    font-weight: 700;
}
.trend-note {
    color: var(--lt-text-secondary, #9ca3af);
}
.trend--up .trend-pct,
.trend--up i {
    color: #16a34a;
}
.trend--down .trend-pct,
.trend--down i {
    color: #dc2626;
}
</style>
