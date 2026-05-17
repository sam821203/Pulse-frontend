import router from '@/router'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

export function authorize() {
  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const isLoginPage = to.path === '/login'
    const userStore = useUserStore()
    const { userInfo } = storeToRefs(userStore)

    // 判斷是否有使用者資訊
    const checkUserInfo = async () => {
      const token = localStorage.getItem('token')
      const localUserInfo = localStorage.getItem('userInfo')
      if (!token || !localUserInfo) return false

      try {
        const { _id: userId } = JSON.parse(localUserInfo)
        if (!userId) return false
        await userStore.getUserInfoData(userId)
        return userInfo.value !== null
      } catch {
        return false
      }
    }

    // 需登入且有 userInfo 或是不需登入且不是 loginPage
    if ((requiresAuth && userInfo.value) || (!requiresAuth && !isLoginPage)) {
      next()
    } else {
      // 重整頁面，需重新取得 userInfo
      const isAuthenticated = await checkUserInfo()
      if (isAuthenticated && isLoginPage) {
        // userStore.showToast()
        next('/')
      } else if (isAuthenticated) {
        next()
      } else if (requiresAuth) {
        next('/login')
      } else {
        next()
      }
    }
  })
}
