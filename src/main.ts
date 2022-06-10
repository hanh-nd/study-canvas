import { createApp } from 'vue';
import App from './App.vue';
import VueKonva from 'vue-konva';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

createApp(App).use(ElementPlus).use(VueKonva).mount('#app');
