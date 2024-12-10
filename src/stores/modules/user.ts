import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/user/index'
import type { UserData } from '@/modules/User/model/interface'

export const useUserStore = defineStore('user', () => {
  const event = ref('')
  const userInfo = ref<UserData | null>(null)

  // 取得使用者資訊
  const getUserInfoData = async (userId: string): Promise<any> => {
    try {
      const res = await getUserInfo(userId)
      userInfo.value = res
      localStorage.setItem('userInfo', JSON.stringify(res))
      return res
    } catch (error) {
      return error
    }
  }

  const setEvent = (eventName: any) => {
    event.value = eventName
  }

  return {
    event,
    setEvent,
    getUserInfoData,
    userInfo
  }
})
