import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',  // url基础地址，解决不同数据源url变化问题
  timeout: 15000,  // 请求超时时间
  withCredentials: true  // 跨域时携带cookies
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，例如添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 如果自定义code不是200，则判断为错误
    if (res.code && res.code !== 200) {
      ElMessage({
        message: res.message || '网络请求错误',
        type: 'error',
        duration: 5 * 1000
      })

      // 根据错误码处理特定错误
      if (res.code === 401) {
        // 未授权，清除token并跳转登录页
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      return Promise.reject(new Error(res.message || '网络请求错误'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应错误:', error)
    // 处理HTTP网络错误
    let message = '网络请求错误'
    // HTTP状态码判断
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求错误'
          break
        case 401:
          message = '未授权，请登录'
          // 清除token并跳转登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          message = '请求超时'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 501:
          message = '服务未实现'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        case 505:
          message = 'HTTP版本不受支持'
          break
        default:
          message = `未知错误: ${error.response.status}`
      }
    } else if (error.message.includes('timeout')) {
      message = '请求超时，请检查网络'
    } else {
      message = '网络连接失败，请检查网络'
    }
    
    ElMessage({
      message,
      type: 'error',
      duration: 5 * 1000
    })
    
    return Promise.reject(error)
  }
)

// 导出请求方法
export default service 