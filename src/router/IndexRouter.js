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
