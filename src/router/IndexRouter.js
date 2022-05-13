import React from 'react'
import { useRoutes, Navigate } from 'react-router-dom'

export default function IndexRouter() {
  const element = useRoutes([
    {
      path: '/login',
      element: LazyLoad('login/Login')
    },
    {
      path: '/',
      element: <AuthComponent>{LazyLoad('sandbox/NewsSandBox')}</AuthComponent>,
      children: [
        { path: '', element: <Navigate to="/home" /> },
        { path: '/home', element: LazyLoad('sandbox/home/Home') },
        { path: '/user-manage/list', element: LazyLoad('sandbox/user-manage/UserList') },
        { path: '/right-manage/role/list', element: LazyLoad('sandbox/right-manage/RoleList') },
        { path: '/right-manage/right/list', element: LazyLoad('sandbox/right-manage/RightList') },
        { path: '/news-manage/add', element: LazyLoad('sandbox/news-manage/NewsAdd') },
        { path: '/news-manage/category', element: LazyLoad('sandbox/news-manage/NewsCategory') },
        { path: '/news-manage/draft', element: LazyLoad('sandbox/news-manage/NewsDraft') },
        { path: '/news-manage/preview/:id', element: LazyLoad('sandbox/news-manage/NewsPreview') },
        { path: '/news-manage/update/:id', element: LazyLoad('sandbox/news-manage/NewsUpdate') },
        { path: '/audit-manage/audit', element: LazyLoad('sandbox/audit-manage/Audit') },
        { path: '/audit-manage/list', element: LazyLoad('sandbox/audit-manage/AuditList') },
        {
          path: '/publish-manage/published',
          element: LazyLoad('sandbox/publish-manage/Published')
        },
        {
          path: '/publish-manage/unpublished',
          element: LazyLoad('sandbox/publish-manage/UnPublished')
        },
        { path: '/publish-manage/sunset', element: LazyLoad('sandbox/publish-manage/Sunset') },
        // 403 沒有權限
        { path: '*', element: LazyLoad('sandbox/nopermission/NoPermission') }
      ]
    }
  ])

  return element
}

const AuthComponent = ({ children }) => {
  const isLogin = localStorage.getItem('token')
  return isLogin ? children : <Navigate to="/login" />
}

const LazyLoad = (path) => {
  const Component = React.lazy(() => import(`../views/${path}`))
  return (
    <React.Suspense fallback={<>載入中...</>}>
      <Component />
    </React.Suspense>
  )
}
