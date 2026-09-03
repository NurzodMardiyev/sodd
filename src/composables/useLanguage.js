import { ref, watch } from 'vue';

// Butun ilova bo'yicha bitta manba (singleton) — AppTopbar'dagi til almashtirgich va
// App.vue'dagi PrimeVue calendar/locale konfiguratsiyasi shu bitta ref'ni ishlatadi,
// shu bois til o'zgarganda ikkalasi ham birga sinxron yangilanadi.
const STORAGE_KEY = 'appLang';

export const currentLang = ref(localStorage.getItem(STORAGE_KEY) || 'uz');

watch(
    currentLang,
    (code) => {
        localStorage.setItem(STORAGE_KEY, code);
        document.documentElement.lang = code;
    },
    { immediate: true }
);

export function setLanguage(code) {
    currentLang.value = code;
}

export function useLanguage() {
    return { currentLang, setLanguage };
}