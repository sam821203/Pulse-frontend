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
// 假設昨日收盤價為 85
const previousClose = ref(0)

// 格式化日期顯示
const formatDate = (dateStr: string) => {
  return dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
}

const formatText = (data: [string, number, number, number, number, number, number]) => {
  return `${data[0].replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}
        交易時間：${data[1]} |
        開盤價: ${data[2]} |
        最高價: ${data[3]} |
        最低價: ${data[4]} |
        目前成交價: ${data[5]} |
        成交量: ${data[6]} |
        `
}

const initChart = () => {
  if (!chartRef.value) return
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
  const gradientAbove = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'gradientAbove')
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '0%')
    .attr('y2', '100%')

  gradientAbove
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#883DCF')
    .attr('stop-opacity', 0.8)

  gradientAbove
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#883DCF')
    .attr('stop-opacity', 0)

  const gradientBelow = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'gradientBelow')
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '0%')
    .attr('y2', '100%')

  gradientBelow
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#FF0000')
    .attr('stop-opacity', 0.8)

  gradientBelow
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#FF0000')
    .attr('stop-opacity', 0)

  const xScale = d3
    .scaleTime()
    .domain([0, 100])
    // .domain(d3.extent(props.data.data, (d) => new Date(`${d[0]}T${d[1]}`)) as [Date, Date])
    .range([0, innerWidth])

  // Y 軸比例尺
  // TODO: 用昨日收盤價加
  const yScale = d3
    .scaleLinear()
    .domain([previousClose.value * 0.9, previousClose.value * 1.1])
    .range([innerHeight, 0])

  // 繪製標題
  svg
    .append('text')
    .attr('x', margin.left)
    .attr('y', margin.top / 2)
    .attr('class', 'text-lg font-bold')

  // 創建主圖層
  const mainGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const xAxis = d3
    .axisBottom(xScale)
    .ticks(5)
    .tickFormat((d, i) => {
      const tickLabels = ['09:00', '10:00', '11:00', '12:00', '13:00', '13:30']
      return tickLabels[i] || ''
    })

  const xAxisGroup = mainGroup
    .append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis)

  mainGroup.append('g').attr('transform', `translate(0,${innerHeight})`).call(xAxis)

  // 繪製 Y 軸
  const yAxis = d3.axisLeft(yScale).ticks(5)
  const yAxisGroup = mainGroup.append('g').call(yAxis)

  // 添加 Y 軸網格線
  yAxisGroup.selectAll('.tick line').clone().attr('x2', innerWidth).attr('stroke-opacity', 0.1)

  // **新增 X 軸 tick 位置的垂直線**
  // xAxisGroup.selectAll('.tick').each(function (d) {
  //   const x = xScale(d) // 計算 tick 在 x 軸的位置
  //   mainGroup
  //     .append('line')
  //     .attr('x1', x)
  //     .attr('x2', x)
  //     .attr('y1', 0)
  //     .attr('y2', innerHeight)
  //     .attr('stroke', '#ccc') // 調整顏色
  //     .attr('stroke-dasharray', '3,3') // 虛線樣式
  //     .attr('stroke-opacity', 0.5)
  // })

  // 繪製面積圖
  // const areaAbove = d3
  //   .area<[number, number]>()
  //   .x((d, i) => {
  //     console.log('d: ', d)
  //     console.log('data: ', xScale(d[0]))
  //     return xScale(d[0])
  //   })
  //   .y0(yScale(previousClose)) // 以昨日收盤價為基準線
  //   .y1((d) => yScale(Math.max(d[1], previousClose)))

  // const areaBelow = d3
  //   .area<[number, number]>()
  //   .x((d, i) => {
  //     return xScale(new Date(`2025-02-27T${props.data.data[i][1]}:00`))
  //   })
  //   .y0(yScale(previousClose))
  //   .y1((d) => yScale(Math.min(d[1], previousClose)))

  // mainGroup
  //   .append('path')
  //   .datum(
  //     props.data.data.map((d, i) => {
  //       return [new Date(`${d[0]}T${d[1]}`).getTime(), +d[5]] as [number, number]
  //     })
  //   ) // 使用收盤價作為面積圖的數據
  //   .attr('fill', 'url(#gradientAbove)')
  //   .attr('d', areaAbove)

  // mainGroup
  //   .append('path')
  //   .datum(
  //     props.data.data.map((d, i) => {
  //       return [new Date(`2025-02-27T${d[1]}:00`).getTime(), +d[2]] as [number, number]
  //     })
  //   )
  //   .attr('fill', 'url(#gradientBelow)')
  //   .attr('d', areaBelow)

  // // 添加上方的 stroke
  // mainGroup
  //   .append('path')
  //   .datum(
  //     props.data.data.map((d, i) => {
  //       return [new Date(`2025-02-27T${d[1]}:00`).getTime(), +d[2]] as [number, number]
  //     })
  //   ) // 使用收盤價作為線條的數據
  //   .attr('fill', 'none')
  //   .attr('stroke', (d) => (d[1] >= previousClose ? '#883DCF' : '#FF0000')) // 根據價格變化顏色
  //   .attr('stroke-width', 2) // 設置 stroke 寬度
  //   .attr(
  //     'd',
  //     d3
  //       .line<[number, number]>()
  //       .x((d) => xScale(new Date(d[0])))
  //       .y((d) => yScale(d[1]))
  //   )

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
      const date = xScale.invert(mx)
      const i = d3
        .bisector((d: [number, number]) => d[0])
        .left(
          props.data.data.map((d) => [new Date(`2025-02-27T${d[1]}:00`).getTime(), +d[2]]),
          date.getTime()
        )

      if (i >= 0 && i < props.data.data.length) {
        const data = props.data.data[i]
        const x = xScale(new Date(`2025-02-27T${data[1]}:00`))
        const y = yScale(data[2])

        crosshairX.attr('transform', `translate(${x},0)`)
        crosshairY.attr('transform', `translate(0,${y})`)
        crosshairPoint.attr('transform', `translate(${x},${y})`)

        text.text(formatText(data))

        // tooltip
        //   .style('left', `${event.pageX + 10}px`)
        //   .style('top', `${event.pageY - 10}px`)
        //   .html(formatTooltip(data))
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
    previousClose.value = Number(props.data.data[0][5])
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
