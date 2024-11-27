<script setup lang="ts">
import { getTwse } from '../api/twse/index'

// getTwse().then((res) => {
//   console.log(res)
// })

defineProps<{
  msg: string
}>()

// const stockNo = ref('')
const stockNo2 = ref('2330')

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
    console.log('number: ', number)
    return number.replace(/,/g, '')
  }
}

const listedCompany = 'tse'
const overTheCounterCompany = 'otc'
const stockData = reactive({
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
const fieldLabels = {
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

// TODO: 寫排程，每5秒，取一次 API
const getDetail = () => {
  fetch(`/api/stock/getStockInfo.jsp?ex_ch=${listedCompany}_${stockNo2.value}.tw&json=1&delay=0`)
    .then((response) => response.json())
    .then((data) => {
      console.log('資料：', data.msgArray)
      // f 揭示賣量(配合「a」，以_分隔資料)
      stockData.sellVolume = data.msgArray[0].f
      // ex 上市別(上市:tse，上櫃:otc，空白:已下市或下櫃)
      stockData.marketType = data.msgArray[0].ex
      // g 揭示買量(配合「b」，以_分隔資料)
      stockData.buyVolume = data.msgArray[0].g
      // d 最近交易日期(YYYYMMDD)
      stockData.lastTradeDate = data.msgArray[0].d
      // b 揭示買價(從高到低，以_分隔資料)
      stockData.buyPrice = data.msgArray[0].b
      // c 股票代號
      stockData.stockCode = data.msgArray[0].c
      // a 揭示賣價(從低到高，以_分隔資料)
      stockData.sellPrice = data.msgArray[0].a
      // n 公司簡稱
      stockData.companyShortName = data.msgArray[0].n
      // o 開盤價
      stockData.openingPrice = data.msgArray[0].o
      // l 最低價
      stockData.lowestPrice = data.msgArray[0].l
      // h 最高價
      stockData.highestPrice = data.msgArray[0].h
      // w 跌停價
      stockData.downLimitPrice = data.msgArray[0].w
      // v 累積成交量
      stockData.accumulatedVolume = data.msgArray[0].v
      // u 漲停價
      stockData.upLimitPrice = data.msgArray[0].u
      // t 最近成交時刻 (HH:MM:SS)
      stockData.lastTradeTime = data.msgArray[0].t
      // tv 當盤成交量
      stockData.currentVolume = data.msgArray[0].tv
      // nf 公司全名
      stockData.companyName = data.msgArray[0].nf
      // z 當盤成交價
      stockData.currentPrice = data.msgArray[0].z
      // y 昨收價
      stockData.previousClose = data.msgArray[0].y
    })
    .catch((err) => console.error(err))
}

const initFetchStockDataTime = () => {
  let delay = 5000

  // 進頁面時請求一次
  getDetail()

  let timerId = setTimeout(function request() {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const day = now.getDay()

    // 如果是假日的話，就不用再取資料了
    if (day === 0 || day === 6) {
      clearTimeout(timerId)
      return
    }

    if (hours >= 9 && (hours < 13 || (hours === 13 && minutes <= 30))) {
      getDetail()
      timerId = setTimeout(request, delay)
    } else {
      clearTimeout(timerId)
    }
  }, delay)
}

initFetchStockDataTime()
</script>

<template>
  <form class="max-w-md mx-auto mb-10">
    <label
      for="default-search"
      class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >Search</label
    >
    <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          class="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        v-model="stockNo"
        type="search"
        id="default-search"
        class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search Mockups, Logos..."
        required
      />
      <button
        class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click.prevent="getStockData"
      >
        Search
      </button>
    </div>
  </form>
  <form class="max-w-md mx-auto">
    <label
      for="default-search"
      class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >Search</label
    >
    <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          class="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        v-model="stockNo2"
        type="search"
        id="default-search"
        class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="搜尋個股..."
        required
      />
      <button
        class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @click.prevent="getDetail"
      >
        Search
      </button>
    </div>
  </form>

  <div v-for="(label, key) in fieldLabels" :key="key" class="form-group">
    <label :for="key">{{ label }}：</label>
    <span class="form-control">{{ stockData[key] }}</span>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
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
