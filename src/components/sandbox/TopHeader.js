import React, { useState } from 'react'

// antd
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'

const { Header } = Layout

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false)
  const ChangeCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const menu = (
    <Menu>
      <Menu.Item>超級管理員</Menu.Item>
      <Menu.Item danger>退出</Menu.Item>
    </Menu>
  )

  return (
    <Header className="site-layout-background" style={{ padding: '0 1rem' }}>
      {collapsed ? (
        <MenuUnfoldOutlined onClick={ChangeCollapsed} />
      ) : (
        <MenuFoldOutlined onClick={ChangeCollapsed} />
      )}
      <div style={{ float: 'right' }}>
        <span style={{ marginRight: '10px' }}>歡迎 admin 回來</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
