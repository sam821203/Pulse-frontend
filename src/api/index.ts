import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useToastStore } from '@/stores/modules/toast'

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
      useToastStore().toastMsg = 'Unauthorized. Please log in again.'
    }
    return Promise.reject(error)
  }
)

export default service
