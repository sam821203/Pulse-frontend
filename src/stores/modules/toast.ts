import { defineStore } from 'pinia'
// TODO: 為何已經 auto import 了，還要再 import 一次？
import { nextTick, ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'

export const useToastStore = defineStore('toastMsg', () => {
  const toastMsg = ref('')
  const toast = useToast()

  const toastAction = (msg: any) => {
    console.log(msg)
  }

  watch(
    () => toastMsg.value,
    (val) => {
      if (val) {
        toast.add({
          severity: 'error',
          summary: '失敗',
          life: 5000,
          detail: val
        })
        nextTick(() => (toastMsg.value = ''))
      }
    }
  )
  return { toastMsg, toastAction }
})
