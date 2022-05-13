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

/**
 * 更新新聞內容
 * @param {Number} id - 新聞id
 * @param {Object} fromInfo - 新聞資訊
 * @param {String} content - 新聞內容
 * @param {Number} auditState - 審核狀態
 * @returns Promise
 */
export const updateNews = (id, fromInfo, content, auditState) => {
  return request(`/news/${id}`, 'patch', {
    ...fromInfo,
    content,
    auditState
  })
}

/**
 * 更改審核狀態
 * @param {Number} id - 新聞 id
 * @param {Number} auditState - 審核狀態
 * @returns Promise
 */
export const updateAuditState = (id, auditState) => {
  return request(`/news/${id}`, 'patch', {
    auditState
  })
}

/**
 * 修改發布狀態
 * @param {Number} id - 新聞 id
 * @param {Number} publishState - 審核狀態
 * @returns Promise
 */
export const updatePublishState = (id, publishState) => {
  return request(`/news/${id}`, 'patch', {
    publishState
  })
}

/**
 * 發布新聞
 * @param {Number} id - 新聞 id
 * @returns Promise
 */
export const publish = (id) => {
  return request(`/news/${id}`, 'patch', {
    publishState: 2,
    publishTime: Date.now()
  })
}

/**
 * 取得草稿箱的新聞稿
 * @returns Promise
 */
export const getDrafts = () => {
  const user = JSON.parse(localStorage.getItem('token'))
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

/**
 * 取得審核列表
 * @returns Promise
 */
export const getAuditList = () => {
  const user = JSON.parse(localStorage.getItem('token'))
  return request(
    `/news?author=${user.username}&auditState_ne=0&publishState_lte=1&_expand=category`,
    'get'
  )
}

/**
 * 取得正在審核中的新聞
 * @returns Promise
 */
export const getAuditing = () => {
  return request(`/news?auditState=1&_expand=category`, 'get')
}
