<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { ChartData } from '../model/interface'
import { buildIntradaySeries } from '../utils/chartTime'
import { useIntradayCrosshairChart } from '../composables/useIntradayCrosshairChart'

const props = defineProps<{
  data: ChartData
  previousClose?: number | string
}>()

const chartRef = ref<HTMLElement | null>(null)

const series = computed(() => buildIntradaySeries(props.data.data))
const previousClose = computed(() => Number(props.previousClose) || 0)

const hasChartData = computed(
  () => series.value.length > 0 && previousClose.value > 0
)

const { resize, update, destroy } = useIntradayCrosshairChart({
  containerRef: chartRef,
  series,
  previousClose
})

let resizeObserver: ResizeObserver | undefined
let resizeFrame = 0

const renderChart = () => {
  if (!hasChartData.value || !chartRef.value) return
  if (!chartRef.value.clientWidth) return
  update()
}

onMounted(() => {
  if (!chartRef.value) return
  resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(() => {
      if (hasChartData.value) update()
    })
  })
  resizeObserver.observe(chartRef.value)
  renderChart()
})

watch([series, previousClose], async () => {
  await nextTick()
  renderChart()
})

onUnmounted(() => {
  cancelAnimationFrame(resizeFrame)
  resizeObserver?.disconnect()
  destroy()
})
</script>

<template>
  <div class="relative min-h-[inherit]">
    <div
      v-if="!hasChartData"
      class="flex items-center justify-center min-h-[inherit] text-gray-500 text-base"
    >
      尚無盤中資料
    </div>
    <div ref="chartRef" class="w-full" :class="{ hidden: !hasChartData }" />
  </div>
</template>
