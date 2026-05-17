import type { StockSocketPayload } from '@/api/webSocket/socketService'
import type { ChartRecordTuple } from './chartTime'

export interface ChartRecordSource {
  lastTradeDate: string
  lastTradeTime: string
  openingPrice: string | number
  highestPrice: string | number
  lowestPrice: string | number
  currentPrice: string | number
  currentVolume: string | number
}

export function buildChartRecord(source: ChartRecordSource): ChartRecordTuple {
  const date = source.lastTradeDate.replace(/(\d{4})[/-]?(\d{2})[/-]?(\d{2})/, '$1/$2/$3')
  return [
    date,
    String(source.lastTradeTime),
    String(source.openingPrice),
    String(source.highestPrice),
    String(source.lowestPrice),
    String(source.currentPrice),
    String(source.currentVolume)
  ]
}

export function buildChartRecordFromSocket(data: StockSocketPayload): ChartRecordTuple {
  return buildChartRecord({
    lastTradeDate: data.lastTradeDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3'),
    lastTradeTime: data.lastTradeTime,
    openingPrice: data.openingPrice,
    highestPrice: data.highestPrice,
    lowestPrice: data.lowestPrice,
    currentPrice: data.currentPrice,
    currentVolume: data.currentVolume
  })
}
