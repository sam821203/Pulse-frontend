import { EMPTY } from '../constants/stockFields'
import type { StockData } from '../model/interface'

export function formatNumber(value: string | undefined): string {
  if (!value) return EMPTY
  const number = parseFloat(String(value).replace(/,/g, ''))
  return Number.isNaN(number) ? value : number.toFixed(2)
}

export function formatDate(dateString: string): string {
  if (!dateString || dateString.length !== 8) return dateString || EMPTY
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  return `${year}/${month}/${day}`
}

export function formatTime(timeString: string): string {
  if (!timeString) return EMPTY
  if (timeString.length === 8) {
    return `${timeString.substring(0, 2)}:${timeString.substring(3, 5)}`
  }
  if (timeString.length >= 5) {
    return timeString.substring(0, 5)
  }
  return timeString
}

export function stockDataAdapter(data: Record<string, string>): StockData {
  return {
    sellVolume: formatNumber(data.f),
    marketType: data.ex || EMPTY,
    buyVolume: formatNumber(data.g),
    lastTradeDate: formatDate(data.d),
    buyPrice: formatNumber(data.b),
    stockCode: data.c || EMPTY,
    sellPrice: formatNumber(data.a),
    companyShortName: data.n || EMPTY,
    openingPrice: formatNumber(data.o),
    lowestPrice: formatNumber(data.l),
    highestPrice: formatNumber(data.h),
    downLimitPrice: formatNumber(data.w),
    accumulatedVolume: data.v || EMPTY,
    upLimitPrice: formatNumber(data.u),
    lastTradeTime: formatTime(data.t),
    currentVolume: data.tv || EMPTY,
    companyName: data.nf || EMPTY,
    currentPrice: formatNumber(data.z),
    previousClose: formatNumber(data.y)
  }
}

export function toApiDate(formatted: string | undefined): string {
  if (!formatted || formatted === EMPTY) return ''
  return formatted.replace(/\//g, '-')
}
