import service from '../index'

interface QueryParams {
  [key: string]: any
}

// export function getStockInfoFromTickers(queryParams: QueryParams) {
//   return service({
//     method: 'GET',
//     url: '/ticker',
//     params: queryParams
//   })
// }

export function getStockInfo(queryParams: QueryParams) {
  return service({
    method: 'GET',
    url: '/stock',
    params: queryParams
  })
}

export function getRealTimeStockInfo(type: 'tse' | 'otc', code: string) {
  return service({
    method: 'GET',
    url: `/api/stock/getStockInfo.jsp?ex_ch=${type}_${code}.tw`
  })
}
