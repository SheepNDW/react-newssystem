import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Select, Input } from 'antd'

const { Option } = Select

const UserForm = forwardRef((props, ref) => {
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])

  return (
    <Form ref={ref} layout="vertical">
      <Form.Item
        name="username"
        label="用戶名"
        rules={[
          {
            required: true,
            message: '請輸入用戶名!'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密碼"
        rules={[
          {
            required: true,
            message: '請輸入密碼!'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="區域"
        rules={isDisabled ? [] : [{ required: true, message: '請選擇區域!' }]}
      >
        <Select disabled={isDisabled}>
          {props.regionList.map((item) => (
            <Option value={item.value} key={item.id}>
              {item.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: '請選擇角色!'
          }
        ]}
      >
        <Select
          onChange={(value) => {
            if (value === 1) {
              setIsDisabled(true)
              ref.current.setFieldsValue({
                region: ''
              })
            } else {
              setIsDisabled(false)
            }
          }}
        >
          {props.roleList.map((item) => (
            <Option value={item.id} key={item.id}>
              {item.roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  )
})

export default UserForm
