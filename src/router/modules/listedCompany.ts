const LISTED_COMPANY = () => import('@/modules/ListedCompany/pages/MainPage.vue')
const LISTED_COMPANY_DETAIL = () => import('@/modules/ListedCompany/pages/DetailPage.vue')

export const ListedCompanyRoute = [
  {
    path: '/listedCompany',
    name: 'listedCompany',
    component: LISTED_COMPANY,
    meta: { title: '上市股票清單' }
  },
  {
    path: '/listedCompany/detail',
    name: 'listedCompanyDetail',
    component: LISTED_COMPANY_DETAIL,
    meta: { title: '上市股票個別' }
  }
]
