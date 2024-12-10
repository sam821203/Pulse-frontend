import service from '../index'

interface IUser {
  name: string
  password: string
}

/**
 * 使用者登入
 */
export const login = async (user: IUser) => {
  return service({
    method: 'POST',
    url: '/auth/login',
    data: user
  })
}

/**
 * 使用者登出
 */
export const logout = async (token: string) => {
  return service({
    method: 'POST',
    url: '/auth/logout',
    data: { token }
  })
}

/**
 * 使用者註冊
 */
export const register = async (user: IUser) => {
  return service({
    method: 'POST',
    url: '/user/register',
    data: user
  })
}
