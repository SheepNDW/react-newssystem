import request from '../utils/request'

/**
 * 取得用戶列表
 * @returns Promise
 */
export const getUsers = () => {
  return request('/users?_expand=role', 'get')
}

/**
 * 添加用戶
 * @param {Object} value - 欲新增之用戶資料
 * @returns Promise
 */
export const setUser = (value) => {
  return request(`/users`, 'post', {
    ...value,
    roleState: true,
    default: false
  })
}

/**
 * 刪除用戶
 * @param {Number} id - 用戶 ID
 * @returns Promise
 */
export const removeUser = (id) => {
  return request(`/users/${id}`, 'delete')
}
