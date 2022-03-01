import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'

var baseURL="http://120.27.201.81:8888";
if (process.env.NODE_ENV == "LOCAL") {
  baseURL = process.env.VUE_APP_SERVER_URL; 
}
Vue.prototype.GLOBAL = {"BASE_URL": baseURL};
Vue.config.productionTip = false
// axios.defaults.baseURL="http://120.27.201.81:8888"
axios.defaults.baseURL=baseURL;
Vue.use(VueAxios,axios);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


