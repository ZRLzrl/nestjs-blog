import axios from 'axios'
import { tokenUtil } from '@/utils/token'
import { message } from 'antd'

const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器：自动携带 JWT Token
apiClient.interceptors.request.use((config) => {
  const token = tokenUtil.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一解包 data 字段，处理通用错误
apiClient.interceptors.response.use(
  (response) => {
    const { code, message: msg, data } = response.data
    if (code === 200 || code === 201) {
      return data
    }
    // 业务错误
    message.error(msg || '请求失败')
    return Promise.reject(new Error(msg || '请求失败'))
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      const msg = data?.message || '服务器错误'

      if (status === 401) {
        message.error('登录已过期，请重新登录')
        tokenUtil.clear()
        // 跳转登录页（使用 window.location 以防 store 未初始化）
        window.location.href = '/login'
      } else if (status === 403) {
        message.error('权限不足')
      } else {
        message.error(msg)
      }
      return Promise.reject(new Error(msg))
    }

    if (error.code === 'ECONNABORTED') {
      message.error('请求超时，请稍后重试')
      return Promise.reject(error)
    }

    message.error('网络错误，请检查网络连接')
    return Promise.reject(error)
  },
)

export default apiClient
