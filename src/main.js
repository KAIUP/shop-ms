import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'

import axios from 'axios'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
  //axios请求拦截
axios.interceptors.request.use(config => {
  //需要授权的 api 需要在请求头中设置Authorization字段并提供 token 令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')