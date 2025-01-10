import service from '../index'

interface StockInfo {
  _id: string
  createdAt: string
  industry: string
  market: string
  name: string
  symbol: string
  updatedAt: string
  dividendYear?: number
  dividendYield?: number
  fiscalYearQuarter?: string
  pbRatio?: number
  peRatio?: number
}

export function getEquitiesValuesFromTickers(queryParams: any): Promise<StockInfo> {
  return service({
    method: 'GET',
    url: '/ticker',
    params: queryParams
  })
}

export function getStockInfo(queryParams?: StockInfo): Promise<StockInfo> {
  return service({
    method: 'GET',
    url: '/stock',
    params: queryParams
  })
}

export async function getRealTimeStockInfo(type: 'tse' | 'otc', code: string) {
  const resp = await fetch(`/twse/getStockInfo.jsp?ex_ch=${type}_${code}.tw`)
  return resp.json()
}

export async function getCategoryInfo(type: 'tse' | 'otc', code?: string) {
  const resp = await fetch(`/twse/getCategory.jsp?ex=${type}&i=${code}`)
  return resp.json()
}
