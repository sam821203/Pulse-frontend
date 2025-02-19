<script setup lang="ts">
import * as d3 from 'd3'

interface ChartData {
  發病年週: string
  確定病例數: string
}

const chartData = ref<ChartData[]>([])

const drawChart = () => {
  const rwdSvgWidth = parseInt(d3.select('.chart').style('width'))
  const rwdSvgHeight = rwdSvgWidth * 0.5
  const margin = 40
  const bandWidth = 20
  const svg = d3
    .select('.chart')
    .append('svg')
    .attr('width', rwdSvgWidth)
    .attr('height', rwdSvgHeight)

  // map 資料集
  // 取週數
  const xData = chartData.value.map((i: ChartData) => parseInt(i['發病年週'].substring(4, 6)))

  // 取病例數
  const yData = chartData.value.map((i: ChartData) => parseInt(i['確定病例數']))

  // 設定要給 X 軸用的 scale 跟 axis
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(xData) as [number, number])
    .range([margin, rwdSvgWidth - margin]) // 寬度

  // rwd X軸的刻度
  let tickNumber = window.innerWidth > 900 ? xData.length / 2 : 8
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(tickNumber)
    .tickFormat((d: d3.NumberValue, i: number) => d.valueOf() + '週')

  // 呼叫繪製x軸、調整x軸位置
  const xAxisGroup = svg
    .append('g')
    .call(xAxis)
    .attr('transform', `translate(0,${rwdSvgHeight - margin})`)

  // 設定要給 Y 軸用的 scale 跟 axis
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(yData) as number])
    .range([rwdSvgHeight - margin, margin]) // 數值要顛倒，才會從低往高排

  const yAxis = d3.axisLeft(yScale).ticks(5)

  // 呼叫繪製y軸、調整y軸位置
  const yAxisGroup = svg.append('g').call(yAxis).attr('transform', `translate(${margin},0)`)

  // 設定 path 的 d
  const lineChart = d3
    .line<ChartData>()
    .x((d) => xScale(parseInt(d['發病年週'].substring(4, 6))))
    .y((d) => yScale(parseInt(d['確定病例數'])))

  // 建立折線圖
  svg
    .append('path')
    .datum(chartData.value)
    .attr('d', lineChart)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)

  // 使用 d3.bisector() 找到滑鼠的 X 軸 index 值
  const bisect = d3.bisector((d: { [x: string]: any }) => d['發病年週']).left

  // 建立沿著折線移動的圓點點
  const focus = svg
    .append('g')
    .append('circle')
    .style('fill', 'none')
    .attr('stroke', 'black')
    .attr('r', 5)
    .style('opacity', 0)

  // 建立移動的資料標籤
  const focusText = svg
    .append('g')
    .append('text')
    .style('opacity', 0)
    .attr('text-anchor', 'left')
    .attr('alignment-baseline', 'middle')

  // 建立垂直和水平線
  const verticalLine = svg
    .append('line')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4')
    .style('opacity', 0)

  const horizontalLine = svg
    .append('line')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4')
    .style('opacity', 0)

  const mouseover = () => {
    focus.style('opacity', 1)
    focusText.style('opacity', 1)
    verticalLine.style('opacity', 1)
    horizontalLine.style('opacity', 1)
  }

  const mousemove = (event: MouseEvent) => {
    // 把目前X的位置用xScale去換算
    const x0 = xScale.invert(d3.pointer(event)[0])
    // 由於我的X軸資料是擷取過的，這邊要整理並補零
    const fixedX0 = x0.toString().padStart(2, '0')
    // 接著把擷取掉的2021補回來，因為data是帶入原本的資料
    let i = bisect(chartData.value, '2021' + fixedX0)
    const selectedData = chartData.value[i]

    // 圓點
    focus
      // 換算到X軸位置時，一樣使用擷取過的資料，才能準確換算到正確位置
      .attr('cx', xScale(parseInt((selectedData['發病年週'] as string).substring(4, 6))))
      .attr('cy', yScale(parseInt(selectedData['確定病例數'])))

    focusText
      .html('確診人數：' + selectedData['確定病例數'])
      .attr('x', xScale((selectedData['發病年週'] as string).substring(4, 6)) + 15)
      .attr('y', yScale(selectedData['確定病例數']))

    // 更新垂直和水平線的位置
    verticalLine
      .attr('x1', xScale((selectedData['發病年週'] as string).substring(4, 6)))
      .attr('x2', xScale((selectedData['發病年週'] as string).substring(4, 6)))
      .attr('y1', margin)
      .attr('y2', rwdSvgHeight - margin)

    horizontalLine
      .attr('x1', margin)
      .attr('x2', rwdSvgWidth - margin)
      .attr('y1', yScale(selectedData['確定病例數']))
      .attr('y2', yScale(selectedData['確定病例數']))
  }

  const mouseout = () => {
    focus.style('opacity', 0)
    focusText.style('opacity', 0)
  }

  // 建立一個覆蓋svg的方形
  svg
    .append('rect')
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr('width', rwdSvgWidth - margin)
    .attr('height', rwdSvgHeight - margin)
    .style('cursor', 'pointer')
    .on('mouseover', mouseover)
    .on('mousemove', (event: any) => mousemove(event))
    .on('mouseout', mouseout)
}

const getData = async () => {
  const dataGet = (await d3.csv(
    '../../../../public/data/20201-202140-covid19.csv'
  )) as unknown as ChartData[]
  chartData.value = dataGet.filter((i) => parseInt(i['發病年週']) > 202101)
  drawChart()
}

onMounted(() => {
  getData()
})

// d3.select(window).on('resize', drawChart)
</script>

<template>
  <div class="chart"></div>
</template>

<style scoped lang="scss">
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.chart {
  width: 100%;
  width: 800px;
  height: 400px;
  min-width: 300px;
  /* margin: auto; */
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #eb3d4d;
  &__current {
    font-size: 2rem;
  }
  &__percentage {
    position: relative;
    margin-top: 4px;
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
  &.price--green {
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

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
