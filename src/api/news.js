import request from '../utils/request'
const user = JSON.parse(localStorage.getItem('token'))

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

/**
 * 取得草稿箱的新聞稿
 * @returns Promise
 */
export const getDrafts = () => {
  return request(`/news?author=${user.username}&auditState=0&_expand=category`, 'get')
}

/**
 * 刪除新聞稿
 * @param {Number} id - 新聞稿 ID
 * @returns Promise
 */
export const removeNews = (id) => {
  return request(`/news/${id}`, 'delete')
}

/**
 * 取得單一新聞稿內容
 * @param {Number} id - 新聞稿 ID
 * @returns Promise
 */
export const getNewsInfo = (id) => {
  return request(`/news/${id}?_expand=category&_expand=role`, 'get')
}
