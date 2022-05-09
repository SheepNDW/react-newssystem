import request from '../utils/request'

export const login = (values) => {
  return request(
    `/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`,
    'get'
  )
}
