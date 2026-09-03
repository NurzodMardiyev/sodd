import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@/plugins/fontawesome';

import '@/assets/styles.scss';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.directive('tooltip', Tooltip);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
