const OVER_THE_COUNTER = () => import('@/modules/OverTheCounter/pages/MainPage.vue')
// const LISTED_COMPANY_DETAIL = () => import('@/modules/ListedCompany/pages/DetailPage.vue')

export const OverTheCounterRoute = [
  {
    path: '/overTheCounter',
    name: 'OverTheCounter',
    component: OVER_THE_COUNTER,
    meta: { title: '上櫃股票' }
    // children: [
    //   {
    //     path: 'detail',
    //     name: 'listedCompanyDetail',
    //     component: LISTED_COMPANY_DETAIL,
    //     meta: { title: '上市股票個別' }
    //   }
    // ]
  }
]
