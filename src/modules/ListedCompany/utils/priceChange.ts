import { EMPTY } from '../constants/stockFields'
import type { StockData } from '../model/interface'

export type PriceDirection = 'up' | 'down' | 'flat'

export interface PriceChange {
  percent: string
  points: string
  direction: PriceDirection
}

export function computeDisplayPrice(stockData: StockData): string {
  const price = stockData.currentPrice || stockData.previousClose
  return price && price !== EMPTY ? price : EMPTY
}

export function computePriceChange(stockData: StockData): PriceChange {
  const current = Number(stockData.currentPrice || stockData.previousClose)
  const previous = Number(stockData.previousClose)
  if (!previous || Number.isNaN(current) || Number.isNaN(previous)) {
    return { percent: EMPTY, points: EMPTY, direction: 'flat' }
  }
  const diff = current - previous
  const percent = (diff / previous) * 100
  return {
    percent: Math.abs(percent).toFixed(2),
    points: Math.abs(diff).toFixed(2),
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'
  }
}

export function formatPriceChangeLabel(change: PriceChange): string {
  if (change.direction === 'flat' || change.percent === EMPTY) {
    return `${change.percent}%`
  }
  const sign = change.direction === 'up' ? '+' : '−'
  return `${sign}${change.percent}%`
}
