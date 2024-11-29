import { defineStore } from 'pinia'
// import { apiUser } from '@/api/User'
import { useToast } from 'primevue/usetoast'

export const useUserStore = defineStore('user', () => {
  const event = ref('')
  // const user = ref(null)
  // const toast = useToast()

  // 取得使用者資訊
  // const getUserInfo = async () => {
  //   try {
  //     const res = await apiUser.getUserInfo()
  //     user.value = res.data
  //     return res
  //   } catch (error) {
  //     return error
  //   }
  // }

  // const showToast = async () => {
  //   toast.add({
  //     severity: 'info',
  //     summary: '提醒您',
  //     detail:
  //       '您現在存取的是中華電信股份有限公司之系統，所有的系統使用情形將會受到監控與紀錄，使用本系統表示您已同意被監控與紀錄，並遵守相關法規及公司規定。如未經授權使用本系統，本公司將可能採取法律行動。 '
  //     // life: 10000
  //   })
  // }

  const setEvent = (eventName: any) => {
    event.value = eventName
  }

  return {
    event,
    setEvent
  }
})
