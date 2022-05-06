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

/**
 * 修改用戶狀態
 * @param {Object} item - 欲修改的用戶資料
 * @returns Promise
 */
export const updateUserState = (item) => {
  return request(`/users/${item.id}`, 'patch', { roleState: item.roleState })
}

/**
 * 更新用戶資訊
 * @param {Number} id - 當前修改用戶的 ID
 * @param {Object} value - 修改後表單的資料
 * @returns Promise
 */
export const updateUserInfo = (id, value) => {
  return request(`/users/${id}`, 'patch', value)
}
