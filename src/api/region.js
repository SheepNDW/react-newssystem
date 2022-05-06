import request from '../utils/request'

/**
 * 取得區域列表
 * @returns Promise
 */
export const getRegions = () => {
  return request('/regions', 'get')
}
