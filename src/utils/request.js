import axios from 'axios'
import store from '../redux/store'

const baseURL = 'http://localhost:5000'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(
  (config) => {
    store.dispatch({
      type: 'change_loading',
      payload: true
    })
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (res) => {
    store.dispatch({
      type: 'change_loading',
      payload: false
    })
    return res.data
  },
  (err) => {
    store.dispatch({
      type: 'change_loading',
      payload: false
    })
    return Promise.reject(err)
  }
)

const request = (url, method, submitData) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}

export default request
