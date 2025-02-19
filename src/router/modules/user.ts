const USER_PROFILE = () => import('@/modules/User/pages/MainPage.vue')

export const UserRoute = [
  {
    path: '/user-profile',
    name: 'userProfile',
    component: USER_PROFILE,
    meta: { title: '個人檔案', hidden: true, permission: 'userProfile:view' }
  }
]
