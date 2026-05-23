import { getStockInfo } from '@/api/stock/index'
import type { StockListItem, StockSearchQuery } from '@/types/stock'
import { useStockStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'

function isStockListItem(value: unknown): value is StockListItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'symbol' in value &&
    'name' in value
  )
}

function pickSearchResult(
  data: StockListItem | StockListItem[]
): StockListItem | undefined {
  if (Array.isArray(data)) {
    return data[0]
  }
  return data
}

export function useStockSearch() {
  const router = useRouter()
  const toast = useToast()
  const stockStore = useStockStore()
  const { allStocksData } = storeToRefs(stockStore)

  const inputValue = ref('')
  const allStocks = ref<string[]>([])
  const searchItems = ref<string[]>([])
  const marketType = ref<'tse' | 'otc'>('tse')

  const fetchStockInfo = async (params: StockSearchQuery) => {
    const resp = await getStockInfo(params)
    if (resp.code === 2) {
      toast.add({
        severity: 'error',
        summary: resp.msg,
        life: 3000
      })
      return undefined
    }
    const result = pickSearchResult(resp.data)
    return isStockListItem(result) ? result : undefined
  }

  const handleSearchStock = async () => {
    if (!inputValue.value) return
    const match = inputValue.value.match(/\d+/)
    const stockSymbol = match ? match[0] : ''
    const params: StockSearchQuery = match
      ? { symbol: stockSymbol }
      : { name: inputValue.value }

    try {
      const stock = await fetchStockInfo(params)
      if (!stock) return

      const { market, symbol, industry } = stock
      marketType.value = market === '上市' ? 'tse' : 'otc'
      const industryQuery = Array.isArray(industry) ? industry[0] : industry
      router.push({
        path: '/listedCompany/detail',
        query: {
          symbol,
          industry: industryQuery ?? '',
          market: marketType.value
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  const listAdapter = () => {
    if (!allStocksData.value) return
    allStocks.value = allStocksData.value.map((stock) => `${stock.symbol} ${stock.name}`)
  }

  const search = ({ query }: { query: string }) => {
    const regex = /[\u4e00-\u9fa5]/.test(query)
      ? new RegExp(`${query}`, 'i')
      : new RegExp(`^${query}`, 'i')
    searchItems.value = allStocks.value.filter((item) => regex.test(item))
  }

  const loadStockSuggestions = async () => {
    await stockStore.getAllStocksData()
    listAdapter()
  }

  return {
    inputValue,
    searchItems,
    marketType,
    handleSearchStock,
    search,
    loadStockSuggestions
  }
}
