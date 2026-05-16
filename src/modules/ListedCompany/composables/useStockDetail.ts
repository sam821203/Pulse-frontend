import type { LocationQueryValue } from 'vue-router'
import loading from '@/utils/loading'
import {
  getRealTimeStockInfo,
  getEquitiesValuesFromTickers,
  getListedCompanyOpenData,
  getOTCOpenData
} from '@/api/stock/index'
import { subscribeStock } from '@/api/webSocket/socketService'
import type { ChartData, ListedCompanyData, OTCCompanyData, StockData } from '../model/interface'
import { createEmptyStockData, EMPTY } from '../constants/stockFields'
import { buildChartRecord, buildChartRecordFromSocket } from '../utils/chartRecord'
import { isMarketOpen } from '../utils/marketHours'
import { stockDataAdapter, toApiDate } from '../utils/stockFormatters'

export interface CurrentStockQuery {
  market: LocationQueryValue | LocationQueryValue[]
  symbol: LocationQueryValue | LocationQueryValue[]
  industry: LocationQueryValue | LocationQueryValue[]
}

export function useStockDetail() {
  const route = useRoute()

  const currentStock = reactive<CurrentStockQuery>({
    market: route.query.market,
    symbol: route.query.symbol,
    industry: route.query.industry
  })

  const stockData = reactive<StockData>(createEmptyStockData())
  const chartData = reactive<ChartData>({ data: [] })
  const equitiesData = ref({ peRatio: '' })

  const pollTimerId = ref<ReturnType<typeof setTimeout> | null>(null)
  let unsubscribeStockFn: (() => void) | null = null

  const seedChartFromStockData = () => {
    if (chartData.data.length > 0) return
    if (!stockData.lastTradeDate || stockData.lastTradeDate === EMPTY) return
    chartData.data.push(
      buildChartRecord({
        lastTradeDate: stockData.lastTradeDate,
        lastTradeTime: stockData.lastTradeTime || '',
        openingPrice: stockData.openingPrice || '',
        highestPrice: stockData.highestPrice || '',
        lowestPrice: stockData.lowestPrice || '',
        currentPrice: stockData.currentPrice || stockData.previousClose || '',
        currentVolume: stockData.currentVolume || ''
      })
    )
  }

  const getStockRealTime = async () => {
    if (!currentStock.market || !currentStock.symbol) return
    try {
      const resp = await getRealTimeStockInfo(
        currentStock.market as 'tse' | 'otc',
        currentStock.symbol as string
      )
      if (!resp?.msgArray?.[0]) return
      Object.assign(stockData, stockDataAdapter(resp.msgArray[0]))
      seedChartFromStockData()
    } catch (err) {
      console.error(err)
    }
  }

  const getCompanyOpenData = async () => {
    if (!currentStock.symbol) return
    try {
      if (currentStock.market === 'tse') {
        const resp: ListedCompanyData[] = await getListedCompanyOpenData()
        const stockInfo = resp.find((stock) => stock['公司代號'] === currentStock.symbol)
        if (stockInfo) {
          stockData.issueShares = stockInfo['實收資本額']
        }
      } else {
        const resp: OTCCompanyData[] = await getOTCOpenData()
        const stockInfo = resp.find((stock) => stock.SecuritiesCompanyCode === currentStock.symbol)
        if (stockInfo) {
          stockData.issueShares = stockInfo.IssueShares
        }
      }
    } catch (err) {
      console.error('Error fetching company open data:', err)
    }
  }

  const fetchEquitiesValues = async () => {
    if (!stockData.stockCode || stockData.stockCode === EMPTY) return
    const date = toApiDate(stockData.lastTradeDate)
    if (!date) return
    try {
      const resp = await getEquitiesValuesFromTickers({
        symbol: stockData.stockCode,
        name: stockData.companyShortName ?? '',
        date
      })
      equitiesData.value.peRatio = resp.peRatio?.toString() || EMPTY
    } catch (err) {
      console.error(err)
    }
  }

  const clearPollTimer = () => {
    if (pollTimerId.value !== null) {
      clearTimeout(pollTimerId.value)
      pollTimerId.value = null
    }
  }

  const initStockTimer = () => {
    clearPollTimer()
    const delay = 3000
    const schedule = () => {
      if (!isMarketOpen()) {
        clearPollTimer()
        return
      }
      getStockRealTime()
      pollTimerId.value = setTimeout(schedule, delay)
    }
    pollTimerId.value = setTimeout(schedule, delay)
  }

  const restartStockSubscription = () => {
    unsubscribeStockFn?.()
    unsubscribeStockFn = null
    const symbol = currentStock.symbol as string | undefined
    if (!symbol) return

    unsubscribeStockFn = subscribeStock(symbol, (data) => {
      if (!isMarketOpen()) return
      chartData.data.push(buildChartRecordFromSocket(data))
    })
  }

  const resetPageState = () => {
    Object.assign(stockData, createEmptyStockData())
    chartData.data.length = 0
    equitiesData.value.peRatio = ''
  }

  const loadStockDetail = async () => {
    if (!currentStock.symbol || !currentStock.market) return
    loading.start()
    try {
      resetPageState()
      await getStockRealTime()
      await Promise.all([getCompanyOpenData(), fetchEquitiesValues()])
      restartStockSubscription()
    } finally {
      loading.stop()
    }
  }

  const syncRouteQuery = () => {
    currentStock.market = route.query.market
    currentStock.symbol = route.query.symbol
    currentStock.industry = route.query.industry
  }

  const setupLifecycle = () => {
    watch(
      () => [route.query.market, route.query.symbol, route.query.industry] as const,
      async () => {
        syncRouteQuery()
        clearPollTimer()
        await loadStockDetail()
        initStockTimer()
      }
    )

    onMounted(async () => {
      syncRouteQuery()
      await loadStockDetail()
      initStockTimer()
    })

    onUnmounted(() => {
      clearPollTimer()
      unsubscribeStockFn?.()
    })
  }

  return {
    currentStock,
    stockData,
    chartData,
    equitiesData,
    loadStockDetail,
    syncRouteQuery,
    setupLifecycle
  }
}
