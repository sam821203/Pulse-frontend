<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import loading from '@/utils/loading'
import {
  getRealTimeStockInfo,
  getCategoryInfo,
  getEquitiesValuesFromTickers,
  getListedCompanyOpenData,
  getOTCOpenData,
  getTest,
  getStockInfoRealTime
} from '@/api/stock/index'
import type { StockData, ListedCompanyData, OTCCompanyData } from '../model/interface'
// import CandlestickChart from '../components/C  andlestickChart.vue'
import CrosshairChart from '../components/CrosshairChart.vue'
// import StockChart from '../components/StockChart.vue'
import type { ChartData, ChartScaleData } from '../model/interface'
import cloneDeep from 'lodash/cloneDeep'
import { subscribeStock } from '@/api/webSocket/socketService.js'
import { string } from 'yup'

const route = useRoute()

const stockNo = ref('2330')
const chartData = ref([])
const priceLower = ref(false)
const currentStock = reactive({
  market: route.query.market,
  symbol: route.query.symbol,
  industry: route.query.industry
})

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
  previousClose: '', // 昨收
  issueShares: '' // 實收資本額
})

// 中文標籤與對應字段
const fieldLabels: Partial<Record<keyof StockData, string>> = {
  sellVolume: '揭示賣量',
  marketType: '上市別',
  buyVolume: '揭示買量',
  lastTradeDate: '最近交易日期',
  buyPrice: '揭示買價',
  stockCode: '股票代號',
  sellPrice: '揭示賣價',
  openingPrice: '開盤價',
  lowestPrice: '最低價',
  highestPrice: '最高價',
  downLimitPrice: '跌停價',
  upLimitPrice: '漲停價',
  currentVolume: '當盤成交量',
  companyName: '公司全名',
  currentPrice: '當盤成交價',
  previousClose: '昨收價'
}

const formatNumber = (value: string) => {
  const number = parseFloat(value.replace(/,/g, ''))
  return isNaN(number) ? value : number.toFixed(2)
}

const formatDate = (dateString: string): string => {
  if (dateString.length !== 8) {
    throw new Error('Invalid date format')
  }
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  return `${year}/${month}/${day}`
}

// 定義一個函數來格式化時間
const formatTime = (timeString: string): string => {
  if (timeString.length !== 8) {
    throw new Error('Invalid time format')
  }
  const hours = timeString.substring(0, 2)
  const minutes = timeString.substring(3, 5)
  return `${hours}:${minutes}`
}

const stockDataAdapter = (data: any) => {
  return {
    sellVolume: formatNumber(data.f),
    marketType: data.ex,
    buyVolume: formatNumber(data.g),
    lastTradeDate: formatDate(data.d),
    buyPrice: formatNumber(data.b),
    stockCode: data.c,
    sellPrice: formatNumber(data.a),
    companyShortName: data.n,
    openingPrice: formatNumber(data.o),
    lowestPrice: formatNumber(data.l),
    highestPrice: formatNumber(data.h),
    downLimitPrice: formatNumber(data.w),
    accumulatedVolume: data.v,
    upLimitPrice: formatNumber(data.u),
    lastTradeTime: formatTime(data.t),
    currentVolume: data.tv,
    companyName: data.nf,
    currentPrice: formatNumber(data.z),
    previousClose: formatNumber(data.y)
  }
}

const currentChartData = reactive<ChartScaleData>({
  date: '',
  time: '',
  open: '',
  high: '',
  low: '',
  close: '',
  volume: ''
})

const getStockRealTime = async () => {
  try {
    const resp = await getRealTimeStockInfo(
      currentStock.market as 'tse' | 'otc',
      currentStock.symbol as string
    )
    const data = stockDataAdapter(resp.msgArray[0])
    Object.assign(stockData, data)
    // const {
    //   lastTradeDate,
    //   lastTradeTime,
    //   openingPrice,
    //   highestPrice,
    //   lowestPrice,
    //   currentPrice,
    //   currentVolume
    // } = stockData
    // currentChartData.date = lastTradeDate || ''
    // currentChartData.time = lastTradeTime || ''
    // currentChartData.open = openingPrice || ''
    // currentChartData.high = highestPrice || ''
    // currentChartData.low = lowestPrice || ''
    // currentChartData.close = currentPrice || ''
    // currentChartData.volume = currentVolume || ''
    // TODO: 必須在一開始存取美股檔的歷史資料，否則當切換股票時，無法取得
    // const newChartData = cloneDeep(currentChartData)
    // chartData2.data.push(newChartData)
    // console.log('chartData2:', chartData2.data)

    // localStorage.setItem('chartData2', JSON.stringify(chartData2.data))

    // 取得本益比
    // fetchEquitiesValues()
  } catch (err) {
    // TODO: 統一處理錯誤
    console.error(err)
  }
}

const getCategory = async () => {
  // const category = stockData.marketType === 'tse' ? '上市' : '上櫃'
  // https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=tse&i=02
  try {
    // 24：半導體
    const resp = await getCategoryInfo('tse', '24')
    if (resp.rtcode === '0000') {
      // console.log('category:', resp)
    }
  } catch (err) {
    console.error(err)
  }
}

const getCompanyOpenData = async () => {
  try {
    if (currentStock.market === 'tse') {
      const resp: ListedCompanyData[] = await getListedCompanyOpenData()
      const stockInfo = resp.find((stock) => stock['公司代號'] === currentStock.symbol)
      if (stockInfo) {
        stockData.issueShares = stockInfo['實收資本額']
      }
    } else {
      const resp: OTCCompanyData[] = await getOTCOpenData()
      const stockInfo = resp.find((stock) => stock.SecuritiesCompanyCode === currentStock.symbol)
      if (stockInfo) {
        stockData.issueShares = stockInfo.IssueShares
      }
    }
  } catch (err) {
    console.error('Error fetching company open data:', err)
  }
}

const initStockTimer = async () => {
  let delay = 3000
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
      getStockRealTime()
      timerId = setTimeout(request, delay)
    } else {
      clearTimeout(timerId)
    }
  }, delay)
}

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

interface EquitiesData {
  peRatio: string
}

const equitiesData = ref<EquitiesData>({ peRatio: '' })

// 取得本益比
const fetchEquitiesValues = async () => {
  try {
    const resp = await getEquitiesValuesFromTickers({
      symbol: stockData.stockCode,
      name: stockData.companyShortName,
      date: '2025-01-10'
    })

    equitiesData.value.peRatio = resp.peRatio?.toString() || ''
    // console.log('equitiesData:', equitiesData.value)
  } catch (err) {
    // TODO: 統一處理錯誤
    console.error(err)
  }
}

const test = async () => {
  const resp = await getTest()
  const formattedData = resp.data.map((item: any[]) => {
    const result: { [key: string]: any } = {}
    resp.fields.forEach((field: string, index: number) => {
      result[field] = item[index]
    })
    return result
  })
}

// 定義對應的參數項目
const stockDataMapping = {
  Date: 'lastTradeDate', // 交易日期
  Time: 'lastTradeTime', // 交易時間
  Open: 'openingPrice', // 開盤價
  High: 'highestPrice', // 最高價
  Low: 'lowestPrice', // 最低價
  Close: 'currentPrice', // 收盤價
  Volume: 'currentVolume' // 當盤成交量
}

// 使用迴圈將對應的參數項目塞入 chartData2.data
const updateChartData = () => {
  const newData = []
  for (const [key, value] of Object.entries(stockDataMapping)) {
    if (Object.prototype.hasOwnProperty.call(stockData, value)) {
      newData.push(stockData[value as keyof StockData])
    }
  }
  console.log('newData:', newData)
  // chartData2.data.push(newData)

  const todayRecords = []
  const startTime = new Date('2025-02-21T09:00:00')
  for (let i = 0; i < 5; i++) {
    const time = new Date(startTime.getTime() + i * 3 * 60000) // 每 3 分鐘一筆資料
    const formattedTime = time.toTimeString().substring(0, 5)
    const record = [
      '2025/02/25',
      formattedTime,
      (1080 + i * 0.5).toFixed(2), // 開盤價
      (1090 + i * 0.5).toFixed(2), // 最高價
      (1075 + i * 0.5).toFixed(2), // 最低價
      (1085 + i * 0.5).toFixed(2), // 收盤價
      5000 + i * 100 // 成交量
    ]
    todayRecords.push(record)
  }

  todayRecords.forEach((record) => chartData2.data.push(record.map(String)))
  console.log('chartData2:', chartData2)
}

// 模擬股票交易並每分鐘更新一次
const generateMockData = () => {
  const todayRecords = []
  const startTime = new Date('2025-02-27T09:00:00')
  let currentTime = startTime
  let openPrice = 85.0

  for (let i = 0; i < 100; i++) {
    const formattedTime = currentTime.toTimeString().substring(0, 5)
    if (formattedTime > '13:30') break

    const highPrice = Math.min(openPrice * 1.1, openPrice + Math.random() * 2).toFixed(2)
    const lowPrice = Math.max(openPrice * 0.9, openPrice - Math.random() * 2).toFixed(2)
    const currentPrice = parseFloat((openPrice + Math.random() * 2 - 1).toFixed(2))

    const volume = Math.floor(Math.random() * 10) + 1

    const record = [
      '2025/02/27',
      formattedTime,
      openPrice,
      highPrice,
      lowPrice,
      currentPrice,
      volume
    ]
    todayRecords.push(record)

    currentTime = new Date(currentTime.getTime() + 3 * 60000) // 每 3 分鐘一筆資料
  }

  todayRecords.forEach((record) => chartData2.data.push(record))
  console.log('chartData2:', chartData2)
}

// TODO: 串接當盤交易量
// 當盤成交量 currentVolume
// 成交時間 {{ stockData.lastTradeDate }} {{ stockData.lastTradeTime }}
// 當前股價 {{ stockData.currentPrice }}
// 開盤價
// 最高價
// 最低價
// 跌停價
// 漲停價
const chartData2 = reactive<ChartData>({
  data: []
})

// async function fetchStockHistory() {
//   const response = await getStockInfoRealTime('9199')
//   // const data = await response.json()
//   console.log(response)
// }

// fetchStockHistory()

const subscribeToStock = () => {
  subscribeStock('2027', (data: any) => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const day = now.getDay()
    // 只在週一到週五進行抓取
    if (day === 0 || day === 6) return

    // 只在每天的 09:00-13:30 之間進行抓取
    if (hours >= 9 && (hours < 13 || (hours === 13 && minutes <= 30))) {
      // console.log('subscribeStock:', data)
      // 處理接收到的數據
      const record = [
        data.lastTradeDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
        data.lastTradeTime,
        data.openingPrice,
        data.highestPrice,
        data.lowestPrice,
        data.previousClose,
        data.currentPrice,
        data.currentVolume
      ]
      console.log('record: ', record)
      chartData2.data.push(record)
    }
  })
}

watch(
  route,
  async (newRoute) => {
    // Object.assign(newRoute.query, currentStock)
    currentStock.market = newRoute.query.market
    currentStock.symbol = newRoute.query.symbol
    currentStock.industry = newRoute.query.industry
    // await getStockRealTime()
    await getCompanyOpenData()
    // updateChartData()
  }
  // { immediate: true }
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
  // initStockTimer()
  // loading.stop()
})

onBeforeMount(() => {
  loading.start()
  getStockRealTime()
  initStockTimer()
  getCategory()
  getCompanyOpenData()
  test()
  // generateMockData()
  // if (chartData2.data.length !== 0) {
  // }
  loading.stop()
})

onMounted(() => {
  subscribeToStock()
})
</script>

<template>
  <div class="card">
    <div class="flex items-center">
      <MainHeader :title="stockData.companyShortName || ''" />
      <span class="text-xl text-gray-500">{{ stockData.stockCode }}</span>
    </div>
    <div :class="['price', 'flex', 'items-center', 'mb-4', { 'price--green': priceLower }]">
      <span class="price__current">{{ stockData.sellPrice }}</span>
      <span class="ml-6 price__percentage">{{ calculatePriceChange }}%</span>
    </div>
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <Tag
          class="mr-5"
          style="font-weight: 500"
          severity="help"
          :value="currentStock.industry"
        ></Tag>
        <div class="mr-5">
          <span class="mr-1 text-gray-400">成交張數</span>
          <span class="font-medium">{{ stockData.accumulatedVolume }}</span>
        </div>
        <div class="mr-5">
          <span class="mr-1 text-gray-400">本益比</span>
          <span class="font-medium">{{ equitiesData.peRatio }}</span>
        </div>
        <div class="mr-5">
          <span class="mr-1 text-gray-400">實收資本額</span>
          <span class="font-medium" v-amount-format="stockData.issueShares"></span>
        </div>
      </div>
      <div>
        <p class="mr-1 text-gray-400">
          <span class="mr-2">成交時間</span>|<span class="ml-2"
            >{{ stockData.lastTradeDate }} {{ stockData.lastTradeTime }}</span
          >
        </p>
      </div>
    </div>
  </div>
  <Tabs value="0">
    <TabList>
      <Tab value="0">即時走勢</Tab>
      <Tab value="1">技術分析</Tab>
      <Tab value="2">籌碼分析</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <div class="flex m-0">
          <div class="w-3/4 mx-auto">
            <!-- <StockChart :chart-data="chartData2" /> -->
            <CrosshairChart :data="chartData2" />
            <!-- <CandlestickChart :data="dataCSV" /> -->
          </div>
          <div class="w-1/4 pl-4">
            <div v-for="(label, key) in fieldLabels" :key="key" class="form-group">
              <label :for="key">{{ label }}：</label>
              <span class="form-control">{{ stockData[key] }}</span>
            </div>
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
  height: 2.75rem;
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
