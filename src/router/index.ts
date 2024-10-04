import { createRouter, createWebHistory } from 'vue-router'

import Login from "@/views/Login/index.vue"
import Register from "@/views/Register/index.vue"



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    
  ]
})

export default router
