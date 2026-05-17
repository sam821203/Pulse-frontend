import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { EMPTY } from '../constants/stockFields'
import type { OrderBookView, StockData } from '../model/interface'
import { firstLevelPrice, parseOrderBook } from '../utils/orderBook'
import {
  computeDisplayPrice,
  computePriceChange,
  type PriceDirection
} from '../utils/priceChange'
import { computeBidAskRatio, type BidAskRatio } from '../utils/bidAskRatio'
import {
  formatBillions,
  formatInteger,
  formatPrice,
  parseNumeric
} from '../utils/stockFormatters'

export type QuoteTone = 'default' | 'up' | 'down' | 'flat' | 'bid' | 'ask'

export interface QuoteField {
  label: string
  value: string
  tone: QuoteTone
}

export type { BidAskRatio }

export function useStockQuotePanel(
  stockData: MaybeRefOrGetter<StockData>,
  peRatio: MaybeRefOrGetter<string> = ''
) {
  const data = computed(() => toValue(stockData))
  const pe = computed(() => toValue(peRatio))

  const previousCloseNum = computed(() => parseNumeric(data.value.previousClose))
  const tradePriceNum = computed(() => {
    const current = parseNumeric(data.value.currentPrice)
    if (current !== null) return current
    return previousCloseNum.value
  })

  const priceChange = computed(() => computePriceChange(data.value))

  const toneFromPrice = (price: number | null): QuoteTone => {
    const prev = previousCloseNum.value
    if (price === null || prev === null) return 'default'
    if (price > prev) return 'up'
    if (price < prev) return 'down'
    return 'flat'
  }

  const formatChangePoints = (): string => {
    const change = priceChange.value
    if (change.points === EMPTY) return EMPTY
    if (change.direction === 'flat') return '0'
    const sign = change.direction === 'up' ? '+' : '−'
    return `${sign}${change.points}`
  }

  const formatChangePercent = (): string => {
    const change = priceChange.value
    if (change.percent === EMPTY) return EMPTY
    if (change.direction === 'flat') return '0.00%'
    const sign = change.direction === 'up' ? '+' : '−'
    return `${sign}${change.percent}%`
  }

  const changeTone = computed((): QuoteTone => {
    const dir: PriceDirection = priceChange.value.direction
    if (dir === 'up') return 'up'
    if (dir === 'down') return 'down'
    return 'flat'
  })

  const turnoverBillions = computed((): number | null => {
    const price = tradePriceNum.value
    const volumeLots = parseNumeric(data.value.accumulatedVolume)
    if (price === null || volumeLots === null) return null
    return (price * volumeLots * 1000) / 1e8
  })

  const averagePrice = computed((): string => {
    const turnover = turnoverBillions.value
    const volumeLots = parseNumeric(data.value.accumulatedVolume)
    if (turnover === null || volumeLots === null || volumeLots === 0) return EMPTY
    const shares = volumeLots * 1000
    const avg = (turnover * 1e8) / shares
    return formatPrice(avg)
  })

  const marketCapBillions = computed((): string => {
    // issueShares is paid-in capital, not outstanding shares — show unavailable
    return EMPTY
  })

  const bestBidPrice = computed(() => firstLevelPrice(data.value.buyPrice))
  const bestAskPrice = computed(() => firstLevelPrice(data.value.sellPrice))

  const leftFields = computed<QuoteField[]>(() => [
    {
      label: '成交',
      value:
        tradePriceNum.value !== null ? formatPrice(tradePriceNum.value) : computeDisplayPrice(data.value),
      tone: toneFromPrice(tradePriceNum.value)
    },
    {
      label: '開盤',
      value: data.value.openingPrice || EMPTY,
      tone: toneFromPrice(parseNumeric(data.value.openingPrice))
    },
    {
      label: '最高',
      value: data.value.highestPrice || EMPTY,
      tone: toneFromPrice(parseNumeric(data.value.highestPrice))
    },
    {
      label: '最低',
      value: data.value.lowestPrice || EMPTY,
      tone: toneFromPrice(parseNumeric(data.value.lowestPrice))
    },
    {
      label: '均價',
      value: averagePrice.value,
      tone: toneFromPrice(parseNumeric(averagePrice.value))
    },
    {
      label: '昨收',
      value: data.value.previousClose || EMPTY,
      tone: 'default'
    },
    {
      label: '昨量(張)',
      value: EMPTY,
      tone: 'default'
    },
    {
      label: '本益比',
      value: pe.value || EMPTY,
      tone: 'default'
    },
    {
      label: '內盤(張)',
      value: formatInteger(data.value.innerVolume),
      tone: 'default'
    }
  ])

  const rightFields = computed<QuoteField[]>(() => [
    {
      label: '漲跌幅',
      value: formatChangePercent(),
      tone: changeTone.value
    },
    {
      label: '漲跌',
      value: formatChangePoints(),
      tone: changeTone.value
    },
    {
      label: '買價',
      value: bestBidPrice.value !== null ? formatPrice(bestBidPrice.value) : EMPTY,
      tone: 'bid'
    },
    {
      label: '賣價',
      value: bestAskPrice.value !== null ? formatPrice(bestAskPrice.value) : EMPTY,
      tone: 'ask'
    },
    {
      label: '金額(億)',
      value: formatBillions(turnoverBillions.value),
      tone: 'default'
    },
    {
      label: '單量',
      value: formatInteger(data.value.currentVolume),
      tone: 'default'
    },
    {
      label: '總量',
      value: formatInteger(data.value.accumulatedVolume),
      tone: 'default'
    },
    {
      label: '市值(億)',
      value: marketCapBillions.value,
      tone: 'default'
    },
    {
      label: '外盤(張)',
      value: formatInteger(data.value.outerVolume),
      tone: 'default'
    }
  ])

  const bidAskRatio = computed<BidAskRatio | null>(() => {
    const inner = parseNumeric(data.value.innerVolume) ?? 0
    const outer = parseNumeric(data.value.outerVolume) ?? 0
    return computeBidAskRatio(inner, outer)
  })

  const orderBook = computed((): OrderBookView =>
    parseOrderBook(
      data.value.buyPrice,
      data.value.buyVolume,
      data.value.sellPrice,
      data.value.sellVolume,
      tradePriceNum.value
    )
  )

  return {
    leftFields,
    rightFields,
    bidAskRatio,
    orderBook,
    tradePriceNum
  }
}
