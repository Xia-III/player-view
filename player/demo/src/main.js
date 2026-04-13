import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引入pinia
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
const pinia = createPinia()

const app = createApp(App);
// pinia数据持久化插件：
pinia.use(piniaPluginPersist)

// h5rem适配
import 'amfe-flexible'

import './base/css/normalize.less'
/* 引入vant */
import Vant from 'vant'
import 'vant/lib/index.css';

// 将connection挂载，然后实现与服务器实时通讯
import connection from './utils/signalR'
app.config.globalProperties.$connection = connection

app.use(router).use(Vant).use(pinia).mount('#app')
