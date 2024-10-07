import { createRouter, createWebHistory } from 'vue-router'

import Login from "@/views/Login/index.vue"
import Register from "@/views/Register/index.vue"
import Layout from "@/views/Layout/index.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter(to, from, next){
        if (localStorage.getItem('token')){
          next('/')
        }else{
          next()
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      beforeEnter(to, from, next){
        if (localStorage.getItem('token')){
          next('/')
        }else{
          next()
        }
      }
    },
    
  ]
})

router.beforeEach((to, from ,next)=>{
  let isLogin = false
  if (localStorage.getItem("token") != null){
    isLogin = true
  }else{
    isLogin = false
  }
  if (isLogin || to.path === "/login" || to.path === "/register"){
    next()
  }else{
    next("/login")
  }
})

export default router
