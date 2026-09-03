<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Vaqtinchalik sahifa qobig'i — sidebar'dagi har bir havola shu ko'rinishga
// olib keladi. Sarlavha route'ning `meta.title`idan olinadi (src/router/index.js).
const route = useRoute();
const title = computed(() => route.meta?.title || 'Sahifa');
</script>

<template>
    <div class="placeholder-page">
        <div class="placeholder-card">
            <span class="placeholder-icon"><i class="pi pi-clock"></i></span>
            <h1>{{ title }}</h1>
            <p>Bu bo'lim tayyorlanmoqda.</p>
            <code>{{ route.path }}</code>
        </div>
    </div>
</template>

<style scoped>
.placeholder-page {
    height: 100%;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}
.placeholder-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 2.5rem 3rem;
    border: 1px solid var(--surface-border, #e2e8f0);
    border-radius: 14px;
    background: var(--surface-card, #ffffff);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
    text-align: center;
}
.placeholder-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    background: var(--surface-hover, #f1f5f9);
    color: var(--primary-color, #2563eb);
    margin-bottom: 0.3rem;
}
.placeholder-card h1 {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-color, #111827);
}
.placeholder-card p {
    font-size: 0.9rem;
    color: var(--text-color-secondary, #64748b);
}
.placeholder-card code {
    font-size: 0.78rem;
    color: var(--text-color-secondary, #94a3b8);
    background: var(--surface-hover, #f8fafc);
    border-radius: 6px;
    padding: 0.15rem 0.5rem;
}
</style>
