import { defineStore } from 'pinia'
import { getStockInfo } from '@/api/stock/index'
import type { StockListItem } from '@/types/stock'

function isStockListItem(value: unknown): value is StockListItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'symbol' in value &&
    'name' in value &&
    typeof (value as StockListItem).symbol === 'string' &&
    typeof (value as StockListItem).name === 'string'
  )
}

export function normalizeStocksList(payload: unknown): StockListItem[] | null {
  if (Array.isArray(payload)) {
    const items = payload.filter(isStockListItem)
    return items.length > 0 ? items : null
  }
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return normalizeStocksList((payload as { data: unknown }).data)
  }
  return null
}

export const useStockStore = defineStore('stock', () => {
  const allStocksData = ref<StockListItem[] | null>(null)

  const getAllStocksData = async (): Promise<void> => {
    const cached = localStorage.getItem('allStockInfo')
      ? JSON.parse(localStorage.getItem('allStockInfo') as string)
      : null
    const cachedList = normalizeStocksList(cached)

    if (cachedList) {
      allStocksData.value = cachedList
      return
    }

    try {
      const res = await getStockInfo()
      const list = normalizeStocksList(res.data ?? res)
      if (!list) return

      allStocksData.value = list
      localStorage.setItem('allStockInfo', JSON.stringify(list))
    } catch (error) {
      console.error(error)
    }
  }

  return {
    getAllStocksData,
    allStocksData
  }
})
