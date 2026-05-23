<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import { EMPTY } from '../constants/stockFields'
import type { StockData } from '../model/interface'
import {
  computeDisplayPrice,
  computePriceChange,
  formatPriceChangePercentDisplay
} from '../utils/priceChange'

const props = defineProps<{
  stockData: StockData
  peRatio: string
  industry?: string | null
}>()

const displayPrice = computed(() => computeDisplayPrice(props.stockData))
const priceChange = computed(() => computePriceChange(props.stockData))
const priceChangePercentDisplay = computed(() =>
  formatPriceChangePercentDisplay(priceChange.value)
)

const metrics = computed(() => [
  { label: '本益比', value: props.peRatio || EMPTY, amount: false },
  { label: '實收資本額', value: props.stockData.issueShares, amount: true }
])
</script>

<template>
  <div class="card">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <MainHeader :title="stockData.companyShortName || EMPTY" />
        <span class="text-xl sm:text-2xl text-gray-500">{{ stockData.stockCode || EMPTY }}</span>
      </div>

      <div class="header-actions flex flex-wrap gap-2 shrink-0">
        <Button
          label="AI 分析"
          icon="pi pi-sparkles"
          disabled
          severity="secondary"
          aria-label="AI 分析（即將推出）"
          class="header-actions__ai"
        />
        <Button
          label="+ 加入自選"
          disabled
          aria-label="加入自選（即將推出）"
          class="header-actions__watchlist"
        />
      </div>
    </div>

    <div
      :class="[
        'price',
        'mb-4',
        {
          'price--down': priceChange.direction === 'down',
          'price--flat': priceChange.direction === 'flat'
        }
      ]"
    >
      <span class="price__current tabular-nums">{{ displayPrice }}</span>
      <span
        v-if="priceChange.points !== EMPTY"
        class="price__change tabular-nums"
      >
        <span
          v-if="priceChange.direction !== 'flat'"
          class="price__arrow"
          :class="{
            'price__arrow--up': priceChange.direction === 'up',
            'price__arrow--down': priceChange.direction === 'down'
          }"
          aria-hidden="true"
        />
        <span class="price__points">{{ priceChange.points }}</span>
        <span class="price__percentage">{{ priceChangePercentDisplay }}</span>
      </span>
    </div>

    <div class="flex flex-col gap-3 md:flex-row md:flex-wrap md:justify-between md:items-center md:gap-4">
      <div class="flex flex-wrap items-center gap-3 md:gap-5">
        <Tag
          v-if="industry"
          style="font-weight: 500"
          severity="help"
          :value="industry"
        />
        <div
          v-for="metric in metrics"
          :key="metric.label"
          class="flex items-center gap-1.5 text-base sm:text-lg"
        >
          <span class="text-gray-500">{{ metric.label }}</span>
          <span v-if="metric.amount" class="font-medium text-gray-800" v-amount-format="metric.value"></span>
          <span v-else class="font-medium text-gray-800">{{ metric.value }}</span>
        </div>
      </div>
      <p class="text-gray-500 m-0 text-base sm:text-lg md:shrink-0 md:text-right">
        <span class="mr-2">成交時間</span>|<span class="ml-2 text-gray-700 font-medium">
          {{ stockData.lastTradeDate || EMPTY }} {{ stockData.lastTradeTime || EMPTY }}
        </span>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-actions {
  :deep(.header-actions__ai.p-button) {
    background-color: var(--p-surface-700);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
  }

  :deep(.header-actions__watchlist.p-button) {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--primary-contrast-color);
  }
}

.price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.375rem;
  min-height: 2.75rem;
  font-weight: 700;
  color: #eb3d4d;

  &__current {
    font-size: 2.125rem;
    line-height: 1.2;

    @media (min-width: 640px) {
      font-size: 2.5rem;
    }
  }

  &__change {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.2;

    @media (min-width: 640px) {
      font-size: 1.25rem;
    }
  }

  &__arrow {
    display: inline-block;
    flex-shrink: 0;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;

    &--up {
      border-bottom: 6px solid currentColor;
    }

    &--down {
      border-top: 6px solid currentColor;
    }
  }

  &__points,
  &__percentage {
    color: inherit;
  }

  &.price--down {
    color: #00b74a;
  }

  &.price--flat {
    color: #6b7280;
  }
}
</style>
