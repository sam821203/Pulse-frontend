import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { normalizeStocksList, useStockStore } from '../stock'
import * as stockApi from '@/api/stock/index'

vi.mock('@/api/stock/index', () => ({
  getStockInfo: vi.fn()
}))

describe('stock store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.mocked(stockApi.getStockInfo).mockReset()
  })

  it('normalizeStocksList accepts array payloads', () => {
    const list = normalizeStocksList([{ symbol: '2330', name: '台積電' }])
    expect(list).toEqual([{ symbol: '2330', name: '台積電' }])
  })

  it('normalizeStocksList unwraps { data: [] } payloads', () => {
    const list = normalizeStocksList({
      data: [{ symbol: '2317', name: '鴻海' }]
    })
    expect(list?.[0]?.symbol).toBe('2317')
  })

  it('getAllStocksData uses cached localStorage list', async () => {
    const cached = [{ symbol: '2454', name: '聯發科' }]
    localStorage.setItem('allStockInfo', JSON.stringify(cached))

    const store = useStockStore()
    await store.getAllStocksData()

    expect(stockApi.getStockInfo).not.toHaveBeenCalled()
    expect(store.allStocksData).toEqual(cached)
  })

  it('getAllStocksData fetches and caches when no local cache', async () => {
    vi.mocked(stockApi.getStockInfo).mockResolvedValue({
      code: 0,
      msg: 'ok',
      data: [{ symbol: '2330', name: '台積電' }]
    })

    const store = useStockStore()
    await store.getAllStocksData()

    expect(store.allStocksData).toEqual([{ symbol: '2330', name: '台積電' }])
    expect(JSON.parse(localStorage.getItem('allStockInfo')!)).toEqual([
      { symbol: '2330', name: '台積電' }
    ])
  })
})
