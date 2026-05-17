<script setup lang="ts">
import CrosshairChart from './CrosshairChart.vue'
import StockDetailSidebar from './StockDetailSidebar.vue'
import StockQuoteStrip from './StockQuoteStrip.vue'
import type { ChartData, StockData } from '../model/interface'

defineProps<{
  chartData: ChartData
  stockData: StockData
  peRatio?: string
}>()
</script>

<template>
  <div class="flex flex-col xl:flex-row gap-4 md:gap-5 m-0">
    <div
      class="  w-full xl:w-3/5 min-w-0 min-h-[14rem] sm:min-h-[18rem] md:min-h-[22rem] flex flex-col"
    >
      <StockQuoteStrip :stock-data="stockData" />
      <CrosshairChart
        class="flex-1 min-h-[12rem] sm:min-h-[16rem] md:min-h-[20rem]"
        :data="chartData"
        :previous-close="stockData.previousClose"
      />
    </div>
    <StockDetailSidebar
      class="w-full xl:w-2/5 xl:shrink-0"
      :stock-data="stockData"
      :pe-ratio="peRatio"
    />
  </div>
</template>
