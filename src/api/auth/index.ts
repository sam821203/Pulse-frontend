import service from '../index'
import type { AuthApiResponse, AuthLoginData, AuthUserPayload } from './types'

export type { AuthApiResponse, AuthLoginData, AuthUserPayload } from './types'

/**
 * 使用者登入
 */
export const login = (user: AuthUserPayload): Promise<AuthApiResponse<AuthLoginData>> => {
  return service({
    method: 'POST',
    url: '/auth/login',
    data: user
  })
}

/**
 * 使用者登出
 */
export const logout = (token: string | null): Promise<unknown> => {
  return service({
    method: 'POST',
    url: '/auth/logout',
    data: { token }
  })
}

/**
 * 使用者註冊
 */
export const register = (user: AuthUserPayload): Promise<AuthApiResponse<unknown>> => {
  return service({
    method: 'POST',
    url: '/user/register',
    data: user
  })
}
