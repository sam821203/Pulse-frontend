<script setup>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

// 定義 `props`，接收 JSON 格式的股票數據
const props = defineProps({
  chartData: Object
})

const chartContainer = ref(null)
const margin = { top: 50, right: 50, bottom: 50, left: 80 }
const width = 800 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

// 繪製圖表的函數
const drawChart = () => {
  if (!chartContainer.value || !props.chartData || !props.chartData.data) return

  // 清除舊圖表
  d3.select(chartContainer.value).selectAll('*').remove()

  // 轉換 JSON 數據格式
  const parseDate = d3.timeParse('%Y%m%d')
  const data = props.chartData.data.map((d) => ({
    Date: parseDate(d[0]), // 日期轉換
    Close: d[1] // 收盤價
  }))

  // 設置 X 軸（時間）
  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Date))
    .range([0, width])

  // 設置 Y 軸（收盤價）
  const y = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Close) * 0.9, d3.max(data, (d) => d.Close) * 1.1])
    .range([height, 0])

  // 創建 SVG 畫布
  const svg = d3
    .select(chartContainer.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // 添加 X 軸
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%Y-%m-%d')))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')

  // 添加 Y 軸
  svg.append('g').call(d3.axisLeft(y))

  // 繪製折線
  const line = d3
    .line()
    .x((d) => x(d.Date))
    .y((d) => y(d.Close))

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#007BFF')
    .attr('stroke-width', 2)
    .attr('d', line)
}

// 當 `chartData` 更新時重新繪圖
watch(() => props.chartData, drawChart, { deep: true })

// 初次載入時繪製圖表
onMounted(drawChart)
</script>

<template>
  <div ref="chartContainer"></div>
</template>
