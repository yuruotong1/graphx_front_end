import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
// axios.defaults.baseURL="http://47.104.28.107:8888"
// axios.defaults.baseURL="http://localhost:8888"
axios.defaults.baseURL="http://graph:8888"
Vue.use(VueAxios,axios);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


