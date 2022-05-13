import React from 'react'
import { useNavigate } from 'react-router-dom'
import './login.scss'
import { login } from '../../api/login'

import { Form, Button, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

export default function Login() {
  const navigate = useNavigate()

  const onFinish = async (values) => {
    const data = await login(values)
    if (data.length === 0) {
      message.error('密碼錯誤或用戶名不存在!')
    } else {
      localStorage.setItem('token', JSON.stringify(data[0]))
      navigate('/home')
    }
  }
  return (
    <div style={{ backgroundColor: 'rgb(35,39,65)', height: '100%' }}>
      <div className="formContainer">
        <div className="loginTitle">全球新聞發布管理系統</div>
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ float: 'right' }}
            >
              登入
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
