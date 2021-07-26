import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
// import { Button } from 'vant'
import 'normalize.css'
// import 'vant/lib/index.css'
// import animated from 'animate.css'
// Vue
// import 'animate.css'
import '@/assets/style/global.scss'

const app = createApp(App)
// app.use(Button)
app.use(router).mount('#app')
