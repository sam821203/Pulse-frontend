<script setup lang="ts">
defineProps<{
  msg: string
}>()

// fetch('https://www.twse.com.tw/exchangeReport/FMTQIK')
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err))

// var ss = SpreadsheetApp.getActiveSpreadsheet(),
//   index_sheet = ss.getSheetByName('大盤'), // 填入自己設定的工作表名稱
//   email = 'xxxxx@gmail.com' // 填入要收到通知的 email

// 取得大盤成交資訊
function getIndexData() {
  var apiUrl = 'https://www.twse.com.tw/exchangeReport/FMTQIK', // api 呼叫網址
    dailyRow = [],
    today = new Date(),
    // todayFormate = Utilities.formatDate(today, 'GMT+8', 'yyyyMMdd'), // 格式化今天日期
    todayFormate = today, // 格式化今天日期
    twYear = today.getFullYear() - 1911, // 中華民國年份
    // todayTwFormat = Utilities.formatDate(today, 'GMT+8', twYear + '/MM/dd'), // 中華民國日期格式
    todayTwFormat = twYear, // 中華民國日期格式
    // todayEmailFormat = Utilities.formatDate(today, 'GMT+8', 'yyyy-MM-dd'), // 郵件日期格式化
    todayEmailFormat = today, // 郵件日期格式化
    fetchUrl,
    response,
    json,
    i,
    data,
    closeIndex,
    variation,
    volume

  // 組合 api 參數, 加上今天日期
  fetchUrl = apiUrl + '?date=' + todayFormate

  // 呼叫 api 取得大盤成交資訊
  fetch(fetchUrl)
    .then((response) => response.json())
    .then((res) => {
      data = res
      console.log(data)
    })
    .catch((err) => console.error(err))

  // response = fetch(fetchUrl).getContentText()
  // json = JSON.parse(response)

  for (i in data) {
    // 只取今日資料
    if (data[i][0] == todayTwFormat) {
      closeIndex = removeComma(data[i][4]) // 收盤指數 數字格式化
      variation = removeComma(data[i][5]) // 漲跌點數 數字格式化
      volume = removeComma(data[i][2]) // 成交量 數字格式化

      // 整理成交量格式為(億)
      volume = parseInt(volume / 100000000)

      dailyRow = [todayEmailFormat, closeIndex, variation, volume]
    }
  }

  // 如果有今日資料
  if (dailyRow.length) {
    // 工作表增加一列資料
    index_sheet.appendRow(dailyRow)

    // 寄信通知
    sendMailIndex(dailyRow)
  }

  // 數字格式化
  function removeComma(number) {
    return number.replace(/,/g, '')
  }
}

// 寄信通知
function sendMailIndex(dailyRow) {
  var subject = '每日大盤成交資訊' + ' ' + dailyRow[0], // 信件標題
    htmlBody = ''

  // 組合信件內容
  htmlBody += '日期：' + dailyRow[0] + '<br/>'
  htmlBody += '收盤指數：' + dailyRow[1] + '<br/>'
  htmlBody += '漲跌點數：' + dailyRow[2] + '<br/>'
  htmlBody += '成交量(億)：' + dailyRow[3] + '<br/>'

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody
  })
}

getIndexData()

// 取得個股成交資訊
// var ss = SpreadsheetApp.getActiveSpreadsheet()
const stockNo = '2330' // 填入個股代號
// index_sheet = ss.getSheetByName("2330"), // 填入自己設定的工作表名稱
// email = "xxxxx@gmail.com"; // 填入要收到通知的 email

function getStockData() {
  var apiUrl = 'https://www.twse.com.tw/exchangeReport/STOCK_DAY', // api 呼叫網址
    dailyRow = [],
    today = new Date(),
    // todayFormate = Utilities.formatDate(today, 'GMT+8', 'yyyyMMdd'), // 格式化今天日期
    todayFormate = today, // 格式化今天日期
    twYear = today.getFullYear() - 1911, // 中華民國年份
    // todayTwFormat = Utilities.formatDate(today, 'GMT+8', twYear + '/MM/dd'), // 中華民國日期格式
    todayTwFormat = twYear, // 中華民國日期格式
    // todayEmailFormat = Utilities.formatDate(today, 'GMT+8', 'yyyy-MM-dd'), // 郵件日期格式化
    todayEmailFormat = today, // 郵件日期格式化
    fetchUrl,
    response,
    json,
    i,
    data,
    closePrice,
    variation,
    volume

  // 組合 api 參數, 加上今天日期、股票代號
  fetchUrl = apiUrl + '?date=' + todayFormate + '&stockNo=' + stockNo

  // 呼叫 api 取得大盤成交資訊
  // response = UrlFetchApp.fetch(fetchUrl).getContentText()
  // json = JSON.parse(response)
  // data = json.data

  fetch(fetchUrl)
    .then((response) => response.json())
    .then((res) => {
      data = res
      console.log(data)
    })
    .catch((err) => console.error(err))

  for (i in data) {
    // 只取今日資料
    if (data[i][0] == todayTwFormat) {
      closePrice = removeComma(data[i][6]) // 收盤指數 數字格式化
      variation = removeComma(data[i][7]) // 漲跌點數 數字格式化
      volume = removeComma(data[i][2]) // 成交量 數字格式化

      // 整理成交量格式為(億)
      volume = parseInt(volume / 100000000)

      dailyRow = [todayEmailFormat, closePrice, variation, volume]
    }
  }

  // 如果有今日資料
  if (dailyRow.length) {
    // 工作表增加一列資料
    index_sheet.appendRow(dailyRow)

    // 寄信通知
    sendMailStock(dailyRow)
  }

  // 數字格式化
  function removeComma(number) {
    return number.replace(/,/g, '')
  }
}

getStockData()

// sendMailIndex()
</script>

<template>
  <!-- <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3>
  </div> -->
  <form>
    <label
      for="default-search"
      class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
      >Search</label
    >
    <div class="relative">
      <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <svg
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <input
        type="search"
        id="default-search"
        class="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search Mockups, Logos..."
        required
      />
      <button
        type="submit"
        class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
