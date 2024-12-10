import service from '../index'

export function getTwse() {
  return service({
    method: 'GET',
    url: '/twse/equities'
  })
}
