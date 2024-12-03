import { useLoading } from 'vue-loading-overlay'

let loader

export default {
  start() {
    const $loading = useLoading()
    const loadingConfig = {
      color: '#a855f7',
      loader: 'bars',
      width: 48,
      height: 48,
      backgroundColor: '#ffffff',
      opacity: 0.75,
      zIndex: 999,
      before: '載入中...'
    }
    loader = $loading.show(loadingConfig)
  },
  stop(delay = 200) {
    if (loader) {
      setTimeout(() => {
        loader.hide()
      }, delay)
    }
  }
}
