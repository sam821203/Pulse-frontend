import { defineStore } from 'pinia'
import { getStockInfo } from '@/api/stock/index'
import type { StockData } from '@/modules/User/model/interface'

export const useStockStore = defineStore('stock', () => {
  const allStocksData = ref<any>(null)
  // const allStocksData = ref<StockData | null>(null)

  // 取得資訊
  const getAllStocksData = async (): Promise<any> => {
    const stocksInfo = localStorage.getItem('allStockInfo')
      ? JSON.parse(localStorage.getItem('allStockInfo') as string)
      : null

    if (stocksInfo) {
      allStocksData.value = stocksInfo
    } else {
      try {
        const res = await getStockInfo()
        allStocksData.value = res
        localStorage.setItem('allStockInfo', JSON.stringify(res))
      } catch (error) {
        console.log(error)
      }
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
