<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
import type { ChartData } from '../model/interface'

const props = defineProps<{
  data: ChartData
}>()

const chartRef = ref<HTMLElement | null>(null)
const margin = { top: 50, right: 30, bottom: 30, left: 80 }
const tooltipRef = ref<HTMLElement | null>(null)

// 格式化日期顯示
const formatDate = (dateStr: string) => {
  return dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
}

// 格式化提示文字
const formatTooltip = (data: [string, number, number, number, number, number, number]) => {
  return `${formatDate(data[0])}
    交易時間：${data[1]} |
    開盤價: ${data[2]} |
    最高價: ${data[3]} |
    最低價: ${data[4]} |
    收盤價: ${data[5]} |
    成交量: ${data[6]} |
    `
}

const formatText = (data: [string, number, number, number, number, number, number]) => {
  return `${data[0].replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}
        交易時間：${data[1]} |
        開盤價: ${data[2]} |
        最高價: ${data[3]} |
        最低價: ${data[4]} |
        收盤價: ${data[5]} |
        成交量: ${data[6]} |
        `
}

const initChart = () => {
  if (!chartRef.value || !props.data.data.length) return

  const containerWidth = chartRef.value.clientWidth
  const containerHeight = Math.min(containerWidth * 0.5, 500)
  const width = containerWidth
  const height = containerHeight
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // 清除現有的 SVG
  d3.select(chartRef.value).selectAll('*').remove()

  // 創建 SVG
  const svg = d3
    .select(chartRef.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])

  // 定義漸層
  const gradient = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '0%')
    .attr('y2', '100%')

  gradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#883DCF')
    .attr('stop-opacity', 0.8)

  gradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#883DCF')
    .attr('stop-opacity', 0)

  // 計算蠟燭圖寬度
  // const candleWidth = Math.max(1, innerWidth / props.data.data.length - 3)
  // const candleWidth = 5

  // X 軸比例尺
  // const xScale = d3.scaleLinear().domain([0, props.data.data.length]).range([0, innerWidth])

  // 定義時間點
  // const timePoints = ['09:00', '10:00', '11:00', '12:00', '13:00', '13:30']

  const xScale = d3.scaleLinear().domain([0, 270]).range([0, innerWidth])

  // Y 軸比例尺
  const yScale = d3
    .scaleLinear()
    .domain([
      (d3.min(props.data.data, (d) => d[4]) as number) - 100,
      (d3.max(props.data.data, (d) => d[3]) as number) + 100
    ])
    .range([innerHeight, 0])

  // 繪製標題
  svg
    .append('text')
    .attr('x', margin.left)
    .attr('y', margin.top / 2)
    .attr('class', 'text-lg font-bold')

  // 創建主圖層
  const mainGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  // 繪製 X 軸
  //   const xAxis = d3
  //     .axisBottom(xScale)
  //     .ticks(10)
  //     .tickFormat((i) => formatDate(props.data.data[Math.floor(Number(i))]?.[0] || ''))
  const xAxis = d3.axisBottom(xScale).ticks(props.data.data.length)
  // .tickFormat((d, i) => {
  //   const tickLabels = ['09:00', '10:00', '11:00', '12:00', '13:00', '13:30']
  //   return tickLabels[i] || ''
  // })

  const xAxisGroup = mainGroup
    .append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis)

  mainGroup.append('g').attr('transform', `translate(0,${innerHeight})`).call(xAxis)

  // 繪製 Y 軸
  const yAxis = d3.axisLeft(yScale).ticks(10)
  const yAxisGroup = mainGroup.append('g').call(yAxis)

  // 添加 Y 軸網格線
  yAxisGroup.selectAll('.tick line').clone().attr('x2', innerWidth).attr('stroke-opacity', 0.1)

  // **新增 X 軸 tick 位置的垂直線**
  xAxisGroup.selectAll('.tick').each(function (d) {
    const x = xScale(d) // 計算 tick 在 x 軸的位置
    mainGroup
      .append('line')
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#ccc') // 調整顏色
      .attr('stroke-dasharray', '3,3') // 虛線樣式
      .attr('stroke-opacity', 0.5)
  })

  // 繪製蠟燭圖
  // const candlesticks = mainGroup
  //   .selectAll('.candlestick')
  //   .data(props.data.data)
  //   .enter()
  //   .append('g')
  //   .attr('class', 'candlestick')

  // 繪製蠟燭圖的線條
  // candlesticks
  //   .append('line')
  //   .attr('x1', (d, i) => xScale(i) + candleWidth / 2)
  //   .attr('x2', (d, i) => xScale(i) + candleWidth / 2)
  //   .attr('y1', (d) => yScale(d[3]))
  //   .attr('y2', (d) => yScale(d[4]))
  //   .attr('stroke', (d) => (d[1] > d[2] ? '#34D399' : '#EF4444'))
  //   .attr('stroke-width', 1)

  // // 繪製蠟燭圖的矩形
  // candlesticks
  //   .append('rect')
  //   .attr('x', (d, i) => xScale(i))
  //   .attr('y', (d) => yScale(Math.max(d[1], d[2])))
  //   .attr('width', candleWidth)
  //   .attr('height', (d) => Math.abs(yScale(d[1]) - yScale(d[2])))
  //   .attr('fill', (d) => (d[1] > d[2] ? '#34D399' : 'white'))
  //   .attr('stroke', (d) => (d[1] > d[2] ? '#34D399' : '#EF4444'))

  // 繪製面積圖
  const area = d3
    .area<[number, number]>()
    .x((d, i) => xScale(i))
    .y0(innerHeight)
    .y1((d) => yScale(d[1]))

  mainGroup
    .append('path')
    .datum(
      props.data.data.map((d, i) => {
        console.log(d)
        console.log(i)
        return [i, d[2]] as [number, number]
      })
    ) // 使用收盤價作為面積圖的數據
    .attr('fill', 'url(#gradient)')
    .attr('d', area)

  // 添加上方的 stroke
  mainGroup
    .append('path')
    .datum(props.data.data.map((d, i) => [i, d[2]] as [number, number])) // 使用收盤價作為線條的數據
    .attr('fill', 'none')
    .attr('stroke', '#883DCF') // 添加 stroke
    .attr('stroke-width', 2) // 設置 stroke 寬度
    .attr(
      'd',
      d3
        .line<[number, number]>()
        .x((d, i) => xScale(i))
        .y((d) => yScale(d[1]))
    )

  // 創建十字線
  const crosshairX = mainGroup
    .append('line')
    .attr('class', 'crosshair-x')
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .style('display', 'none')
    .attr('stroke', '#6B7280')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')

  const crosshairY = mainGroup
    .append('line')
    .attr('class', 'crosshair-y')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .style('display', 'none')
    .attr('stroke', '#6B7280')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')

  // 創建交叉點
  const crosshairPoint = mainGroup
    .append('circle')
    .attr('class', 'crosshair-point')
    .attr('r', 8) // 設置圓點半徑更大
    .style('display', 'none')
    .attr('fill', 'rgba(136, 61, 207, 0.2)') // 使用漸層填充
    .attr('stroke', '#883DCF') // 添加邊框顏色
    .attr('stroke-width', 1) // 設置邊框寬度

  // 創建提示框
  const tooltip = d3
    .select(tooltipRef.value)
    .style('position', 'absolute')
    .style('visibility', 'hidden')

  const text = svg
    .append('text')
    .attr('x', width - margin.right)
    .attr('y', margin.top / 2)
    .attr('font-size', '0.85em')
    .attr('fill', '#666')
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'hanging')

  // 添加鼠標事件
  mainGroup
    .append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .style('cursor', 'pointer')
    .on('mouseover', () => {
      crosshairX.style('display', null)
      crosshairY.style('display', null)
      crosshairPoint.style('display', null)
      tooltip.style('visibility', 'visible')
    })
    .on('mouseout', () => {
      crosshairX.style('display', 'none')
      crosshairY.style('display', 'none')
      crosshairPoint.style('display', 'none')
      tooltip.style('visibility', 'hidden')
    })
    .on('mousemove', (event) => {
      const [mx, my] = d3.pointer(event)
      const i = Math.floor(xScale.invert(mx))

      if (i >= 0 && i < props.data.data.length) {
        const data = props.data.data[i]
        // crosshairX.attr('transform', `translate(${xScale(i) + candleWidth / 2},0)`)
        crosshairX.attr('transform', `translate(${xScale(i)},0)`)
        crosshairY.attr('transform', `translate(0,${my})`)
        crosshairPoint.attr('transform', `translate(${xScale(i)},${my})`)

        // tooltip
        //   .style('left', `${event.pageX + 10}px`)
        //   .style('top', `${event.pageY - 10}px`)
        //   .html(formatTooltip(data))
        // 绘制数据提示信息

        text.text(formatText(data))

        tooltip.style('left', `10px`).style('top', `10px`).html(formatTooltip(data))
      }
    })
}

// 監聽視窗大小變化
let resizeObserver: ResizeObserver

onMounted(() => {
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        initChart()
      })
    })
    resizeObserver.observe(chartRef.value)
    initChart()
  }
})

// 監聽數據變化
watch(
  () => props.data,
  () => {
    initChart()
  },
  { deep: true }
)

// 組件銷毀時清理
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <div class="relative">
    <div ref="chartRef" class="w-full"></div>
    <div ref="tooltipRef" class="bg-white p-2 rounded shadow-lg text-sm whitespace-pre-line"></div>
  </div>
</template>

<style scoped>
.candlestick {
  shape-rendering: crispEdges;
}
</style>
