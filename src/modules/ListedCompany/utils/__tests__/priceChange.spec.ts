import { describe, expect, it } from 'vitest'
import { EMPTY } from '../../constants/stockFields'
import type { StockData } from '../../model/interface'
import {
  computeDisplayPrice,
  computePriceChange,
  formatPriceChangeLabel,
  formatPriceChangePercentDisplay
} from '../priceChange'

const baseStock: StockData = {
  currentPrice: '110',
  previousClose: '100'
}

describe('priceChange utils', () => {
  it('computeDisplayPrice prefers current price', () => {
    expect(computeDisplayPrice(baseStock)).toBe('110')
  })

  it('computeDisplayPrice falls back to previous close', () => {
    expect(computeDisplayPrice({ previousClose: '99' })).toBe('99')
  })

  it('computeDisplayPrice returns EMPTY when no price', () => {
    expect(computeDisplayPrice({})).toBe(EMPTY)
  })

  it('computePriceChange reports up move', () => {
    const change = computePriceChange(baseStock)
    expect(change.direction).toBe('up')
    expect(change.points).toBe('10.00')
    expect(change.percent).toBe('10.00')
  })

  it('computePriceChange reports flat when previous close missing', () => {
    const change = computePriceChange({ currentPrice: '50' })
    expect(change.direction).toBe('flat')
    expect(change.percent).toBe(EMPTY)
  })

  it('formatPriceChangeLabel prefixes sign for up moves', () => {
    expect(formatPriceChangeLabel(computePriceChange(baseStock))).toBe('+10.00%')
  })

  it('formatPriceChangePercentDisplay wraps percent in parentheses', () => {
    expect(formatPriceChangePercentDisplay(computePriceChange(baseStock))).toBe('(+10.00%)')
  })

  it('formatPriceChangePercentDisplay returns empty when percent is EMPTY', () => {
    expect(
      formatPriceChangePercentDisplay({
        percent: EMPTY,
        points: EMPTY,
        direction: 'flat'
      })
    ).toBe('')
  })
})
