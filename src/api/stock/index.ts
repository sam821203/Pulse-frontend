import service from '../index'
import type { ListedCompanyData, OTCCompanyData } from '@/modules/ListedCompany/model/interface'
import type {
  ApiResponse,
  StockListItem,
  StockSearchQuery,
  TickerInfo,
  TickerQueryParams,
  TwseRealTimeResponse
} from './types'

export type {
  ApiResponse,
  StockListItem,
  StockSearchQuery,
  TickerInfo,
  TickerQueryParams
} from './types'

export function getEquitiesValuesFromTickers(
  queryParams: TickerQueryParams
): Promise<TickerInfo> {
  return service({
    method: 'GET',
    url: '/ticker',
    params: queryParams
  })
}

export function getStockInfo(): Promise<ApiResponse<StockListItem[]>>
export function getStockInfo(
  queryParams: StockSearchQuery
): Promise<ApiResponse<StockListItem | StockListItem[]>>
export function getStockInfo(
  queryParams?: StockSearchQuery
): Promise<ApiResponse<StockListItem | StockListItem[]>> {
  return service({
    method: 'GET',
    url: '/stock',
    params: queryParams
  })
}

export async function getRealTimeStockInfo(
  type: 'tse' | 'otc',
  code: string
): Promise<TwseRealTimeResponse> {
  const resp = await fetch(`/twse/getStockInfo.jsp?ex_ch=${type}_${code}.tw`)
  return resp.json() as Promise<TwseRealTimeResponse>
}

export async function getCategoryInfo(type: 'tse' | 'otc', code?: string) {
  const resp = await fetch(`/twse/getCategory.jsp?ex=${type}&i=${code}`)
  return resp.json() as Promise<Record<string, unknown>>
}

/**
 * 上市股票基本資料
 * https://openapi.twse.com.tw/
 */
export async function getListedCompanyOpenData(): Promise<ListedCompanyData[]> {
  const resp = await fetch(`/openapi-twse/opendata/t187ap03_L`)
  return resp.json() as Promise<ListedCompanyData[]>
}

/**
 * 上櫃股票基本資料
 * https://www.tpex.org.tw/openapi/
 */
export async function getOTCOpenData(): Promise<OTCCompanyData[]> {
  const resp = await fetch(`/openapi-tpex/mopsfin_t187ap03_O`)
  return resp.json() as Promise<OTCCompanyData[]>
}

/**
 * 個股資料
 * https://github.com/asd8651/stock/blob/master/%E8%82%A1%E5%B8%82API.txt
 */
export async function getTest() {
  const resp = await fetch(`/exchangeReport/FMSRFK?date=20250203&stockNo=2330`)
  return resp.json() as Promise<Record<string, unknown>>
}

export function getStockInfoRealTime(queryParams: string): Promise<unknown> {
  return service({
    method: 'GET',
    url: `/stocks`,
    params: queryParams
  })
}
