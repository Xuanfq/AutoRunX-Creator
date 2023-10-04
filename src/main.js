import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/icon/iconfont.css"
import locale from 'element-ui/lib/locale/lang/zh-CN'
import './plugins/element.js'
import './registerServiceWorker'
import axios from 'axios'

Vue.use(ElementUI, {locale})


Vue.config.productionTip = false

Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
