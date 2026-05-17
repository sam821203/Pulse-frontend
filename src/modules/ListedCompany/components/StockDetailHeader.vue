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

      <div class="header-actions">
        <button
          type="button"
          class="header-actions__btn header-actions__btn--ai"
          disabled
          aria-label="AI 分析（即將推出）"
        >
          <i class="pi pi-sparkles header-actions__icon" aria-hidden="true"></i>
          AI 分析
        </button>
        <button
          type="button"
          class="header-actions__btn header-actions__btn--watchlist"
          disabled
          aria-label="加入自選（即將推出）"
        >
          + 加入自選
        </button>
      </div>
    </div>

    <div
      :class="[
        'price',
        'flex',
        'flex-wrap',
        'items-baseline',
        'gap-3',
        'sm:gap-4',
        'mb-4',
        {
          'price--down': priceChange.direction === 'down',
          'price--flat': priceChange.direction === 'flat'
        }
      ]"
    >
      <span class="price__current">{{ displayPrice }}</span>
      <span v-if="priceChange.points !== EMPTY" class="price__points font-semibold">
        {{ priceChange.direction === 'up' ? '+' : priceChange.direction === 'down' ? '−' : ''
        }}{{ priceChange.points }}
      </span>
      <span class="price__percentage">{{ priceChangeLabel }}</span>
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
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 0.5rem;

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.875rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.25;
    white-space: nowrap;

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    &--ai {
      background-color: var(--p-surface-700);
      color: var(--p-surface-0);
    }

    &--watchlist {
      background-color: var(--primary-color);
      color: var(--primary-contrast-color);
    }
  }

  &__icon {
    font-size: 1rem;
    flex-shrink: 0;
  }
}

.price {
  min-height: 2.75rem;
  font-size: 1.375rem;
  font-weight: 700;
  color: #eb3d4d;

  @media (min-width: 640px) {
    font-size: 1.625rem;
  }

  &__current {
    font-size: 2.125rem;
    line-height: 1.2;

    @media (min-width: 640px) {
      font-size: 2.5rem;
    }
  }

  &__points {
    font-size: 1.125rem;
    color: inherit;

    @media (min-width: 640px) {
      font-size: 1.25rem;
    }
  }

  &__percentage {
    position: relative;
    margin-top: 4px;
    font-size: 1.125rem;

    @media (min-width: 640px) {
      font-size: 1.375rem;
    }

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
