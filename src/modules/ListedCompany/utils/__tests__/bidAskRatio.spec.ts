import { describe, expect, it } from 'vitest'
import {
  classifyTradeSide,
  computeBidAskRatio
} from '../bidAskRatio'

describe('bidAskRatio utils', () => {
  it('computeBidAskRatio splits inner and outer percentages', () => {
    expect(computeBidAskRatio(30, 70)).toEqual({ innerPct: 30, outerPct: 70 })
  })

  it('computeBidAskRatio returns null when total is zero', () => {
    expect(computeBidAskRatio(0, 0)).toBeNull()
  })

  it('classifyTradeSide returns inner at or below best bid', () => {
    expect(classifyTradeSide(100, 100, 105, null)).toBe('inner')
  })

  it('classifyTradeSide returns outer at or above best ask', () => {
    expect(classifyTradeSide(105, 100, 105, null)).toBe('outer')
  })
})
