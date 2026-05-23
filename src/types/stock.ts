/** Static stock row from GET /stock (list or search). */
export interface StockListItem {
  symbol: string
  name: string
  market?: string
  industry?: string | string[]
}

export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

export type StockSearchQuery = { symbol: string } | { name: string }

export interface TickerQueryParams {
  symbol: string
  name: string
  date: string
}

export interface TwseRealTimeResponse {
  msgArray?: Record<string, string>[]
}

export interface TickerInfo {
  symbol?: string
  name?: string
  date?: string
  peRatio?: number
  pbRatio?: number
  dividendYield?: number
  dividendYear?: number
  fiscalYearQuarter?: string
  dividendPerShare?: number
}
