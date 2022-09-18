import { createApp, h } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'vfonts/Lato.css';
import 'vfonts/FiraCode.css';
import i18n from './i18n';
import { AxiosKey } from './symbols';
import apiClient from './axios';
import { useRefillStore } from '@/stores/refill';

const app = createApp({
  setup() {
    const { getLastRefill } = useRefillStore();
    getLastRefill();
  },
  render: () => h(App),
});

app.use(createPinia());
app.use(router);
app.use(i18n);

app.provide(AxiosKey, apiClient);

app.mount('#app');
