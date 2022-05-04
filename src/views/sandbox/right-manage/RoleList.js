import React, { useState, useEffect } from 'react'
import { getRoles, removeRole } from '../../../api/roles'
import { Table, Button, Modal, message } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名稱',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              style={{ marginRight: '10px' }}
              onClick={() => confirmMethod(item)}
            />
            <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} />
          </div>
        )
      }
    }
  ]

  const confirmMethod = (item) => {
    confirm({
      title: '你確定要刪除嗎？',
      icon: <ExclamationCircleOutlined />,
      content: '注意！此操作不可逆',
      cancelText: '取消',
      okText: '確定',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        message.warning('已取消')
      }
    })
  }

  const deleteMethod = (item) => {
    removeRole(item.id).then(() => {
      setDataSource(dataSource.filter((data) => data.id !== item.id))
      message.success('已成功刪除')
    })
  }

  useEffect(() => {
    getRoles().then((res) => {
      setDataSource(res)
    })
  }, [])

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />
    </div>
  )
}
