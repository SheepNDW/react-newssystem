import React, { useEffect, useState } from 'react'
import './index.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

// antd
import { Layout, Menu } from 'antd'
import {
  UserOutlined,
  HomeOutlined,
  AuditOutlined,
  ReadOutlined,
  SoundOutlined,
  TeamOutlined
} from '@ant-design/icons'

const { Sider } = Layout
const { SubMenu } = Menu

export default function SideMenu() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedKeys = [location.pathname]
  const openKeys = ['/' + location.pathname.split('/')[1]]

  const [menu, setMenu] = useState([])
  const getRights = async () => {
    const { data: res } = await axios.get('http://localhost:5000/rights?_embed=children')
    setMenu(res)
  }
  useEffect(() => {
    getRights()
  }, [])

  const iconList = {
    '/home': <HomeOutlined />,
    '/user-manage': <UserOutlined />,
    '/right-manage': <TeamOutlined />,
    '/news-manage': <ReadOutlined />,
    '/audit-manage': <AuditOutlined />,
    '/publish-manage': <SoundOutlined />
  }

  const checkPermission = (item) => {
    return item.pagepermisson
  }

  const renderMenu = (menuList) => {
    return menuList.map((item) => {
      if (item.children?.length > 0 && checkPermission(item)) {
        return (
          <SubMenu key={item.key} title={item.title} icon={iconList[item.key]}>
            {renderMenu(item.children)}
          </SubMenu>
        )
      }

      return (
        checkPermission(item) && (
          <Menu.Item
            key={item.key}
            onClick={() => {
              navigate(item.key)
            }}
            icon={iconList[item.key]}
          >
            {item.title}
          </Menu.Item>
        )
      )
    })
  }

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className="logo">全球新聞發布系統</div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu selectedKeys={selectedKeys} defaultOpenKeys={openKeys} theme="dark" mode="inline">
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
