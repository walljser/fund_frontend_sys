import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueSignin from '@/plugins/signin'
import VueRouter from 'vue-router'
import VueScroll from 'vue-scroll'
import store from '@/store'
import Vuex from 'vuex'
import axios from 'axios'
import storage from '@/utils/storage'
import routes from './routes'
import '@/assets/scss/_base.scss'
import '@/assets/scss/font-awesome.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueSignin)
Vue.use(Vuex)
Vue.use(VueScroll)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/signin') {
    storage.removeSession('clientId')
    storage.removeSession('token')
  }
  let clientId = storage.getSession('clientId')
  let token = storage.getSession('token')
  if (!clientId && to.path == '/financial') {
    next({ name: 'signin' })
  } else if (!clientId && to.path == '/userCenter') {
    next({ name: 'signin' })
  } else {
    next()
  }
})

// axios.interceptors.request.use(function (config) {
//   console.log(config)
//   config.headers.token = 'xjojaf'
//   return config
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error)
// })

axios.interceptors.response.use(function (response) {
  return response.data
}, function(error) {
  return Promise.reject(error)
})

//router.afterEach(transition => {
//NProgress.done();
//});

var v = new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

axios.interceptors.response.use(function (response) {
  if (response.resultcode === -2) {
    v.$message({
      message: '您的登录已过期，请重新登录',
      type: 'error'
    })
    v.$store.commit('SIGN_OUT')
    v.$router.push({ name: 'home' })
  } else {
    return response
  }
}, function(error) {
  return Promise.reject(error)
})
