import React from 'react'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'

// antd
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'

const { Header } = Layout

function TopHeader(props) {
  const changeCollapsed = () => {
    // 改變 state 的 isCollapsed
    props.changeCollapsed()
  }

  const {
    role: { roleName },
    username
  } = JSON.parse(localStorage.getItem('token'))

  const navigate = useNavigate()
  const menu = (
    <Menu>
      <Menu.Item key={1}>{roleName}</Menu.Item>
      <Menu.Item
        key={2}
        danger
        onClick={() => {
          localStorage.removeItem('token')
          navigate('/login')
        }}
      >
        退出
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className="site-layout-background" style={{ padding: '0 1rem' }}>
      {props.isCollapsed ? (
        <MenuUnfoldOutlined onClick={changeCollapsed} />
      ) : (
        <MenuFoldOutlined onClick={changeCollapsed} />
      )}
      <div style={{ float: 'right' }}>
        <span style={{ marginRight: '10px' }}>
          歡迎<span style={{ color: '#1890ff' }}> {username} </span>回來
        </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: 'change_collapsed'
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
