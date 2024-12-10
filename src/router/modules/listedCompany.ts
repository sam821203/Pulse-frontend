const LISTED_COMPANY = () => import('@/modules/ListedCompany/pages/MainPage.vue')

export const ListedCompanyRoute = [
  {
    path: '/listedCompany',
    name: 'listedCompany',
    component: LISTED_COMPANY,
    meta: { title: '上市股票' }
  }
]
