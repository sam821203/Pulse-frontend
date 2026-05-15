import { defineStore } from 'pinia'
import { getStockInfo } from '@/api/stock/index'
import type { StockData } from '@/modules/User/model/interface'

export const useStockStore = defineStore('stock', () => {
  const allStocksData = ref<any>(null)
  // const allStocksData = ref<StockData | null>(null)

  // 取得資訊
  const normalizeStocksList = (payload: unknown): any[] | null => {
    if (Array.isArray(payload)) return payload
    if (
      payload &&
      typeof payload === 'object' &&
      'data' in payload &&
      Array.isArray((payload as { data: unknown }).data)
    ) {
      return (payload as { data: any[] }).data
    }
    return null
  }

  const getAllStocksData = async (): Promise<any> => {
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
      const list = normalizeStocksList(res)
      if (!list) return

      allStocksData.value = list
      localStorage.setItem('allStockInfo', JSON.stringify(list))
    } catch (error) {
      console.log(error)
    }
  }

  //   const resetStore = () => {
  //     localStorage.removeItem('token')
  //     localStorage.removeItem('userInfo')
  //     userInfo.value = null
  //   }

  //   const setEvent = (eventName: any) => {
  //     event.value = eventName
  //   }

  return {
    // setEvent,
    getAllStocksData,
    allStocksData
    // resetStore
  }
})
