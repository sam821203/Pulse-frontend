import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

interface IResponse {
  code: number
  msg: any
}

const baseURL: string = 'http://127.0.0.1:3000'
const service = axios.create({
  baseURL,
  timeout: 8000
})

service.interceptors.request.use((req: InternalAxiosRequestConfig) => {
  const token: string = localStorage.getItem('token') as string
  return req
})

service.interceptors.response.use(
  (res: AxiosResponse) => {
    const response: IResponse = res.data
    if (response.code !== 0) {
      console.warn(response.msg)
    }
    return res.data.msg
  },
  (err) => console.log(err)
)

export default service
