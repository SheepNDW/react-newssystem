import request from '../utils/request'

/**
 * 取得新聞分類
 * @returns Promise
 */
export const getCategories = () => {
  return request(`/categories`, 'get')
}

/**
 * 新增新聞稿
 * @param {Object} fromInfo - 新聞資訊
 * @param {String} content - 新聞內容
 * @param {Number} auditState - 審核狀態
 * @returns Promise
 */
export const saveNews = (fromInfo, content, auditState) => {
  const user = JSON.parse(localStorage.getItem('token'))

  return request(`/news`, 'post', {
    ...fromInfo,
    content,
    region: user.region ? user.region : '全球',
    author: user.username,
    roleId: user.roleId,
    auditState,
    publishState: 0,
    createTime: Date.now(),
    star: 0,
    view: 0
    // publishTime: 0
  })
}
