<script setup>
import { useLayout } from '@/layout/composables/layout'
import { useUserStore } from '@/stores'
import { useStockStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useConfirm } from 'primevue/useconfirm'
import { logout } from '../api/auth/index'
import loading from '@/utils/loading'
import AutoComplete from 'primevue/autocomplete'
import { getStockInfo } from '@/api/stock/index'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const userStore = useUserStore()
const stockStore = useStockStore()
const confirm = useConfirm()
const toast = useToast()

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout()
const { userInfo } = storeToRefs(userStore)
const { allStocksData } = storeToRefs(stockStore)

const menu = ref()
const inputValue = ref('')
const allStocks = ref([])
const marketType = ref('')

const handleLogout = async () => {
  loading.start()
  try {
    const token = localStorage.getItem('token')
    await logout(token)
    userStore.resetStore()
    router.push('/login')
  } catch (error) {
    console.error('登出失敗', error)
  } finally {
    loading.stop()
  }
}

const confirm1 = () => {
  confirm.require({
    message: '請問您確定要登出嗎?',
    header: '登出',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: '取消',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: '確認'
    },
    accept: () => handleLogout()
  })
}

const items = ref([
  {
    label: '',
    items: [
      {
        label: '個人檔案',
        icon: 'pi pi-id-card',
        command: () => {
          router.push('/user-profile')
        }
      },
      {
        label: '登出',
        icon: 'pi pi-sign-out',
        command: () => {
          confirm1()
        }
      }
    ]
  }
])

const toggle = (event) => {
  menu.value.toggle(event)
}

const fetchStockInfo = async (params) => {
  try {
    const resp = await getStockInfo(params)
    if (resp.code === 2) {
      toast.add({
        severity: 'error',
        summary: resp.msg,
        life: 3000
      })
    } else {
      return resp.data
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}

const handleSearchStock = async () => {
  if (!inputValue.value) return
  const match = inputValue.value.match(/\d+/)
  const stockSymbol = match ? match[0] : ''
  const params = match ? { symbol: stockSymbol } : { name: inputValue.value }
  try {
    const resp = await fetchStockInfo(params)
    const { market, symbol, industry } = resp
    marketType.value = market === '上市' ? 'tse' : 'otc'
    router.push({
      path: '/listedCompany/detail',
      query: { symbol, industry, market: marketType.value }
    })
  } catch (err) {
    console.log('err', err)
  }
}

const listAdapter = async () => {
  allStocks.value = allStocksData.value.map((stock) => `${stock.symbol} ${stock.name}`)
}

const searchItems = ref([])

const search = ({ query }) => {
  searchItems.value = allStocks.value.filter((item) => {
    let regex
    if (/[\u4e00-\u9fa5]/.test(query)) {
      regex = new RegExp(`${query}`, 'i')
    } else {
      regex = new RegExp(`^${query}`, 'i')
    }
    return regex.test(item)
  })
}

watch(userInfo, (newUserInfo) => {
  if (newUserInfo) {
    items.value[0].label = newUserInfo.name
  }
})

onMounted(async () => {
  if (userInfo.value) {
    items.value[0].label = userInfo.value.name
  }

  await stockStore.getAllStocksData()
  await listAdapter()
})
</script>

<template>
  <input type="text" id="searchInput" placeholder="搜尋..." style="width: 100%; padding: 8px" />
  <ul
    id="suggestionList"
    style="
      list-style: none;
      margin: 0;
      padding: 0;
      border: 1px solid #ccc;
      border-top: none;
      max-height: 150px;
      overflow-y: auto;
      position: absolute;
      width: 100%;
      display: none;
      background-color: white;
      z-index: 1000;
    "
  ></ul>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
        <i class="pi pi-bars"></i>
      </button>
      <router-link to="/" class="layout-topbar-logo">
        <svg
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_60_5208)">
            <path
              d="M0 25.5H8.5V32C8.5 33.1046 7.60457 34 6.5 34H2C0.89543 34 0 33.1046 0 32V25.5Z"
              fill="#2BB2FE"
            />
            <rect y="17" width="8.5" height="8.5" fill="#2BB2FE" />
            <path d="M0 10.5C0 9.39543 0.895431 8.5 2 8.5H8.5V17H0V10.5Z" fill="#2BB2FE" />
            <path d="M8.5 2C8.5 0.89543 9.39543 0 10.5 0H17V8.5H8.5V2Z" fill="#883DCF" />
            <rect x="8.5" y="17" width="8.5" height="8.5" fill="#883DCF" />
            <path d="M17 0H23.5C24.6046 0 25.5 0.895431 25.5 2V8.5H17V0Z" fill="#F9C80E" />
            <path d="M17 17H25.5V23.5C25.5 24.6046 24.6046 25.5 23.5 25.5H17V17Z" fill="#F9C80E" />
            <path
              d="M25.5 8.5H32C33.1046 8.5 34 9.39543 34 10.5V15C34 16.1046 33.1046 17 32 17H25.5V8.5Z"
              fill="#F9C80E"
            />
          </g>
          <defs>
            <clipPath id="clip0_60_5208">
              <rect width="34" height="34" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span class="font-semibold">Pulse</span>
      </router-link>

      <div class="search-bar flex">
        <div class="search-bar__input mr-4">
          <AutoComplete
            class="w-full"
            v-model="inputValue"
            placeholder="Search"
            :suggestions="searchItems"
            @complete="search"
            @item-select="handleSearchStock"
          />
        </div>
        <Button label="搜尋" icon="pi pi-search" @click.prevent.stop="handleSearchStock" />
      </div>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>
      </div>

      <button
        class="layout-topbar-menu-button layout-topbar-action"
        v-styleclass="{
          selector: '@next',
          enterFromClass: 'hidden',
          enterActiveClass: 'animate-scalein',
          leaveToClass: 'hidden',
          leaveActiveClass: 'animate-fadeout',
          hideOnOutsideClick: true
        }"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-calendar"></i>
            <span>Calendar</span>
          </button>
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-inbox"></i>
            <span>Messages</span>
          </button>
          <Button
            type="button"
            icon="pi pi-user"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_menu"
          />
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.search-bar {
  &__input {
    width: 400px;
  }
  button {
    min-width: 88px;
  }
  input {
    width: 100%;
  }
}
</style>
