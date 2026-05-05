import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
// My custom CSS. This must be last imported, so it can override the default styles of Element Plus and Tailwind CSS if needed.
import './assets/main.css'

const app = createApp(App);
app.use(ElementPlus).mount('#app')
