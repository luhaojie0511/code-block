import axios from 'axios'
import { Message } from 'element-ui'
const { API_URL, LOGIN_URL, NODE_ENV } = process.env
const axiosHelper = () => {
  // axios配置
  axios.defaults.baseURL = API_URL // 接口地址
  axios.defaults.loginUrl = LOGIN_URL
  axios.defaults.timeout = 0 // 响应时间
  axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded;charset=UTF-8' // 配置POST请求头
  axios.defaults.headers.delete['Content-Type'] =
    'application/x-www-form-urlencoded;charset=UTF-8' // 配置delete请求头
  axios.defaults.withCredentials = true // 是否允许设置cookie

  // http request 拦截器，设置token、POST传参序列化
  axios.interceptors.request.use(
    config => {
      return config
    },
    err => Promise.reject(err)
  )

  // http response 拦截器，返回状态值处理
  axios.interceptors.response.use(
    res => {
      return res
    },
    err => {
      const errInfo = err.response
      if (errInfo) {
        switch (errInfo.status) {
          case 403: // 返回 403 清除登录标识 信息并跳转到登录页面
            Message.error({ message: '登录超时，请重新登录' })
            setTimeout(() => (location.href = err.config.loginUrl), 500)
            break
          case 404:
            Message.error({ message: '接口没有找到（代码 404），请联系管理员' })
            break
          case 401:
            Message.error({
              message: '401: You have not logged on to the system'
            })
            break
          case 400:
            Message.error({ message: errInfo.statusText })
            break
          case 500:
            Message.error({ message: '服务器错误' })
            break
          case 654:
            console.log('请求超时!')
            break
        }
      }
      return Promise.reject(err)
    }
  )
  return axios
}

export default axiosHelper
