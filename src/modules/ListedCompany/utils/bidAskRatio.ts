import { firstLevelPrice } from './orderBook'
import { parseNumeric } from './stockFormatters'

export type TradeSide = 'inner' | 'outer'

export interface BidAskRatio {
  innerPct: number
  outerPct: number
}

export function computeBidAskRatio(innerLots: number, outerLots: number): BidAskRatio | null {
  const total = innerLots + outerLots
  if (total <= 0) return null
  const innerPct = (innerLots / total) * 100
  return {
    innerPct,
    outerPct: 100 - innerPct
  }
}

export function classifyTradeSide(
  price: number,
  bestBid: number | null,
  bestAsk: number | null,
  referencePrice: number | null
): TradeSide | null {
  if (bestBid !== null && price <= bestBid) return 'inner'
  if (bestAsk !== null && price >= bestAsk) return 'outer'
  if (referencePrice !== null) {
    return price >= referencePrice ? 'outer' : 'inner'
  }
  return null
}

export function createBidAskVolumeTracker() {
  let stockCode = ''
  let lastAccumulatedVolume: number | null = null
  let innerLots = 0
  let outerLots = 0

  const reset = (code: string) => {
    stockCode = code
    lastAccumulatedVolume = null
    innerLots = 0
    outerLots = 0
  }

  const accumulate = (raw: Record<string, string>) => {
    const code = raw.c || ''
    if (code && code !== stockCode) {
      reset(code)
    }

    const accumulated = parseNumeric(raw.v)
    const priceRaw = raw.z !== '-' ? raw.z : raw.y
    const price = parseNumeric(priceRaw)
    const bestBid = firstLevelPrice(raw.b)
    const bestAsk = firstLevelPrice(raw.a)
    const reference = parseNumeric(raw.y)

    if (accumulated === null || price === null) return

    if (lastAccumulatedVolume === null) {
      lastAccumulatedVolume = accumulated
      return
    }

    const delta = accumulated - lastAccumulatedVolume
    lastAccumulatedVolume = accumulated
    if (delta <= 0) return

    const side = classifyTradeSide(price, bestBid, bestAsk, reference)
    if (side === 'inner') innerLots += delta
    else if (side === 'outer') outerLots += delta
  }

  return {
    get innerLots() {
      return innerLots
    },
    get outerLots() {
      return outerLots
    },
    reset,
    accumulate
  }
}
