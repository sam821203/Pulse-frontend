import service from '../index'

export function _hello() {
  return service({
    method: 'GET',
    url: '/user/hello'
  })
}
