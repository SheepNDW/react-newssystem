import React, { useState, useEffect } from 'react'
import { getDrafts, removeNews, updateAuditState } from '../../../api/news'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Modal, message, notification } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined
} from '@ant-design/icons'

const { confirm } = Modal

export default function NewsDraft() {
  const navigate = useNavigate()
  const [dataSource, setDataSource] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getDraftList = async () => {
    const data = await getDrafts()
    setDataSource(data)
  }
  useEffect(() => {
    getDraftList()
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '新聞標題',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '分類',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
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
              onClick={() => {
                confirmMethod(item)
              }}
              style={{ marginRight: '10px' }}
            />
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ marginRight: '10px' }}
              onClick={() => {
                navigate(`/news-manage/update/${item.id}`)
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<UploadOutlined />}
              onClick={() => handleCheck(item.id)}
            />
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
        setIsLoading(true)
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  // 刪除方法
  const deleteMethod = async (item) => {
    await removeNews(item.id)
    message.success('已成功刪除')
    setIsLoading(false)
    getDraftList()
  }

  const handleCheck = async (id) => {
    await updateAuditState(id, 1)
    navigate('/audit-manage/list')

    notification.info({
      message: '通知',
      description: `您可以到審核列表中查看您的新聞`,
      placement: 'bottomRight'
    })
  }

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
        loading={isLoading}
        rowKey={(item) => item.id}
      />
    </>
  )
}
