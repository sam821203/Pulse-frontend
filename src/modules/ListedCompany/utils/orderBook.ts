import type { OrderBookLevel, OrderBookRow, OrderBookView } from '../model/interface'
import { parseNumeric } from './stockFormatters'

const LEVEL_COUNT = 5

function splitLevels(raw: string | undefined): string[] {
  if (!raw) return []
  return raw.split('_').filter((part) => part && part !== '-')
}

export function parseLevels(pricesRaw: string | undefined, volumesRaw: string | undefined): OrderBookLevel[] {
  const prices = splitLevels(pricesRaw)
  const volumes = splitLevels(volumesRaw)
  const count = Math.min(LEVEL_COUNT, Math.max(prices.length, volumes.length))

  const levels: OrderBookLevel[] = []
  for (let i = 0; i < count; i++) {
    const price = parseNumeric(prices[i])
    const volume = parseNumeric(volumes[i])
    if (price === null) continue
    levels.push({
      price,
      volume: volume ?? 0
    })
  }
  return levels
}

export function maxVolumeInBook(bids: OrderBookLevel[], asks: OrderBookLevel[]): number {
  const volumes = [...bids, ...asks].map((level) => level.volume)
  return volumes.length > 0 ? Math.max(...volumes) : 0
}

export function findNearTradeLevelIndex(
  levels: OrderBookLevel[],
  tradePrice: number | null,
  side: 'bid' | 'ask'
): number {
  if (tradePrice === null || levels.length === 0) return -1

  let bestIndex = 0
  let bestDistance = Number.POSITIVE_INFINITY

  levels.forEach((level, index) => {
    const distance = Math.abs(level.price - tradePrice)
    const isBetter =
      distance < bestDistance ||
      (distance === bestDistance &&
        side === 'bid' &&
        level.price > (levels[bestIndex]?.price ?? 0)) ||
      (distance === bestDistance &&
        side === 'ask' &&
        level.price < (levels[bestIndex]?.price ?? Number.POSITIVE_INFINITY))

    if (isBetter) {
      bestDistance = distance
      bestIndex = index
    }
  })

  return bestIndex
}

export function parseOrderBook(
  buyPricesRaw: string | undefined,
  buyVolumesRaw: string | undefined,
  sellPricesRaw: string | undefined,
  sellVolumesRaw: string | undefined,
  tradePrice: number | null
): OrderBookView {
  const bids = parseLevels(buyPricesRaw, buyVolumesRaw)
  const asks = parseLevels(sellPricesRaw, sellVolumesRaw)
  const rowCount = Math.max(bids.length, asks.length, 0)
  const highlightBidIndex = findNearTradeLevelIndex(bids, tradePrice, 'bid')
  const highlightAskIndex = findNearTradeLevelIndex(asks, tradePrice, 'ask')

  const rows: OrderBookRow[] = []
  for (let i = 0; i < rowCount; i++) {
    const bid = bids[i]
    const ask = asks[i]
    rows.push({
      bidVolume: bid?.volume ?? 0,
      bidPrice: bid?.price ?? 0,
      askPrice: ask?.price ?? 0,
      askVolume: ask?.volume ?? 0,
      highlightBid: i === highlightBidIndex,
      highlightAsk: i === highlightAskIndex
    })
  }

  const totalBidVolume = bids.reduce((sum, level) => sum + level.volume, 0)
  const totalAskVolume = asks.reduce((sum, level) => sum + level.volume, 0)

  return {
    rows,
    totalBidVolume,
    totalAskVolume,
    maxVolume: maxVolumeInBook(bids, asks)
  }
}

export function firstLevelPrice(levelsRaw: string | undefined): number | null {
  const first = splitLevels(levelsRaw)[0]
  return parseNumeric(first)
}
