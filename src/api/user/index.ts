import service from '../index'

export function _hello() {
  return service({
    method: 'GET',
    url: '/user/hello'
  })
}

export function getUserInfo(id: string): any {
  return service({
    method: 'GET',
    url: `/user/${id}`
  })
}
