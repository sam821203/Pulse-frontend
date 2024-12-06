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

service.interceptors.request.use(
  (req: InternalAxiosRequestConfig) => {
    const token: string | null = localStorage.getItem('token')
    if (token) {
      req.headers['Authorization'] = `Bearer ${token}`
    }
    return req
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (res) => {
    return res.data
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error
      toastMsg.value = 'Unauthorized. Please log in again.'
    }
    return Promise.reject(error)
  }
)

export default service
