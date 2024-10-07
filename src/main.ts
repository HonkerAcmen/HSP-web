
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'element-plus/dist/index.css'

import ElementPlus from 'element-plus'

import App from './App.vue'
import router from './router'

import "/public/css/basic.css"



const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)


app.mount('#app')
