<script setup lang="ts">
import type { OrderBookView } from '../model/interface'
import { formatInteger, formatPrice } from '../utils/stockFormatters'

const props = defineProps<{
  orderBook: OrderBookView
}>()

const barWidth = (volume: number): string => {
  if (!props.orderBook.maxVolume || volume <= 0) return '0%'
  return `${(volume / props.orderBook.maxVolume) * 100}%`
}
</script>

<template>
  <table class="order-book w-full border-collapse text-sm">
    <thead>
      <tr class="order-book__header text-gray-500">
        <th class="order-book__th order-book__th--bid-vol font-normal text-left pb-1">委買量</th>
        <th class="order-book__th order-book__th--bid-price font-normal text-right pb-1">買價</th>
        <th class="order-book__th order-book__th--ask-price font-normal text-left pb-1">賣價</th>
        <th class="order-book__th order-book__th--ask-vol font-normal text-right pb-1">委賣量</th>
      </tr>
      <tr class="order-book__totals text-gray-700 font-semibold">
        <td class="order-book__total-bid text-left pb-1 tabular-nums">
          {{ formatInteger(orderBook.totalBidVolume) }}
        </td>
        <td colspan="2" />
        <td class="order-book__total-ask text-right pb-1 tabular-nums">
          {{ formatInteger(orderBook.totalAskVolume) }}
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, index) in orderBook.rows"
        :key="index"
        class="order-book__row leading-tight border-b border-gray-100 last:border-b-0"
      >
        <td class="order-book__cell order-book__cell--bid-vol relative py-1.5 pr-1">
          <span
            v-if="row.bidVolume > 0"
            class="order-book__bar order-book__bar--bid absolute top-1 bottom-1 left-0 bg-emerald-500/15"
            :style="{ width: barWidth(row.bidVolume) }"
          />
          <span
            class="order-book__vol relative z-[1] tabular-nums text-emerald-700"
            :class="{ 'font-semibold': row.highlightBid }"
          >
            {{ row.bidVolume > 0 ? formatInteger(row.bidVolume) : '' }}
          </span>
        </td>
        <td
          class="order-book__cell order-book__cell--bid-price py-1.5 pr-1 text-right tabular-nums text-emerald-700"
          :class="{ 'font-semibold': row.highlightBid }"
        >
          {{ row.bidPrice > 0 ? formatPrice(row.bidPrice) : '' }}
        </td>
        <td
          class="order-book__cell order-book__cell--ask-price py-1.5 pl-1 text-left tabular-nums text-red-500"
          :class="{ 'font-semibold': row.highlightAsk }"
        >
          {{ row.askPrice > 0 ? formatPrice(row.askPrice) : '' }}
        </td>
        <td class="order-book__cell order-book__cell--ask-vol relative py-1.5 pl-1 text-right">
          <span
            v-if="row.askVolume > 0"
            class="order-book__bar order-book__bar--ask absolute top-1 bottom-1 right-0 bg-red-500/15"
            :style="{ width: barWidth(row.askVolume) }"
          />
          <span
            class="order-book__vol relative z-[1] tabular-nums text-red-500"
            :class="{ 'font-semibold': row.highlightAsk }"
          >
            {{ row.askVolume > 0 ? formatInteger(row.askVolume) : '' }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.order-book {
  &__th--bid-price,
  &__cell--bid-price {
    width: 22%;
  }

  &__th--ask-price,
  &__cell--ask-price {
    width: 22%;
  }

  &__cell--bid-vol,
  &__cell--ask-vol {
    width: 28%;
  }
}
</style>
