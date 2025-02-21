<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import loading from '@/utils/loading'
import {
  getRealTimeStockInfo,
  getCategoryInfo,
  getEquitiesValuesFromTickers,
  getListedCompanyOpenData,
  getOTCOpenData,
  getTest
} from '@/api/stock/index'
import type { StockData, ListedCompanyData, OTCCompanyData } from '../model/interface'
// import CandlestickChart from '../components/C  andlestickChart.vue'
import CrosshairChart from '../components/CrosshairChart.vue'
// import StockChart from '../components/StockChart.vue'
import type { ChartData } from '../model/interface'

const route = useRoute()

const stockNo = ref('2330')
const chartData = ref([])
const priceLower = ref(false)
const currentStock = reactive({
  market: route.query.market,
  symbol: route.query.symbol,
  industry: route.query.industry
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

const getStockRealTime = async () => {
  try {
    const resp = await getRealTimeStockInfo(
      currentStock.market as 'tse' | 'otc',
      currentStock.symbol as string
    )
    const data = stockDataAdapter(resp.msgArray[0])
    Object.assign(stockData, data)

    // 取得本益比
    fetchEquitiesValues()
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
  let delay = 5000
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

// Date: 交易日期，格式為 YYYY-MM-DD。
// Open: 開盤價，當天交易開始時的價格。
// High: 最高價，當天交易中的最高價格。
// Low: 最低價，當天交易中的最低價格。
// Close: 收盤價，當天交易結束時的價格。
// AdjClose: 調整後的收盤價，考慮了股息、拆股等因素後的收盤價。
// Volume: 成交量，當天交易的股票數量。
const dataCSV = [
  {
    Date: '2017-12-01',
    Open: 7326.700195,
    High: 7355.399902,
    Low: 7288.700195,
    Close: 7300.5,
    AdjClose: 7300.5,
    Volume: 839825500
  },
  {
    Date: '2017-12-04',
    Open: 7300.5,
    High: 7369.700195,
    Low: 7300.5,
    Close: 7339,
    AdjClose: 7339,
    Volume: 745259400
  },
  {
    Date: '2017-12-05',
    Open: 7339,
    High: 7373.899902,
    Low: 7326.600098,
    Close: 7327.5,
    AdjClose: 7327.5,
    Volume: 881831300
  },
  {
    Date: '2017-12-06',
    Open: 7327.5,
    High: 7369.700195,
    Low: 7289.399902,
    Close: 7348,
    AdjClose: 7348,
    Volume: 672957500
  },
  {
    Date: '2017-12-07',
    Open: 7348,
    High: 7371.700195,
    Low: 7314.600098,
    Close: 7320.799805,
    AdjClose: 7320.799805,
    Volume: 803178700
  },
  {
    Date: '2017-12-08',
    Open: 7320.799805,
    High: 7412.200195,
    Low: 7314.200195,
    Close: 7394,
    AdjClose: 7394,
    Volume: 1004623500
  },
  {
    Date: '2017-12-11',
    Open: 7394,
    High: 7458.399902,
    Low: 7393.600098,
    Close: 7453.5,
    AdjClose: 7453.5,
    Volume: 906705100
  },
  {
    Date: '2017-12-12',
    Open: 7453.5,
    High: 7501.5,
    Low: 7448.299805,
    Close: 7500.399902,
    AdjClose: 7500.399902,
    Volume: 991599100
  },
  {
    Date: '2017-12-13',
    Open: 7500.399902,
    High: 7510.799805,
    Low: 7492.600098,
    Close: 7496.5,
    AdjClose: 7496.5,
    Volume: 998682800
  },
  {
    Date: '2017-12-14',
    Open: 7496.5,
    High: 7496.700195,
    Low: 7448.100098,
    Close: 7448.100098,
    AdjClose: 7448.100098,
    Volume: 948434600
  },
  {
    Date: '2017-12-15',
    Open: 7448.100098,
    High: 7490.600098,
    Low: 7433.799805,
    Close: 7490.600098,
    AdjClose: 7490.600098,
    Volume: 1182118000
  },
  {
    Date: '2017-12-18',
    Open: 7490.600098,
    High: 7544.299805,
    Low: 7490.600098,
    Close: 7537,
    AdjClose: 7537,
    Volume: 568259400
  },
  {
    Date: '2017-12-19',
    Open: 7537,
    High: 7563.5,
    Low: 7534.100098,
    Close: 7544.100098,
    AdjClose: 7544.100098,
    Volume: 675779500
  },
  {
    Date: '2017-12-20',
    Open: 7544.100098,
    High: 7550.600098,
    Low: 7511.5,
    Close: 7525.200195,
    AdjClose: 7525.200195,
    Volume: 659315600
  },
  {
    Date: '2017-12-21',
    Open: 7525.200195,
    High: 7609.700195,
    Low: 7517.899902,
    Close: 7604,
    AdjClose: 7604,
    Volume: 621347000
  },
  {
    Date: '2017-12-22',
    Open: 7604,
    High: 7614.399902,
    Low: 7585.5,
    Close: 7592.700195,
    AdjClose: 7592.700195,
    Volume: 243831300
  },
  {
    Date: '2017-12-27',
    Open: 7592.700195,
    High: 7632.700195,
    Low: 7586.399902,
    Close: 7620.700195,
    AdjClose: 7620.700195,
    Volume: 458380900
  },
  {
    Date: '2017-12-28',
    Open: 7620.700195,
    High: 7633.600098,
    Low: 7609.799805,
    Close: 7622.899902,
    AdjClose: 7622.899902,
    Volume: 311875400
  },
  {
    Date: '2017-12-29',
    Open: 7622.899902,
    High: 7697.600098,
    Low: 7620,
    Close: 7687.799805,
    AdjClose: 7687.799805,
    Volume: 289238900
  },
  {
    Date: '2018-01-02',
    Open: 7687.799805,
    High: 7691.299805,
    Low: 7624.100098,
    Close: 7648.100098,
    AdjClose: 7648.100098,
    Volume: 576251800
  },
  {
    Date: '2018-01-03',
    Open: 7648.100098,
    High: 7689.899902,
    Low: 7640.5,
    Close: 7671.100098,
    AdjClose: 7671.100098,
    Volume: 571662800
  },
  {
    Date: '2018-01-04',
    Open: 7671.100098,
    High: 7702.5,
    Low: 7671.100098,
    Close: 7695.899902,
    AdjClose: 7695.899902,
    Volume: 705864000
  },
  {
    Date: '2018-01-05',
    Open: 7695.899902,
    High: 7727.700195,
    Low: 7689.799805,
    Close: 7724.200195,
    AdjClose: 7724.200195,
    Volume: 636035700
  },
  {
    Date: '2018-01-08',
    Open: 7724.200195,
    High: 7733.399902,
    Low: 7691.799805,
    Close: 7696.5,
    AdjClose: 7696.5,
    Volume: 635135400
  },
  {
    Date: '2018-01-09',
    Open: 7696.5,
    High: 7733.100098,
    Low: 7696.5,
    Close: 7731,
    AdjClose: 7731,
    Volume: 709674500
  },
  {
    Date: '2018-01-10',
    Open: 7731,
    High: 7756.100098,
    Low: 7716.200195,
    Close: 7748.5,
    AdjClose: 7748.5,
    Volume: 861758600
  },
  {
    Date: '2018-01-11',
    Open: 7748.5,
    High: 7769,
    Low: 7734.600098,
    Close: 7762.899902,
    AdjClose: 7762.899902,
    Volume: 982791800
  },
  {
    Date: '2018-01-12',
    Open: 7762.899902,
    High: 7792.600098,
    Low: 7752.600098,
    Close: 7778.600098,
    AdjClose: 7778.600098,
    Volume: 1133867000
  },
  {
    Date: '2018-01-15',
    Open: 7778.600098,
    High: 7783.600098,
    Low: 7763.399902,
    Close: 7769.100098,
    AdjClose: 7769.100098,
    Volume: 551904700
  },
  {
    Date: '2018-01-16',
    Open: 7769.100098,
    High: 7791.799805,
    Low: 7740.600098,
    Close: 7755.899902,
    AdjClose: 7755.899902,
    Volume: 824367900
  },
  {
    Date: '2018-01-17',
    Open: 7755.899902,
    High: 7755.899902,
    Low: 7711.100098,
    Close: 7725.399902,
    AdjClose: 7725.399902,
    Volume: 822508200
  },
  {
    Date: '2018-01-18',
    Open: 7725.399902,
    High: 7739.5,
    Low: 7683.700195,
    Close: 7701,
    AdjClose: 7701,
    Volume: 765527900
  },
  {
    Date: '2018-01-19',
    Open: 7701,
    High: 7731.799805,
    Low: 7694.700195,
    Close: 7730.799805,
    AdjClose: 7730.799805,
    Volume: 795594100
  },
  {
    Date: '2018-01-22',
    Open: 7730.799805,
    High: 7739.399902,
    Low: 7703.700195,
    Close: 7715.399902,
    AdjClose: 7715.399902,
    Volume: 730171300
  },
  {
    Date: '2018-01-23',
    Open: 7715.399902,
    High: 7745.200195,
    Low: 7710,
    Close: 7731.799805,
    AdjClose: 7731.799805,
    Volume: 742420200
  },
  {
    Date: '2018-01-24',
    Open: 7731.799805,
    High: 7732,
    Low: 7643.399902,
    Close: 7643.399902,
    AdjClose: 7643.399902,
    Volume: 746643300
  },
  {
    Date: '2018-01-25',
    Open: 7643.399902,
    High: 7662.399902,
    Low: 7608.5,
    Close: 7615.799805,
    AdjClose: 7615.799805,
    Volume: 713251600
  },
  {
    Date: '2018-01-26',
    Open: 7615.799805,
    High: 7667.399902,
    Low: 7615.799805,
    Close: 7665.5,
    AdjClose: 7665.5,
    Volume: 713831300
  },
  {
    Date: '2018-01-29',
    Open: 7665.5,
    High: 7689.200195,
    Low: 7663.899902,
    Close: 7671.5,
    AdjClose: 7671.5,
    Volume: 612924000
  },
  {
    Date: '2018-01-30',
    Open: 7671.5,
    High: 7671.700195,
    Low: 7587.100098,
    Close: 7588,
    AdjClose: 7588,
    Volume: 798999000
  },
  {
    Date: '2018-01-31',
    Open: 7588,
    High: 7599,
    Low: 7521.799805,
    Close: 7533.600098,
    AdjClose: 7533.600098,
    Volume: 880751700
  },
  {
    Date: '2018-02-01',
    Open: 7533.600098,
    High: 7554.700195,
    Low: 7476.5,
    Close: 7490.399902,
    AdjClose: 7490.399902,
    Volume: 872509100
  },
  {
    Date: '2018-02-02',
    Open: 7490.399902,
    High: 7494.799805,
    Low: 7432.299805,
    Close: 7443.399902,
    AdjClose: 7443.399902,
    Volume: 871574000
  },
  {
    Date: '2018-02-05',
    Open: 7443.399902,
    High: 7443.399902,
    Low: 7334.799805,
    Close: 7335,
    AdjClose: 7335,
    Volume: 888994600
  },
  {
    Date: '2018-02-06',
    Open: 7335,
    High: 7335,
    Low: 7079.399902,
    Close: 7141.399902,
    AdjClose: 7141.399902,
    Volume: 1354591000
  },
  {
    Date: '2018-02-07',
    Open: 7141.399902,
    High: 7311.5,
    Low: 7141.399902,
    Close: 7279.399902,
    AdjClose: 7279.399902,
    Volume: 1027400300
  },
  {
    Date: '2018-02-08',
    Open: 7279.399902,
    High: 7279.399902,
    Low: 7161.299805,
    Close: 7170.700195,
    AdjClose: 7170.700195,
    Volume: 973611300
  },
  {
    Date: '2018-02-09',
    Open: 7170.700195,
    High: 7170.700195,
    Low: 7073,
    Close: 7092.399902,
    AdjClose: 7092.399902,
    Volume: 927291900
  },
  {
    Date: '2018-02-12',
    Open: 7092.399902,
    High: 7199.899902,
    Low: 7092.399902,
    Close: 7177.100098,
    AdjClose: 7177.100098,
    Volume: 718740600
  },
  {
    Date: '2018-02-13',
    Open: 7177.100098,
    High: 7203,
    Low: 7165.799805,
    Close: 7168,
    AdjClose: 7168,
    Volume: 718988800
  },
  {
    Date: '2018-02-14',
    Open: 7168,
    High: 7243.200195,
    Low: 7145.700195,
    Close: 7214,
    AdjClose: 7214,
    Volume: 940537000
  }
]

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
  for (let i = 0; i < 50; i++) {
    const time = new Date(startTime.getTime() + i * 3 * 60000) // 每 3 分鐘一筆資料
    const formattedTime = time.toTimeString().substring(0, 5)
    const record = [
      '2025/02/21',
      formattedTime,
      (1080 + i * 0.5).toFixed(2), // 開盤價
      (1090 + i * 0.5).toFixed(2), // 最高價
      (1075 + i * 0.5).toFixed(2), // 最低價
      (1085 + i * 0.5).toFixed(2), // 收盤價
      5000 + i * 100 // 成交量
    ]
    todayRecords.push(record)
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
const chartData2: ChartData = {
  data: []
}

// const chartData2: ChartData = {
//   data: [
//     ['20220104', 4957.98, 4917.77, 4961.45, 4874.53, 15153477600, -0.46],
//     ['20220105', 4907.94, 4868.12, 4916.28, 4851.98, 17881610000, -1.01],
//     ['20220106', 4868.12, 4820.45, 4870.12, 4800.23, 16234567890, -0.98],
//     ['20220107', 4820.45, 4785.67, 4830.45, 4770.89, 15467890123, -0.75],
//     ['20220108', 4785.67, 4750.34, 4790.56, 4740.12, 14876543210, -0.92],
//     ['20220109', 4750.34, 4705.89, 4760.78, 4690.45, 14234567890, -1.05],
//     ['20220110', 4705.89, 4670.23, 4710.34, 4660.12, 13678901234, -0.95],
//     ['20220111', 4670.23, 4635.78, 4680.45, 4620.89, 13012345678, -0.85],
//     ['20220112', 4635.78, 4600.34, 4640.56, 4590.12, 12456789012, -0.97],
//     ['20220113', 4600.34, 4565.89, 4610.78, 4550.45, 11890123456, -0.9],
//     ['20220114', 4565.89, 4530.23, 4570.34, 4520.12, 11323456789, -0.85],
//     ['20220115', 4530.23, 4495.78, 4540.45, 4480.89, 10756789012, -0.95],
//     ['20220116', 4495.78, 4460.34, 4500.56, 4450.12, 10190123456, -0.9],
//     ['20220117', 4460.34, 4425.89, 4470.78, 4410.45, 9623456789, -0.85],
//     ['20220118', 4425.89, 4390.23, 4430.34, 4380.12, 9056789012, -0.95],
//     ['20220119', 4390.23, 4355.78, 4400.45, 4340.89, 8490123456, -0.9],
//     ['20220120', 4355.78, 4320.34, 4360.56, 4310.12, 7923456789, -0.85],
//     ['20220121', 4320.34, 4285.89, 4330.78, 4270.45, 7356789012, -0.95],
//     ['20220122', 4285.89, 4250.23, 4290.34, 4240.12, 6790123456, -0.9],
//     ['20220123', 4250.23, 4215.78, 4260.45, 4200.89, 6223456789, -0.85],
//     ['20220124', 4215.78, 4180.34, 4220.56, 4170.12, 5656789012, -0.95],
//     ['20220125', 4180.34, 4145.89, 4190.78, 4130.45, 5090123456, -0.9],
//     ['20220126', 4145.89, 4110.23, 4150.34, 4100.12, 4523456789, -0.85],
//     ['20220127', 4110.23, 4075.78, 4120.45, 4060.89, 3956789012, -0.95],
//     ['20220128', 4075.78, 4040.34, 4080.56, 4030.12, 3390123456, -0.9],
//     ['20220129', 4040.34, 4005.89, 4050.78, 3990.45, 2823456789, -0.85],
//     ['20220130', 4005.89, 3970.23, 4010.34, 3960.12, 2256789012, -0.95],
//     ['20220131', 3970.23, 3935.78, 3980.45, 3920.89, 1690123456, -0.9]
//   ]
// }

watch(
  route,
  async (newRoute) => {
    // Object.assign(newRoute.query, currentStock)
    currentStock.market = newRoute.query.market
    currentStock.symbol = newRoute.query.symbol
    currentStock.industry = newRoute.query.industry
    await getStockRealTime()
    await getCompanyOpenData()
    updateChartData()
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
  loading.stop()
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
