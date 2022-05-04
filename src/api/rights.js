import request from '../utils/request'

/**
 * 取得權限列表 (一級 & 二級)
 * @returns Promise
 */
export const getRights = () => {
  return request('/rights?_embed=children', 'get')
}

/**
 * 刪除一級權限
 * @param {Number} id - 權限 id
 * @returns Promise
 */
export const removeFirstRight = (id) => {
  return request(`/rights/${id}`, 'delete')
}

/**
 * 刪除二級權限
 * @param {Number} id - 權限 id
 * @returns Promise
 */
export const removeSecondRight = (id) => {
  return request(`/children/${id}`, 'delete')
}

/**
 * 修改一級權限頁面配置項
 * @param {Object} item - 選中權限
 * @returns Promise
 */
export const editFirstPermission = (item) => {
  return request(`/rights/${item.id}`, 'patch', { pagepermisson: item.pagepermisson })
}

/**
 * 修改二級權限頁面配置項
 * @param {Object} item - 選中權限
 * @returns Promise
 */
export const editSecondPermission = (item) => {
  return request(`/children/${item.id}`, 'patch', { pagepermisson: item.pagepermisson })
}
