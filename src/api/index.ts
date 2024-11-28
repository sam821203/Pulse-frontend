import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
// import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/modules/toast'

interface IResponse {
  code: number
  msg: any
}

const toastStore = useToastStore()
const { toastMsg } = storeToRefs(toastStore)

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
      toastMsg.value = response.msg
    }
    return res.data.msg
  },
  (err) => console.log(err)
)

export default service
