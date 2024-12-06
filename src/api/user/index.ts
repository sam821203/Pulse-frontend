import service from '../index'

export function getUserInfo(id: string): any {
  return service({
    method: 'GET',
    url: `/user/${id}`
  })
}
