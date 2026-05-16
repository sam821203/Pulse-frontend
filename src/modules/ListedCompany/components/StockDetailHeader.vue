<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import { EMPTY } from '../constants/stockFields'
import type { StockData } from '../model/interface'
import {
  computeDisplayPrice,
  computePriceChange,
  formatPriceChangeLabel
} from '../utils/priceChange'

const props = defineProps<{
  stockData: StockData
  peRatio: string
  industry?: string | null
}>()

const displayPrice = computed(() => computeDisplayPrice(props.stockData))
const priceChange = computed(() => computePriceChange(props.stockData))
const priceChangeLabel = computed(() => formatPriceChangeLabel(priceChange.value))

const metrics = computed(() => [
  { label: '成交張數', value: props.stockData.accumulatedVolume || EMPTY, amount: false },
  { label: '本益比', value: props.peRatio || EMPTY, amount: false },
  { label: '實收資本額', value: props.stockData.issueShares, amount: true }
])
</script>

<template>
  <div class="card">
    <div class="flex flex-wrap items-center gap-3">
      <MainHeader :title="stockData.companyShortName || EMPTY" />
      <span class="text-xl text-gray-500">{{ stockData.stockCode || EMPTY }}</span>
    </div>

    <div
      :class="[
        'price',
        'flex',
        'flex-wrap',
        'items-baseline',
        'gap-4',
        'mb-4',
        { 'price--down': priceChange.direction === 'down' }
      ]"
    >
      <span class="price__current">{{ displayPrice }}</span>
      <span v-if="priceChange.points !== EMPTY" class="price__points text-lg font-semibold">
        {{ priceChange.direction === 'up' ? '+' : priceChange.direction === 'down' ? '−' : ''
        }}{{ priceChange.points }}
      </span>
      <span class="price__percentage">{{ priceChangeLabel }}</span>
    </div>

    <div class="flex flex-wrap justify-between items-center gap-4">
      <div class="flex flex-wrap items-center gap-5">
        <Tag
          v-if="industry"
          style="font-weight: 500"
          severity="help"
          :value="industry"
        />
        <div
          v-for="metric in metrics"
          :key="metric.label"
          class="flex items-center gap-1"
        >
          <span class="text-gray-400">{{ metric.label }}</span>
          <span v-if="metric.amount" class="font-medium" v-amount-format="metric.value"></span>
          <span v-else class="font-medium">{{ metric.value }}</span>
        </div>
      </div>
      <p class="text-gray-400 m-0 shrink-0">
        <span class="mr-2">成交時間</span>|<span class="ml-2 text-gray-700 font-medium">
          {{ stockData.lastTradeDate || EMPTY }} {{ stockData.lastTradeTime || EMPTY }}
        </span>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.price {
  min-height: 2.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #eb3d4d;

  &__current {
    font-size: 2rem;
    line-height: 1.2;
  }

  &__points {
    color: inherit;
  }

  &__percentage {
    position: relative;
    margin-top: 4px;
    font-size: 1.25rem;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -12px;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid #eb3d4d;
      transform: translateY(-50%);
    }
  }

  &.price--down {
    color: #00b74a;

    .price__percentage {
      &::before {
        top: 52%;
        border-top: 5px solid #00b74a;
        border-bottom: none;
      }
    }
  }
}
</style>
