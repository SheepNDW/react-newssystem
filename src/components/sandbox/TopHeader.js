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
    <Menu
      items={[
        {
          label: '超級管理員'
        },
        {
          danger: true,
          label: '退出'
        }
      ]}
    />
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
