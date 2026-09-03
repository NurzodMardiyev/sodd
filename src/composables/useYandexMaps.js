// ---------------------------------------------------------------------------
// Yandex Maps JS API (2.1) skriptini bir marta yuklab, `window.ymaps` tayyor
// bo'lgach uni qaytaradi. Bir nechta komponent parallel chaqirsa ham (masalan
// bir xil sahifada ikkita xarita) skript faqat bir marta qo'shiladi — natija
// promise sifatida keshlanadi.
// ---------------------------------------------------------------------------
const API_KEY = '8b727ab9-3ed1-443d-9e91-b73b56ab94fa';

let loadPromise = null;

export function loadYandexMaps(lang = 'uz_UZ') {
    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve, reject) => {
        if (window.ymaps) {
            window.ymaps.ready(() => resolve(window.ymaps));
            return;
        }
        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=${lang}`;
        script.async = true;
        script.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
        script.onerror = () => reject(new Error("Yandex Maps skriptini yuklab bo'lmadi"));
        document.head.appendChild(script);
    });

    return loadPromise;
}
