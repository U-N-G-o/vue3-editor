import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  base: '/vue3-editor',
  routes: [{
    path: '/vue3-editor',
    name: 'Home',
    component: Home
  }]
})

export default router
