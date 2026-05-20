import { createApp } from 'vue'
import router from '@/router/router.ts'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
// My custom CSS. This must be last imported, so it can override the default styles of Element Plus and Tailwind CSS if needed.
import './assets/main.css'
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.use(createPinia());
app.use(VueApexCharts);
app.mount('#app');
