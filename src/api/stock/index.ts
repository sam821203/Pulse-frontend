import service from '../index'

interface StockInfo {
  _id: string
  createdAt: string
  industry: string
  market: string
  name: string
  symbol: string
  updatedAt: string
}

// export function getStockInfoFromTickers(queryParams: QueryParams) {
//   return service({
//     method: 'GET',
//     url: '/ticker',
//     params: queryParams
//   })
// }

export function getStockInfo(queryParams?: StockInfo): Promise<StockInfo> {
  return service({
    method: 'GET',
    url: '/stock',
    params: queryParams
  })
}

export async function getRealTimeStockInfo(type: 'tse' | 'otc', code: string) {
  return await fetch(`/twse/getStockInfo.jsp?ex_ch=${type}_${code}.tw`)
}
