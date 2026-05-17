import type { StockData } from '../model/interface'

export const EMPTY = '—'

export const fieldGroups: { title: string; keys: (keyof StockData)[] }[] = [
  {
    title: '交易',
    keys: [
      'lastTradeDate',
      'lastTradeTime',
      'accumulatedVolume',
      'currentVolume',
      'marketType',
      'stockCode',
      'companyName'
    ]
  },
  {
    title: '五檔',
    keys: ['buyPrice', 'buyVolume', 'sellPrice', 'sellVolume']
  }
]

export const fieldLabels: Partial<Record<keyof StockData, string>> = {
  sellVolume: '揭示賣量',
  marketType: '上市別',
  buyVolume: '揭示買量',
  lastTradeDate: '最近交易日期',
  buyPrice: '揭示買價',
  stockCode: '股票代號',
  sellPrice: '揭示賣價',
  openingPrice: '開盤價',
  lowestPrice: '最低價',
  highestPrice: '最高價',
  downLimitPrice: '跌停價',
  upLimitPrice: '漲停價',
  currentVolume: '當盤成交量',
  companyName: '公司全名',
  currentPrice: '當盤成交價',
  previousClose: '昨收價'
}

export function createEmptyStockData(): StockData {
  return {
    sellVolume: '',
    marketType: '',
    buyVolume: '',
    lastTradeDate: '',
    buyPrice: '',
    stockCode: '',
    sellPrice: '',
    companyShortName: '',
    openingPrice: '',
    lowestPrice: '',
    highestPrice: '',
    downLimitPrice: '',
    accumulatedVolume: '',
    upLimitPrice: '',
    lastTradeTime: '',
    currentVolume: '',
    companyName: '',
    currentPrice: '',
    previousClose: '',
    issueShares: '',
    innerVolume: '',
    outerVolume: ''
  }
}
