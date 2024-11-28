import service from '../index'

interface IUser {
  phone: string
  password: string
}

export const _login = async (user: IUser) => {
  console.log('user', user)
  return service({
    method: 'POST',
    url: '/auth/login',
    data: user
  })
}
