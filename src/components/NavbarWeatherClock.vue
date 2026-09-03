<template>
    <div class="navbar-info">
        <!-- Ob-havo va havo tozaligi (AQI) -->
        <div class="info-segment weather-segment" v-if="weather" :title="weatherDescription">
            <span class="weather-icon">{{ weatherIcon }}</span>
            <span class="weather-temp">{{ Math.round(weather.temperature) }}°C</span>
            <span class="aqi-badge" v-if="airQuality" :style="aqiStyle" :title="'Havo tozaligi (AQI): ' + airQuality.aqi + ' — ' + aqiLabel">AQI {{ airQuality.aqi }}</span>
        </div>
        <div class="info-segment weather-segment is-muted" v-else-if="loading">
            <i class="pi pi-spin pi-spinner"></i>
            <span>Ob-havo...</span>
        </div>
        <div class="info-segment weather-segment is-muted" v-else>
            <i class="pi pi-exclamation-circle"></i>
            <span>Ob-havo topilmadi</span>
        </div>

        <!-- Sana va vaqt: bitta joyda, sana ustida - vaqt ostida -->
        <div class="info-segment datetime-segment">
            <span class="date">{{ formattedDateShort }}</span>
            <span class="time"
                >{{ timeMain }}<span class="seconds">:{{ timeSeconds }}</span></span
            >
        </div>
    </div>
</template>

<script>
// Toshkent shahri koordinatalari (qat'iy belgilangan, geolokatsiya ishlatilmaydi)
const TASHKENT_LAT = 41.2995;
const TASHKENT_LON = 69.2401;

const OY_NOMLARI = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];

// Open-Meteo weathercode -> ikonka va tavsif
const WEATHER_CODES = {
    0: { icon: '☀️', label: 'Ochiq havo' },
    1: { icon: '🌤️', label: 'Asosan ochiq' },
    2: { icon: '⛅', label: 'Bulutli' },
    3: { icon: '☁️', label: 'Bulut qoplagan' },
    45: { icon: '🌫️', label: 'Tuman' },
    48: { icon: '🌫️', label: 'Muzli tuman' },
    51: { icon: '🌦️', label: "Yengil yomg'ir" },
    53: { icon: '🌦️', label: "Yomg'ir" },
    55: { icon: '🌧️', label: "Kuchli yomg'ir" },
    61: { icon: '🌧️', label: "Yomg'ir" },
    63: { icon: '🌧️', label: "O'rtacha yomg'ir" },
    65: { icon: '🌧️', label: "Kuchli yomg'ir" },
    71: { icon: '❄️', label: 'Qor' },
    73: { icon: '❄️', label: "O'rtacha qor" },
    75: { icon: '❄️', label: 'Kuchli qor' },
    80: { icon: '🌦️', label: 'Jala' },
    81: { icon: '🌧️', label: 'Kuchli jala' },
    82: { icon: '🌧️', label: 'Juda kuchli jala' },
    95: { icon: '⛈️', label: 'Momaqaldiroq' },
    96: { icon: '⛈️', label: "Do'l bilan momaqaldiroq" },
    99: { icon: '⛈️', label: "Kuchli do'l bilan momaqaldiroq" }
};

// AQI (US standarti) darajalari
const AQI_LEVELS = [
    { max: 50, label: 'Yaxshi', color: '#22c55e' },
    { max: 100, label: "O'rtacha", color: '#eab308' },
    { max: 150, label: 'Sezgir guruhlar uchun zararli', color: '#f97316' },
    { max: 200, label: 'Zararli', color: '#ef4444' },
    { max: 300, label: 'Juda zararli', color: '#a855f7' },
    { max: Infinity, label: 'Xavfli', color: '#7f1d1d' }
];

export default {
    name: 'NavbarWeatherClock',
    data() {
        return {
            now: new Date(),
            weather: null,
            airQuality: null,
            loading: true,
            timer: null,
            refreshTimer: null
        };
    },
    computed: {
        // "21.07.2026" ko'rinishidagi qisqa sana
        formattedDateShort() {
            const d = this.now;
            const kun = String(d.getDate()).padStart(2, '0');
            const oy = String(d.getMonth() + 1).padStart(2, '0');
            const yil = d.getFullYear();
            return `${kun}.${oy}.${yil}`;
        },
        // Soat:daqiqa (katta), soniya alohida (kichik) ko'rsatish uchun
        timeMain() {
            const h = String(this.now.getHours()).padStart(2, '0');
            const m = String(this.now.getMinutes()).padStart(2, '0');
            return `${h}:${m}`;
        },
        timeSeconds() {
            return String(this.now.getSeconds()).padStart(2, '0');
        },
        weatherIcon() {
            if (!this.weather) return '';
            return (WEATHER_CODES[this.weather.weathercode] || { icon: '🌡️' }).icon;
        },
        weatherDescription() {
            if (!this.weather) return '';
            return (WEATHER_CODES[this.weather.weathercode] || { label: '' }).label;
        },
        aqiLabel() {
            if (!this.airQuality) return '';
            const level = AQI_LEVELS.find((l) => this.airQuality.aqi <= l.max);
            return level ? level.label : '';
        },
        aqiStyle() {
            if (!this.airQuality) return {};
            const level = AQI_LEVELS.find((l) => this.airQuality.aqi <= l.max);
            const color = level ? level.color : '#6b7280';
            return {
                backgroundColor: color + '22',
                color: color,
                border: `1px solid ${color}55`
            };
        }
    },
    methods: {
        updateClock() {
            this.now = new Date();
        },
        async fetchWeather() {
            this.loading = true;
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${TASHKENT_LAT}&longitude=${TASHKENT_LON}&current_weather=true`;
                const res = await fetch(url);
                const data = await res.json();
                this.weather = data.current_weather;
            } catch (e) {
                console.error("Ob-havo ma'lumotini olishda xatolik:", e);
                this.weather = null;
            } finally {
                this.loading = false;
            }
        },
        async fetchAirQuality() {
            try {
                const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${TASHKENT_LAT}&longitude=${TASHKENT_LON}&current=us_aqi`;
                const res = await fetch(url);
                const data = await res.json();
                this.airQuality = { aqi: data.current.us_aqi };
            } catch (e) {
                console.error("Havo tozaligi (AQI) ma'lumotini olishda xatolik:", e);
                this.airQuality = null;
            }
        }
    },
    mounted() {
        this.timer = setInterval(this.updateClock, 1000);
        this.fetchWeather();
        this.fetchAirQuality();
        // Ob-havo va AQI har 10 daqiqada yangilanadi
        this.refreshTimer = setInterval(
            () => {
                this.fetchWeather();
                this.fetchAirQuality();
            },
            10 * 60 * 1000
        );
    },
    beforeUnmount() {
        clearInterval(this.timer);
        clearInterval(this.refreshTimer);
    }
};
</script>

<style scoped>
.navbar-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
}

/* Topbar'dagi tugmalar bilan bir xil balandlik/rang tili — och/tun/tizim
   mavzusiga PrimeVue Aura o'zgaruvchilari orqali avtomatik moslashadi. */
.info-segment {
    display: inline-flex;
    align-items: center;
    height: 2.5rem;
    padding: 0 0.75rem;
    gap: 0.4rem;
    background: var(--surface-card, #fff);
    border-radius: 12px;
    color: var(--text-color, #1e293b);
    font-size: 0.85rem;
}

.weather-segment.is-muted {
    color: var(--text-color-secondary, #64748b);
    font-style: italic;
    font-size: 0.8rem;
}

.weather-icon {
    font-size: 1.1rem;
    line-height: 1;
}

.weather-temp {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
}

.aqi-badge {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.15rem 0.45rem;
    border-radius: 999px;
    white-space: nowrap;
    letter-spacing: 0.01em;
}

.datetime-segment {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: auto;
    min-height: 2.5rem;
    padding: 0.3rem 0.9rem;
    gap: 0;
    line-height: 1.25;
    color: var(--text-color-secondary, #64748b);
}

.datetime-segment .date {
    font-size: 0.7rem;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    opacity: 0.85;
}

.datetime-segment .time {
    font-size: 0.95rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--primary-color, #2f80ed);
}

.datetime-segment .seconds {
    font-size: 0.8rem;
    font-weight: 500;
    opacity: 0.75;
}

@media (max-width: 768px) {
    .weather-segment .weather-temp,
    .aqi-badge {
        display: none;
    }
    .weather-segment {
        padding: 0 0.55rem;
    }
}

@media (max-width: 640px) {
    .datetime-segment .date {
        display: none;
    }
}
</style>
