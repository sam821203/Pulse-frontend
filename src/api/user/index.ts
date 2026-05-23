import service from '../index'
import type { UserInfo } from './types'

export type { UserInfo } from './types'

export function getUserInfo(id: string): Promise<UserInfo> {
  return service({
    method: 'GET',
    url: `/user/${id}`
  })
}
