<script setup lang="ts">
defineProps<{
  msg: string
}>()

const stockNo = ref('')

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

const getDetail = () => {
  // Google CORS
  // https://script.google.com/macros/s/AKfycby_BUVtVI9vXu5H50LcedmZ78eUKNXP2zchdQ00tSauGEJC41fpePFdLoYWbXeVYNKISA/exec
  fetch('/api/getStockInfo.jsp?ex_ch=tse_2330.tw|otc_6488.tw&json=1&delay=0', {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err))
}

getDetail()
</script>

<template>
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
