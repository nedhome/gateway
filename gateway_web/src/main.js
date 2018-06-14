import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import axios from 'axios';
import routes from './router/router'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('token');
  }
  let token = sessionStorage.getItem('token');
  if (!token && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

axios.interceptors.request.use(
  config => {
    const token = 'this is a token';
    if (token) {
      config.headers.Authorization = token;
    }
    return config
  },
  error => {
    return Promise.reject(error)
  });

Vue.prototype.$ajax = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

