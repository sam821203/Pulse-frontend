import type { ChartRecordTuple } from '../utils/chartTime'

export interface OrderBookLevel {
  price: number
  volume: number
}

export interface OrderBookRow {
  bidVolume: number
  bidPrice: number
  askPrice: number
  askVolume: number
  highlightBid: boolean
  highlightAsk: boolean
}

export interface OrderBookView {
  rows: OrderBookRow[]
  totalBidVolume: number
  totalAskVolume: number
  maxVolume: number
}

export interface StockData {
  sellVolume?: string
  marketType?: string
  buyVolume?: string
  lastTradeDate?: string
  buyPrice?: string
  stockCode?: string
  sellPrice?: string
  companyShortName?: string
  openingPrice?: string
  lowestPrice?: string
  highestPrice?: string
  downLimitPrice?: string
  accumulatedVolume?: string
  upLimitPrice?: string
  lastTradeTime?: string
  currentVolume?: string
  companyName?: string
  currentPrice?: string
  previousClose?: string
  issueShares?: string
  innerVolume?: string
  outerVolume?: string
}

export interface ListedCompanyData {
  公司代號: string
  實收資本額: string
}

export interface OTCCompanyData {
  SecuritiesCompanyCode: string
  IssueShares: string
}

export interface ChartScaleData {
  lastTradeDate: string
  lastTradeTime: string
  openingPrice: string
  highestPrice: string
  lowestPrice: string
  currentPrice: string
  currentVolume: string
}

export interface ChartData {
  data: ChartRecordTuple[]
}
