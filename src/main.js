import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/icon/iconfont.css"
import i18n from '@/lang'
import store from '@/store'
import './plugins/element.js'
import './registerServiceWorker'
import axios from 'axios'
import VueMarkdown from 'vue-markdown';

Vue.component('VueMarkdown', VueMarkdown)

Vue.config.productionTip = false

Vue.prototype.$axios = axios

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title == undefined ? 'AutoRunX' : to.meta.title
  next();
})

// global functions
const gfunc = {
  changeLang: (lang) => {
    i18n.locale = lang
    store.commit('lang', lang)
  }
}

Vue.prototype.$gfunc=gfunc

new Vue({
  ElementUI,
  router,
  i18n,
  store,
  render: h => h(App),
}).$mount('#app')
