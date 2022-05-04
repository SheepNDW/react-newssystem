import axios from 'axios'

const baseURL = 'http://localhost:5000'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

instance.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
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
