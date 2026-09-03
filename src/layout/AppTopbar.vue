<script setup>
import { computed, ref } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import NavbarWeatherClock from '@/components/NavbarWeatherClock.vue';
import { currentLang, setLanguage } from '@/composables/useLanguage.js';

const { setThemeMode, themeMode, toggleMenu } = useLayout();

// Mavzu tanlash: yorug' / tungi / tizim (default — tizim)
const themeOpen = ref(false);
const THEMES = [
    {
        value: 'light',
        label: "Yorug'",
        colorClass: 'theme-ico-light',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:100%;height:100%">
            <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>
            <line x1="12" y1="2" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22"/>
            <line x1="4.22" y1="4.22" x2="5.94" y2="5.94"/><line x1="18.06" y1="18.06" x2="19.78" y2="19.78"/>
            <line x1="2" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.94" y2="18.06"/><line x1="18.06" y1="5.94" x2="19.78" y2="4.22"/>
        </svg>`
    },
    {
        value: 'dark',
        label: 'Tungi',
        colorClass: 'theme-ico-dark',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style="display:block;width:100%;height:100%">
            <path d="M20.4 14.7c-2.9 0.8-6.1-0.1-8.2-2.2s-3-5.3-2.2-8.2c0.1-0.5-0.4-0.9-0.9-0.7-4 1.5-6.7 5.5-6.3 10 0.4 4.6 4.1 8.3 8.7 8.7 4.5 0.4 8.5-2.3 10-6.3 0.2-0.5-0.2-1-0.7-0.9-0.1 0-0.3 0.1-0.4 0.1z"/>
        </svg>`
    },
    {
        value: 'system',
        label: 'Tizim',
        colorClass: 'theme-ico-system',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;width:100%;height:100%">
            <rect x="2.5" y="4" width="19" height="13" rx="2"/>
            <line x1="8.5" y1="21" x2="15.5" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        </svg>`
    }
];
const currentThemeObj = computed(() => THEMES.find((t) => t.value === themeMode.value) || THEMES[2]);
function selectTheme(v) {
    setThemeMode(v);
    themeOpen.value = false;
}

// --- Til tanlash (UI; haqiqiy tarjima i18n talab qiladi) ---
const LANGS = [
    {
        code: 'uz',
        label: "O'zbekcha",
        svg: `<svg viewBox="0 0 24 16" style="display:block;width:100%;height:100%">
            <rect width="24" height="16" fill="#0099B5"/>
            <rect y="5.2" width="24" height="5.6" fill="#fff"/>
            <rect y="10.8" width="24" height="5.2" fill="#1EB53A"/>
            <rect y="5" width="24" height="0.5" fill="#CE1126"/><rect y="10.5" width="24" height="0.5" fill="#CE1126"/>
            <circle cx="4.2" cy="2.9" r="1.8" fill="#fff"/><circle cx="5.1" cy="2.9" r="1.55" fill="#0099B5"/>
            <circle cx="7.2" cy="1.7" r="0.32" fill="#fff"/><circle cx="8.7" cy="1.7" r="0.32" fill="#fff"/><circle cx="7.2" cy="3.1" r="0.32" fill="#fff"/><circle cx="8.7" cy="3.1" r="0.32" fill="#fff"/>
        </svg>`
    },
    {
        code: 'ru',
        label: 'Русский',
        svg: `<svg viewBox="0 0 24 16" style="display:block;width:100%;height:100%">
            <rect width="24" height="16" fill="#fff"/>
            <rect y="5.33" width="24" height="5.33" fill="#0039A6"/>
            <rect y="10.66" width="24" height="5.34" fill="#D52B1E"/>
        </svg>`
    },
    {
        code: 'en',
        label: 'English',
        svg: `<svg viewBox="0 0 24 16" style="display:block;width:100%;height:100%">
            <rect width="24" height="16" fill="#012169"/>
            <path d="M0 0 L24 16 M24 0 L0 16" stroke="#fff" stroke-width="3.2"/>
            <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" stroke-width="1.6"/>
            <rect x="9.5" width="5" height="16" fill="#fff"/><rect y="5.5" width="24" height="5" fill="#fff"/>
            <rect x="10.5" width="3" height="16" fill="#C8102E"/><rect y="6.5" width="24" height="3" fill="#C8102E"/>
        </svg>`
    }
];
const langOpen = ref(false);
const currentLangObj = computed(() => LANGS.find((l) => l.code === currentLang.value) || LANGS[0]);
function selectLang(code) {
    setLanguage(code);
    langOpen.value = false;
}
</script>

<template>
    <header class="layout-topbar">
        <router-link to="/dashboard" class="topbar-logo-link">
            <span class="topbar-logo-text">YHTEM</span>
        </router-link>

        <div class="layout-topbar-actions">
            <NavbarWeatherClock />

            <!-- Mavzu tanlash (yorug' / tungi / tizim) -->
            <div class="theme-selector">
                <button type="button" class="topbar-action-btn" @click="themeOpen = !themeOpen" title="Mavzu">
                    <span class="theme-btn-ico" :class="currentThemeObj.colorClass" v-html="currentThemeObj.svg"></span>
                </button>
                <template v-if="themeOpen">
                    <div class="lang-backdrop" @click="themeOpen = false"></div>
                    <div class="lang-dropdown theme-dropdown">
                        <button v-for="t in THEMES" :key="t.value" type="button" class="lang-option" :class="{ active: t.value === themeMode }" @click="selectTheme(t.value)">
                            <span class="theme-option-ico" :class="t.colorClass" v-html="t.svg"></span>
                            <span>{{ t.label }}</span>
                        </button>
                    </div>
                </template>
            </div>

            <!-- Til tanlash -->
            <div class="lang-selector">
                <button type="button" class="topbar-action-btn lang-btn" @click="langOpen = !langOpen" title="Til">
                    <span class="lang-flag" v-html="currentLangObj.svg"></span>
                    <span class="lang-label">{{ currentLangObj.label }}</span>
                    <i class="pi pi-chevron-down lang-caret"></i>
                </button>
                <template v-if="langOpen">
                    <div class="lang-backdrop" @click="langOpen = false"></div>
                    <div class="lang-dropdown">
                        <button v-for="l in LANGS" :key="l.code" type="button" class="lang-option" :class="{ active: l.code === currentLang }" @click="selectLang(l.code)">
                            <span class="lang-flag" v-html="l.svg"></span>
                            <span>{{ l.label }}</span>
                        </button>
                    </div>
                </template>
            </div>

            <button type="button" class="topbar-menu-toggle" @click="toggleMenu" title="Menyu">
                <i class="pi pi-bars"></i>
            </button>
        </div>
    </header>
</template>

<style scoped>
/* Grid item (AppLayout.vue `.layout-wrapper` → grid-template-areas). */
.layout-topbar {
    grid-area: topbar;
    width: auto;
    height: var(--topbar-height);
    background: var(--surface-card);
    border: 1px solid var(--surface-border, #e2e8f0);
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
    display: flex;
    align-items: center;
    padding: 0 1rem;
    gap: 1rem;
}

.topbar-logo-link {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
    color: inherit;
    flex-shrink: 0;
}

.topbar-logo-text {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: var(--text-color, #1e293b);
}

.layout-topbar-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Faqat mobil kenglikda ko'rinadigan menyu tugmasi — AppSidebar.vue'ni
   off-canvas sifatida ochadi (AppLayout.vue'dagi `layoutState.staticMenuMobileActive`,
   useLayout().toggleMenu). */
.topbar-menu-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    width: 2.5rem;
    flex-shrink: 0;
    border: 1px solid var(--surface-border, #e2e8f0);
    background: var(--surface-card, #fff);
    border-radius: 12px;
    color: var(--text-color-secondary, #64748b);
    cursor: pointer;
    font-size: 1.1rem;
    transition:
        background 0.15s,
        color 0.15s;
}
.topbar-menu-toggle:hover {
    background: var(--surface-hover, #f1f5f9);
    color: var(--text-color, #1e293b);
}
/* DIQQAT: 991px — AppLayout.vue/AppSidebar.vue bilan mos qiymat. */
@media (max-width: 991px) {
    .topbar-menu-toggle {
        display: inline-flex;
    }
    .lang-selector {
        display: none;
    }
    .theme-selector .topbar-action-btn {
        height: 2.15rem;
        min-width: 2.15rem;
        padding: 0 0.45rem;
        font-size: 0.95rem;
    }
    .theme-btn-ico {
        width: 1.15rem;
        height: 1.15rem;
    }
    .theme-selector .theme-dropdown {
        position: fixed !important;
        top: calc(var(--topbar-height, 3.75rem) + var(--layout-gutter, 10px) + 0.4rem) !important;
        right: var(--layout-gutter, 10px) !important;
        left: auto !important;
        width: calc(100vw - 2 * var(--layout-gutter, 10px)) !important;
        max-width: 20rem !important;
    }
}

.topbar-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    min-width: 2.5rem;
    padding: 0 0.6rem;
    border: 1px solid var(--surface-border, #e2e8f0);
    background: var(--surface-card, #fff);
    border-radius: 12px;
    color: var(--text-color-secondary, #64748b);
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s,
        border-color 0.15s;
    font-size: 1.05rem;
}
.topbar-action-btn:hover {
    background: var(--surface-hover, #f1f5f9);
    color: var(--text-color, #1e293b);
    border-color: var(--surface-border, #cbd5e1);
}

/* ── Til / mavzu tanlash ── */
.lang-selector,
.theme-selector {
    position: relative;
}
.theme-dropdown {
    min-width: 10rem;
}
.theme-btn-ico,
.theme-option-ico {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.theme-btn-ico {
    width: 1.35rem;
    height: 1.35rem;
}
.theme-option-ico {
    width: 1.1rem;
    height: 1.1rem;
}
.theme-ico-light {
    color: #f59e0b;
}
.theme-ico-dark {
    color: #6366f1;
}
.theme-ico-system {
    color: #3b82f6;
}
.lang-btn {
    gap: 0.5rem;
}
.lang-flag {
    width: 26px;
    height: 18px;
    border-radius: 6px;
    overflow: hidden;
    display: inline-flex;
    flex-shrink: 0;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.lang-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-color, #1e293b);
}
.lang-caret {
    font-size: 0.6rem;
    color: var(--text-color-secondary, #64748b);
    transition: transform 0.15s;
}
.lang-backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-backdrop);
}
.lang-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: var(--z-dropdown);
    background: var(--surface-card, #fff);
    border: 1px solid var(--surface-border, #e2e8f0);
    border-radius: 16px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.14);
    padding: 0.5rem;
    min-width: 11rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.lang-option {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.55rem 0.7rem;
    border: none;
    background: none;
    border-radius: 11px;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text-color, #1e293b);
    text-align: left;
    transition:
        background 0.15s,
        color 0.15s;
}
.lang-option .lang-flag {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.lang-option:hover {
    background: var(--surface-hover, #f1f5f9);
}
.lang-option.active {
    background: color-mix(in srgb, var(--primary-color, #2563eb) 12%, transparent);
    color: var(--primary-color, #2563eb);
    font-weight: 700;
}

@media (max-width: 900px) {
    .navbar-info {
        display: none;
    }
    .lang-label,
    .lang-caret {
        display: none;
    }
    .lang-btn {
        gap: 0;
        min-width: 2.5rem;
        padding: 0 0.5rem;
    }
}

@media (max-width: 768px) {
    .layout-topbar {
        padding: 0 0.6rem;
        gap: 0.5rem;
    }
    .layout-topbar-actions {
        gap: 0.35rem;
    }
}
</style>
