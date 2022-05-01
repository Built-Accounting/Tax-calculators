import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import payroll from "../views/Payroll.vue";
import VatView from "../views/VatView.vue";
import vatCalculator from "../views/VatCalculator.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/gross-to-net',
      name: 'GrossToNet',
      component: payroll
    },
    {
      path: '/vat',
      name: 'vat',
      component: VatView
    },
    {
      path: '/vat/:country_code',
      name: 'vat_calculator',
      component: vatCalculator
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
