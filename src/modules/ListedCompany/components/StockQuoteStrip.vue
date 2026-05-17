<script setup lang="ts">
import { EMPTY } from '../constants/stockFields'
import type { StockData } from '../model/interface'
import {
  computeDisplayPrice,
  computePriceChange,
  type PriceDirection
} from '../utils/priceChange'
import { formatInteger, formatPrice, parseNumeric } from '../utils/stockFormatters'

const props = defineProps<{
  stockData: StockData
}>()

const displayPrice = computed(() => computeDisplayPrice(props.stockData))
const priceChange = computed(() => computePriceChange(props.stockData))

const changeSummary = computed(() => {
  const change = priceChange.value
  if (change.points === EMPTY) return EMPTY
  if (change.direction === 'flat') return `0.00(0.00%)`
  const sign = change.direction === 'up' ? '' : '−'
  return `${sign}${change.points}(${sign}${change.percent}%)`
})

const changeDirection = computed(() => priceChange.value.direction)

const secondaryItems = computed(() => {
  const prev = parseNumeric(props.stockData.previousClose)
  const toneFromPrice = (value?: string): PriceDirection => {
    const price = parseNumeric(value)
    if (price === null || prev === null) return 'flat'
    if (price > prev) return 'up'
    if (price < prev) return 'down'
    return 'flat'
  }

  return [
    { label: '開盤', value: props.stockData.openingPrice, tone: toneFromPrice(props.stockData.openingPrice) },
    { label: '昨收', value: props.stockData.previousClose, tone: 'flat' as PriceDirection },
    { label: '最高', value: props.stockData.highestPrice, tone: toneFromPrice(props.stockData.highestPrice) },
    { label: '最低', value: props.stockData.lowestPrice, tone: toneFromPrice(props.stockData.lowestPrice) }
  ]
})

const displaySecondaryValue = (value?: string): string => {
  if (!value || value === EMPTY) return EMPTY
  return formatPrice(value)
}

const toneClass = (tone: PriceDirection): string => {
  if (tone === 'up') return 'quote-strip__tone--up'
  if (tone === 'down') return 'quote-strip__tone--down'
  return 'quote-strip__tone--flat'
}
</script>

<template>
  <header class="quote-strip shrink-0 pb-2 mb-3 ">
    <div class="quote-strip__primary flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      <div class="quote-strip__primary-leading inline-flex flex-wrap items-center gap-x-4 gap-y-1 min-w-0">
        <span class="quote-strip__price-group inline-flex items-center gap-1.5 shrink-0">
          <span class="text-gray-600 leading-none">股價</span>
          <span
            class="quote-strip__price text-lg font-semibold leading-none tabular-nums"
            :class="toneClass(changeDirection)"
          >
            {{ displayPrice }}
          </span>
        </span>
        <span
          v-if="changeSummary !== EMPTY"
          class="quote-strip__change inline-flex items-center gap-0.5 font-medium leading-none tabular-nums shrink-0"
          :class="toneClass(changeDirection)"
        >
          <span
            v-if="changeDirection !== 'flat'"
            class="quote-strip__arrow shrink-0"
            :class="{
              'quote-strip__arrow--up': changeDirection === 'up',
              'quote-strip__arrow--down': changeDirection === 'down'
            }"
            aria-hidden="true"
          />
          {{ changeSummary }}
        </span>
      </div>
      <span class="quote-strip__volume inline-flex items-center gap-1 text-gray-600 shrink-0">
        <span class="leading-none">交易量(張)</span>
        <span class="font-medium leading-none tabular-nums text-gray-800">
          {{ formatInteger(stockData.currentVolume) }}
        </span>
      </span>
    </div>

    <div class="quote-strip__secondary mt-1.5 flex flex-wrap items-center gap-y-0.5 text-sm text-gray-500">
      <template v-for="(item, index) in secondaryItems" :key="item.label">
        <span
          v-if="index > 0"
          class="quote-strip__sep"
          aria-hidden="true"
        >
          |
        </span>
        <span class="quote-strip__secondary-pair inline-flex items-center gap-1 shrink-0">
          <span class="leading-none">{{ item.label }}</span>
          <span
            class="font-medium leading-none tabular-nums"
            :class="toneClass(item.tone)"
          >
            {{ displaySecondaryValue(item.value) }}
          </span>
        </span>
      </template>
    </div>
  </header>
</template>

<style scoped lang="scss">
.quote-strip {
  &__tone--up {
    color: #eb3d4d;
  }

  &__tone--down {
    color: #00b74a;
  }

  &__tone--flat {
    color: #6b7280;
  }

  &__sep {
    display: inline-flex;
    align-items: center;
    align-self: center;
    padding: 0 0.625rem;
    color: #d1d5db;
    line-height: 1;
    user-select: none;
  }

  &__arrow {
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;

    &--up {
      border-bottom: 5px solid currentColor;
    }

    &--down {
      border-top: 5px solid currentColor;
    }
  }
}
</style>
