<script setup lang="ts">
import CrosshairChart from './CrosshairChart.vue'
import StockDetailSidebar from './StockDetailSidebar.vue'
import type { ChartData, StockData } from '../model/interface'

defineProps<{
  chartData: ChartData
  stockData: StockData
}>()
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-4 m-0 min-h-[28rem]">
    <div class="w-full lg:w-3/4">
      <CrosshairChart :data="chartData" />
    </div>
    <StockDetailSidebar :stock-data="stockData" />
  </div>
</template>
