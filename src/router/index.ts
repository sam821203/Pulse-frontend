import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const StockView = () => import('@/views/StockView.vue')
const ErrorView = () => import('@/views/ErrorView.vue')
const DefaultLayout = () => import('@/layout/DefaultLayout.vue')

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: HomeView
      },
      {
        path: 'stock',
        name: 'stock',
        component: StockView
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/error',
    name: 'error',
    component: ErrorView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: ErrorView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
