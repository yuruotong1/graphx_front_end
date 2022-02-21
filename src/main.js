import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import eIconPicker from 'e-icon-picker';
import "e-icon-picker/lib/symbol.js"; //基本彩色图标库
import 'e-icon-picker/lib/index.css'; // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css'; //font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css'; //element-ui 图标库

Vue.config.productionTip = false
// axios.defaults.baseURL="http://47.104.28.107:8888"
axios.defaults.baseURL="http://localhost:8888"
Vue.use(VueAxios,axios);
Vue.use(eIconPicker, {
  FontAwesome: false,
  ElementUI: false,
  eIcon: true,//自带的图标，来自阿里妈妈
  eIconSymbol: false,//是否开启彩色图标
  addIconList: [],
  removeIconList: [],
  zIndex: 3100//选择器弹层的最低层,全局配置
});
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
