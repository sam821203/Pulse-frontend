<script setup lang="ts">
import * as d3 from 'd3'
import LineChart from '../components/LineChart.vue'
import MainHeader from '@/components/MainHeader.vue'
import loading from '@/utils/loading'
import { getRealTimeStockInfo } from '@/api/stock/index'

const route = useRoute()

interface StockData {
  sellVolume: string
  marketType: string
  buyVolume: string
  lastTradeDate: string
  buyPrice: string
  stockCode: string
  sellPrice: string
  companyShortName: string
  openingPrice: string
  lowestPrice: string
  highestPrice: string
  downLimitPrice: string
  accumulatedVolume: string
  upLimitPrice: string
  lastTradeTime: string
  currentVolume: string
  companyName: string
  currentPrice: string
  previousClose: string
}

const stockNo = ref('2330')
const chartData = ref([])
const priceLower = ref(false)
const currentStock = reactive({
  market: route.query.market,
  symbol: route.query.symbol
})

// 每日市場成交資訊
// 'https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=20220701'

// fetch('https://www.twse.com.tw/exchangeReport/FMTQIK')
//   .then((response) => response.json())
//   .then((res) => {
//     console.log('res: ', res)
//   })
//   .catch((err) => console.error(err))

// 查詢各股歷史資料
const getStockData = () => {
  const apiUrl: string = 'https://www.twse.com.tw/exchangeReport/STOCK_DAY' // api 呼叫網址
  let dailyRow: any[] = []
  const today: Date = new Date()
  const todayFormate: Date = today // 格式化今天日期
  const twYear: number = today.getFullYear() - 1911 // 中華民國年份
  const todayTwFormat: number = twYear // 中華民國日期格式
  const todayEmailFormat: Date = today // 郵件日期格式化
  let fetchUrl: string
  let data: any
  let closePrice: number
  let variation: number
  let volume: number

  // 組合 api 參數, 加上今天日期、股票代號
  fetchUrl = apiUrl + '?date=' + todayFormate + '&stockNo=' + stockNo.value

  // 呼叫 api 取得大盤成交資訊
  fetch(fetchUrl)
    .then((response) => response.json())
    .then((res) => {
      data = res
      console.log(data)
    })
    .catch((err) => console.error(err))

  for (let i in data) {
    // 只取今日資料
    if (data[i][0] == todayTwFormat) {
      closePrice = removeComma(data[i][6]) // 收盤指數 數字格式化
      variation = removeComma(data[i][7]) // 漲跌點數 數字格式化
      volume = removeComma(data[i][2]) // 成交量 數字格式化

      // 整理成交量格式為(億)
      volume = parseInt((volume / 100000000).toString())

      dailyRow = [todayEmailFormat, closePrice, variation, volume]
    }
  }

  // // 如果有今日資料
  // if (dailyRow.length) {
  //   // 工作表增加一列資料
  //   index_sheet.appendRow(dailyRow)

  //   // 寄信通知
  //   sendMailStock(dailyRow)
  // }

  // 數字格式化
  function removeComma(number: any) {
    return number.replace(/,/g, '')
  }
}

const stockData = reactive<StockData>({
  sellVolume: '', // 揭示賣量 (配合「sellPrice」，以_分隔資料)
  marketType: '', // 上市別 (上市:tse，上櫃:otc，空白:已下市或下櫃)
  buyVolume: '', // 揭示買量 (配合「buyPrice」，以_分隔資料)
  lastTradeDate: '', // 最近交易日期 (YYYYMMDD)
  buyPrice: '', // 揭示買價 (從高到低，以_分隔資料)
  stockCode: '', // 股票代號
  sellPrice: '', // 揭示賣價 (從低到高，以_分隔資料)
  companyShortName: '', // 公司簡稱
  openingPrice: '', // 開盤
  lowestPrice: '', // 最低
  highestPrice: '', // 最高
  downLimitPrice: '', // 跌停價
  accumulatedVolume: '', // 累積成交量
  upLimitPrice: '', // 漲停價
  lastTradeTime: '', // 最近成交時刻 (HH:MM:SS)
  currentVolume: '', // 當盤成交量
  companyName: '', // 公司全名
  currentPrice: '', // 當盤成交價
  previousClose: '' // 昨收
})

// 中文標籤與對應字段
const fieldLabels: Record<keyof StockData, string> = {
  sellVolume: '揭示賣量',
  marketType: '上市別',
  buyVolume: '揭示買量',
  lastTradeDate: '最近交易日期',
  buyPrice: '揭示買價',
  stockCode: '股票代號',
  sellPrice: '揭示賣價',
  companyShortName: '公司簡稱',
  openingPrice: '開盤價',
  lowestPrice: '最低價',
  highestPrice: '最高價',
  downLimitPrice: '跌停價',
  accumulatedVolume: '累積成交量',
  upLimitPrice: '漲停價',
  lastTradeTime: '最近成交時刻',
  currentVolume: '當盤成交量',
  companyName: '公司全名',
  currentPrice: '當盤成交價',
  previousClose: '昨收價'
}

const formatNumber = (value: string) => {
  const number = parseFloat(value.replace(/,/g, ''))
  return isNaN(number) ? value : number.toFixed(2)
}

const stockDataAdapter = (data: any) => {
  return {
    sellVolume: formatNumber(data.f),
    marketType: data.ex,
    buyVolume: formatNumber(data.g),
    lastTradeDate: data.d,
    buyPrice: formatNumber(data.b),
    stockCode: data.c,
    sellPrice: formatNumber(data.a),
    companyShortName: data.n,
    openingPrice: formatNumber(data.o),
    lowestPrice: formatNumber(data.l),
    highestPrice: formatNumber(data.h),
    downLimitPrice: formatNumber(data.w),
    accumulatedVolume: formatNumber(data.v),
    upLimitPrice: formatNumber(data.u),
    lastTradeTime: data.t,
    currentVolume: formatNumber(data.tv),
    companyName: data.nf,
    currentPrice: formatNumber(data.z),
    previousClose: formatNumber(data.y)
  }
}

const getStockDetail = async () => {
  loading.start()
  try {
    const resp = await getRealTimeStockInfo(
      currentStock.market as 'tse' | 'otc',
      currentStock.symbol as string
    )
    const data = await resp.json()
    const adaptedData = stockDataAdapter(data.msgArray[0])
    Object.assign(stockData, adaptedData)
  } catch (err) {
    console.error(err)
  } finally {
    loading.stop()
  }
}

const getCategory = async () => {
  // const category = stockData.marketType === 'tse' ? '上市' : '上櫃'
  // https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=tse&i=24
  try {
    const response = await fetch(`/api/stock/getCategory.jsp?ex=tse&i=02`)
    const data = await response.json()
    console.log('category:', data)
  } catch (err) {
    console.error(err)
  }
}

const initFetchStockDataTime = async () => {
  let delay = 5000
  // 進頁面時請求一次
  // await nextTick()
  // getStockDetail()

  let timerId = setTimeout(function request() {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const day = now.getDay()

    if (day === 0 || day === 6) {
      clearTimeout(timerId)
      return
    }

    if (hours >= 9 && (hours < 13 || (hours === 13 && minutes <= 30))) {
      getStockDetail()
      timerId = setTimeout(request, delay)
    } else {
      clearTimeout(timerId)
    }
  }, delay)
}

const stockTitle = computed(() => {
  return stockData.companyShortName + ' (' + stockData.stockCode + ')'
})

const drawChart = () => {
  // 刪除原本的svg.charts，重新渲染改變寬度的svg
  d3.select('.chart svg').remove()

  // RWD 的 svg 寬高
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
  const xData = chartData.value.map((i: { [key: string]: string }) =>
    parseInt(i['發病年週'].substring(4, 6))
  )

  // 取病例數
  const yData = chartData.value.map((i) => parseInt(i['確定病例數']))

  // 設定要給 X 軸用的 scale 跟 axis
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(xData))
    .range([margin, rwdSvgWidth - margin]) // 寬度

  // rwd X軸的刻度
  let tickNumber = window.innerWidth > 900 ? xData.length / 2 : 8
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(tickNumber)
    .tickFormat((d: string) => d + '週')

  // 呼叫繪製x軸、調整x軸位置
  const xAxisGroup = svg
    .append('g')
    .call(xAxis)
    .attr('transform', `translate(0,${rwdSvgHeight - margin})`)

  // 設定要給 Y 軸用的 scale 跟 axis
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(yData)])
    .range([rwdSvgHeight - margin, margin]) // 數值要顛倒，才會從低往高排

  const yAxis = d3.axisLeft(yScale).ticks(5)

  // 呼叫繪製y軸、調整y軸位置
  const yAxisGroup = svg.append('g').call(yAxis).attr('transform', `translate(${margin},0)`)

  // 設定 path 的 d
  const lineChart = d3
    .line()
    .x((d: { [x: string]: string }) => xScale(parseInt(d['發病年週'].substring(4, 6))))
    .y((d: { [x: string]: string }) => yScale(parseInt(d['確定病例數'])))

  // 建立折線圖
  svg
    .append('path')
    .data(chartData.value)
    .attr('d', lineChart(chartData.value))
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
    const fixedX0 = parseInt(x0).toString().padStart(2, '0')
    // 接著把擷取掉的2021補回來，因為data是帶入原本的資料
    let i = bisect(chartData.value, '2021' + fixedX0)
    const selectedData = chartData.value[i]

    // 圓點
    focus
      // 換算到X軸位置時，一樣使用擷取過的資料，才能準確換算到正確位置
      .attr('cx', xScale((selectedData['發病年週'] as string).substring(4, 6)))
      .attr('cy', yScale(selectedData['確定病例數']))

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
  const dataGet = await d3.csv('../../../../public/data/20201-202140-covid19.csv')
  chartData.value = dataGet.filter((i: { [x: string]: number }) => i['發病年週'] > 202101)
  drawChart()
}

// d3.select(window).on('resize', drawChart)

// 漲幅百分比(%)= (現價 - 昨收價) / 昨收價 ×100
const calculatePriceChange = computed(() => {
  let changePercentage =
    ((Number(stockData.sellPrice) - Number(stockData.previousClose)) /
      Number(stockData.previousClose)) *
    100
  if (changePercentage > 0) {
    priceLower.value = false
  } else {
    changePercentage = changePercentage * -1
    priceLower.value = true
  }
  return changePercentage.toFixed(2)
})

watch(
  route,
  async (newRoute) => {
    currentStock.market = newRoute.query.market
    currentStock.symbol = newRoute.query.symbol
    await getStockDetail()
  },
  { immediate: true }
)

// query 放在這裡會過早，導致娶不到 route query
onBeforeRouteUpdate(async (to, from) => {
  // only fetch the user if the id changed as maybe only the query or the hash changed
  // if (to.params.id !== from.params.id) {
  //   userData.value = await fetchUser(to.params.id)
  // }
  // console.log('onBeforeRouteUpdate: ', route.query.stockId)
  // loading.start()
  // console.log('onBeforeRouteUpdate')
  // initFetchStockDataTime()
  // loading.stop()
})

onMounted(() => {
  initFetchStockDataTime()
  // getCategory()
})
</script>

<template>
  <div class="card">
    <MainHeader :title="stockTitle" iconType="pi pi-address-book" />
    <div :class="['price', 'flex', 'items-center', 'mb-4', { 'price--green': priceLower }]">
      <span class="price__current">{{ stockData.sellPrice }}</span>
      <span class="ml-6 price__percentage">{{ calculatePriceChange }}%</span>
    </div>
    <!-- TODO: 分類股群 -->
    <Tag style="font-weight: 500" severity="info" value="電子上游-IC-代工"></Tag>
  </div>
  <Tabs value="0">
    <TabList>
      <Tab value="0">即時走勢</Tab>
      <Tab value="1">技術分析</Tab>
      <Tab value="2">籌碼分析</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <div class="m-0">
          <!-- <div class="chart"></div> -->
          <!-- <LineChart /> -->
          <div v-for="(label, key) in fieldLabels" :key="key" class="form-group">
            <label :for="key">{{ label }}：</label>
            <span class="form-control">{{ stockData[key] }}</span>
          </div>
        </div>
      </TabPanel>
      <TabPanel value="1">
        <p class="m-0">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
        </p>
      </TabPanel>
      <TabPanel value="2">
        <p class="m-0">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis</p>
      </TabPanel>
    </TabPanels>
  </Tabs>
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
