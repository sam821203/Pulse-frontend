<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
import type { ChartData } from '../model/interface'

const props = defineProps<{
  chartData?: ChartData
}>()

const chartContainer = ref<HTMLElement | null>(null)
const margin = { top: 50, right: 50, bottom: 50, left: 80 }
const width = 800 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const drawChart = () => {
  if (!chartContainer.value || !props.chartData?.data) return

  d3.select(chartContainer.value).selectAll('*').remove()

  const parseDate = d3.timeParse('%Y%m%d')
  const data = props.chartData.data
    .map((d) => ({
      Date: parseDate(String(d[0])),
      Close: Number(d[1])
    }))
    .filter((d): d is { Date: Date; Close: number } => d.Date !== null)

  if (data.length === 0) return

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Date) as [Date, Date])
    .range([0, width])

  const y = d3
    .scaleLinear()
    .domain([
      (d3.min(data, (d) => d.Close) ?? 0) * 0.9,
      (d3.max(data, (d) => d.Close) ?? 0) * 1.1
    ])
    .range([height, 0])

  const svg = d3
    .select(chartContainer.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')

  svg.append('g').call(d3.axisLeft(y))

  const line = d3
    .line<{ Date: Date; Close: number }>()
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

watch(() => props.chartData, drawChart, { deep: true })

onMounted(drawChart)
</script>

<template>
  <div ref="chartContainer" />
</template>
