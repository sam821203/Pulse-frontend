import service from '../index'

interface IUser {
  name: string
  password: string
}

export const login = async (user: IUser) => {
  return service({
    method: 'POST',
    url: '/auth/login',
    data: user
  })
}

export const register = async (user: IUser) => {
  return service({
    method: 'POST',
    url: '/user/register',
    data: user
  })
}
