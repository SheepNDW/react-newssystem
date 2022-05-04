import request from '../utils/request'

/**
 * 取得角色列表
 * @returns Promise
 */
export const getRoles = () => {
  return request('/roles', 'get')
}

/**
 * 刪除角色
 * @param {Number} id - 角色 ID
 * @returns Promise
 */
export const removeRole = (id) => {
  return request(`/roles/${id}`, 'delete')
}
