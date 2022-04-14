import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    props: true,
    component: Home,
    meta:{        
      keepAlive:true   // 需要缓存的页面
    }

  }
]

const router = new VueRouter({
  routes
})

export default router
