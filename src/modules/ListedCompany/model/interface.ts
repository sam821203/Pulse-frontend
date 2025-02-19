export interface StockData {
  sellVolume: string
  marketType: string
  buyVolume: string
  lastTradeDate: string
  buyPrice: string
  stockCode: string
  sellPrice: string
  companyShortName: string
  openingPrice: string
  lowestPrice: string
  highestPrice: string
  downLimitPrice: string
  accumulatedVolume: string
  upLimitPrice: string
  lastTradeTime: string
  currentVolume: string
  companyName: string
  currentPrice: string
  previousClose: string
  issueShares: string
}

export interface ListedCompanyData {
  公司代號: string
  實收資本額: string
}

export interface OTCCompanyData {
  SecuritiesCompanyCode: string
  IssueShares: string
}
