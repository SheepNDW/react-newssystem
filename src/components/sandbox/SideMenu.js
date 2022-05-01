import React from 'react'
import './index.scss'

// antd
import { Layout, Menu } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const { Sider } = Layout

// mock data 的陣列結構
const menuList = [
  {
    key: '/home',
    label: '首頁',
    icon: <UserOutlined />
  },
  {
    key: '/user-manage',
    label: '用戶管理',
    icon: <UserOutlined />,
    children: [
      {
        key: '/user-manage/list',
        label: '用戶列表',
        icon: <UserOutlined />
      }
    ]
  },
  {
    key: '/right-manage',
    label: '權限管理',
    icon: <UserOutlined />,
    children: [
      {
        key: '/right-manage/role/list',
        label: '角色列表',
        icon: <UserOutlined />
      },
      {
        key: '/right-manage/right/list',
        label: '權限列表',
        icon: <UserOutlined />
      }
    ]
  }
]

export default function SideMenu() {
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div className="logo">全球新聞發布系統</div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['/home']} items={menuList} />
    </Sider>
  )
}
