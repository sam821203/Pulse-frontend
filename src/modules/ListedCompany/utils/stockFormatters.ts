import { EMPTY } from '../constants/stockFields'
import type { StockData } from '../model/interface'

export function parseNumeric(value: string | undefined): number | null {
  if (!value || value === EMPTY || value === '-') return null
  const number = parseFloat(String(value).replace(/,/g, ''))
  return Number.isNaN(number) ? null : number
}

export function formatPrice(value: string | number | undefined, digits = 1): string {
  const number = typeof value === 'number' ? value : parseNumeric(value)
  if (number === null) {
    if (!value || value === EMPTY) return EMPTY
    return String(value)
  }
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(number)
}

export function formatInteger(value: string | number | undefined): string {
  const number = typeof value === 'number' ? value : parseNumeric(value)
  if (number === null) {
    if (!value || value === EMPTY) return EMPTY
    return String(value)
  }
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 0
  }).format(Math.round(number))
}

export function formatBillions(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return EMPTY
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value)
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

function rawOrEmpty(value: string | undefined): string {
  if (!value || value === '-') return ''
  return value
}

export function stockDataAdapter(data: Record<string, string>): StockData {
  return {
    sellVolume: rawOrEmpty(data.f),
    marketType: data.ex || EMPTY,
    buyVolume: rawOrEmpty(data.g),
    lastTradeDate: formatDate(data.d),
    buyPrice: rawOrEmpty(data.b),
    stockCode: data.c || EMPTY,
    sellPrice: rawOrEmpty(data.a),
    companyShortName: data.n || EMPTY,
    openingPrice: formatPrice(data.o),
    lowestPrice: formatPrice(data.l),
    highestPrice: formatPrice(data.h),
    downLimitPrice: formatPrice(data.w),
    accumulatedVolume: data.v || EMPTY,
    upLimitPrice: formatPrice(data.u),
    lastTradeTime: formatTime(data.t),
    currentVolume: data.tv || EMPTY,
    companyName: data.nf || EMPTY,
    currentPrice: formatPrice(data.z),
    previousClose: formatPrice(data.y)
  }
}

export function toApiDate(formatted: string | undefined): string {
  if (!formatted || formatted === EMPTY) return ''
  return formatted.replace(/\//g, '-')
}
