import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const StockView = () => import('@/views/StockView.vue')
const ErrorView = () => import('@/views/ErrorView.vue')
const DefaultLayout = () => import('@/layout/DefaultLayout.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DefaultLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView
        },
        // {
        //   path: '/about',
        //   name: 'about',
        //   component: () => import('../views/AboutView.vue')
        // },
        {
          path: '/stock',
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
    }
    // {
    //   path: '/:pathMatch(.*)',
    //   name: 'notFound',
    //   component: ErrorView,
    //   redirect: '/error'
    // }
    // {
    //   path: '/commonComponents',
    //   name: 'commonComponents',
    //   component: CommonComponentsView
    // },
  ]
})

export default router
