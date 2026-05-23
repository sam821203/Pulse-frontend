import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import StockDetailHeader from '../StockDetailHeader.vue'
import { EMPTY } from '../../constants/stockFields'
import type { StockData } from '../../model/interface'

const stockData: StockData = {
  companyShortName: '台積電',
  stockCode: '2330',
  currentPrice: '110',
  previousClose: '100',
  issueShares: '25930380000',
  lastTradeDate: '20250102',
  lastTradeTime: '133000'
}

const mountOptions = {
  global: {
    plugins: [PrimeVue],
    components: { Button, Tag },
    directives: {
      'amount-format': {
        mounted(el: HTMLElement, binding: { value?: unknown }) {
          el.textContent = String(binding.value ?? EMPTY)
        }
      }
    },
    stubs: {
      MainHeader: {
        props: ['title'],
        template: '<h2>{{ title }}</h2>'
      }
    }
  }
}

function mountHeader(
  props: Partial<{
    stockData: StockData
    peRatio: string
    industry: string | null
  }> = {}
) {
  return mount(StockDetailHeader, {
    global: mountOptions.global,
    props: {
      stockData,
      peRatio: '18.5',
      industry: '半導體',
      ...props
    }
  })
}

describe('StockDetailHeader', () => {
  it('renders company name, code, and price', () => {
    const wrapper = mountHeader()

    expect(wrapper.text()).toContain('台積電')
    expect(wrapper.text()).toContain('2330')
    expect(wrapper.text()).toContain('110')
    expect(wrapper.text()).toContain('(+10.00%)')
  })

  it('applies down price class when price falls', () => {
    const wrapper = mountHeader({
      stockData: { ...stockData, currentPrice: '90', previousClose: '100' }
    })

    expect(wrapper.find('.price--down').exists()).toBe(true)
  })

  it('disables header action buttons with accessible labels', () => {
    const wrapper = mountHeader()
    const buttons = wrapper.findAll('button')

    const aiButton = buttons.find((b) => b.attributes('aria-label') === 'AI 分析（即將推出）')
    const watchlistButton = buttons.find(
      (b) => b.attributes('aria-label') === '加入自選（即將推出）'
    )

    expect(aiButton?.attributes('disabled')).toBeDefined()
    expect(watchlistButton?.attributes('disabled')).toBeDefined()
  })

  it('shows industry tag when industry prop is set', () => {
    const wrapper = mountHeader({ industry: '半導體' })
    expect(wrapper.text()).toContain('半導體')
  })
})
