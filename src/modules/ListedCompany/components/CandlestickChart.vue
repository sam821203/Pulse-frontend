<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

interface CandlestickData {
  Date: string
  Open: number
  High: number
  Low: number
  Close: number
  AdjClose: number
  Volume: number
}

const props = defineProps<{
  data: CandlestickData[]
}>()

const chartRef = ref<HTMLElement | null>(null)
const padding = 50

let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let rootLayer: d3.Selection<SVGGElement, unknown, null, undefined>
let axisLayer: d3.Selection<SVGGElement, unknown, null, undefined>
let xAxisLayer: d3.Selection<SVGGElement, unknown, null, undefined>
let yAxisLayer: d3.Selection<SVGGElement, unknown, null, undefined>
let lineLayer: d3.Selection<SVGGElement, unknown, null, undefined>
let rectLayer: d3.Selection<SVGGElement, unknown, null, undefined>

const initChart = () => {
  if (!chartRef.value) return

  const containerWidth = chartRef.value.clientWidth
  const containerHeight = containerWidth * 0.5 // 保持 4:3 的寬高比
  const innerWidth = containerWidth - padding * 2
  const innerHeight = containerHeight - padding * 2

  // Clear existing SVG if any
  d3.select(chartRef.value).selectAll('*').remove()

  // Create new SVG structure
  svg = d3
    .select(chartRef.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', containerHeight)
    .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)

  rootLayer = svg.append('g').attr('transform', `translate(${padding}, ${padding})`)

  axisLayer = rootLayer.append('g')
  xAxisLayer = axisLayer.append('g').attr('transform', `translate(0, ${innerHeight})`)
  yAxisLayer = axisLayer.append('g')
  lineLayer = rootLayer.append('g')
  rectLayer = rootLayer.append('g')

  return { innerWidth, innerHeight }
}

const updateChart = (data: CandlestickData[]) => {
  if (!chartRef.value) return

  const { innerWidth, innerHeight } = initChart() || {}
  if (!innerWidth || !innerHeight) return

  // Calculate extents
  const xExtent = d3.extent(data, (d) => new Date(d.Date)) as [Date, Date]
  const yExtent = [d3.min(data, (d) => d.Low), d3.max(data, (d) => d.High)] as [number, number]

  // Create scales
  const xScale = d3.scaleTime().domain(xExtent).range([0, innerWidth])

  const yScale = d3.scaleLinear().domain(yExtent).range([innerHeight, 0]).nice()

  // Update axes
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  xAxisLayer.call(xAxis)
  yAxisLayer.call(yAxis)

  // Update lines
  lineLayer
    .selectAll('line')
    .data(data)
    .join('line')
    .attr('class', 'line')
    .attr('x1', (d) => xScale(new Date(d.Date)))
    .attr('x2', (d) => xScale(new Date(d.Date)))
    .attr('y1', (d) => yScale(d.High))
    .attr('y2', (d) => yScale(d.Low))
    .attr('stroke', (d) => (d.Open === d.Close ? 'white' : d.Open > d.Close ? 'green' : 'red'))

  // Update rectangles
  rectLayer
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('class', 'rect')
    .attr('x', (d) => xScale(new Date(d.Date)) - 2)
    .attr('y', (d) => yScale(Math.max(d.Open, d.Close)))
    .attr('width', 5)
    .attr('height', (d) => Math.abs(yScale(d.Open) - yScale(d.Close)))
    .attr('fill', (d) => (d.Open > d.Close ? 'green' : 'red'))
}

// 監聽視窗大小變化
let resizeObserver: ResizeObserver

onMounted(() => {
  if (chartRef.value) {
    // 初始化 ResizeObserver
    resizeObserver = new ResizeObserver(() => {
      updateChart(props.data)
    })

    // 開始觀察容器大小變化
    resizeObserver.observe(chartRef.value)

    // 初始渲染
    updateChart(props.data)
  }
})

// 監聽數據變化
watch(
  () => props.data,
  (newData) => {
    updateChart(newData)
  }
)
</script>

<template>
  <div ref="chartRef" class="w-full"></div>
</template>

<style scoped>
.line {
  stroke-width: 1px;
}

.rect {
  shape-rendering: crispEdges;
}
</style>
