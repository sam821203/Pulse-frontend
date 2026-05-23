import { EMPTY } from '../constants/stockFields'
import type { StockData } from '../model/interface'
import { parseNumeric } from './stockFormatters'

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
  const current =
    parseNumeric(stockData.currentPrice) ?? parseNumeric(stockData.previousClose)
  const previous = parseNumeric(stockData.previousClose)
  if (current === null || previous === null || previous === 0) {
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

/** Parenthesized percent for detail header (e.g. `(+1.23%)`). */
export function formatPriceChangePercentDisplay(change: PriceChange): string {
  if (change.percent === EMPTY) return ''
  if (change.direction === 'flat') return `(${change.percent}%)`
  const sign = change.direction === 'up' ? '+' : '−'
  return `(${sign}${change.percent}%)`
}
