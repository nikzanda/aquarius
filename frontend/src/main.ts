import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'vfonts/Lato.css';
import 'vfonts/FiraCode.css';
import i18n from './i18n';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);
app.use(i18n);

app.mount('#app');
