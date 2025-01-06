import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'

import Aura from '@primevue/themes/aura'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import { LoadingPlugin } from 'vue-loading-overlay'

import '@/assets/styles.scss'
import '@/assets/tailwind.css'
import 'vue-loading-overlay/dist/css/index.css'

const app = createApp(App)
const pinia = createPinia()

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{purple.50}',
      100: '{purple.100}',
      200: '{purple.200}',
      300: '{purple.300}',
      400: '{purple.400}',
      500: '{purple.500}',
      600: '{purple.600}',
      700: '{purple.700}',
      800: '{purple.800}',
      900: '{purple.900}',
      950: '{purple.950}'
    }
  }
})

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.app-dark'
    }
  }
})
app.use(ToastService)
app.use(ConfirmationService)
app.use(
  LoadingPlugin
  // {
  //   color: '#a855f7'
  // },
  // { before: '載入中...' }
)

app.mount('#app')
