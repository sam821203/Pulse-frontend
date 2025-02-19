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

/**
 * 上市股票基本資料
 */
export async function getListedCompanyOpenData() {
  const resp = await fetch(`/twse/openapi/opendata/t187ap03_L`)
  return resp.json()
}

/**
 * 上櫃股票基本資料
 */
export async function getOTCOpenData() {
  const resp = await fetch(`/tpex/openapi/mopsfin_t187ap03_O`)
  return resp.json()
}
