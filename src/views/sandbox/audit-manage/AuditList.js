import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuditList, publish, updateAuditState } from '../../../api/news'
import { Table, Tag, Button, notification } from 'antd'

export default function AuditList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    getAuditList().then((data) => {
      setDataSource(data)
    })
  }, [])

  const columns = [
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
      title: '新聞分類',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '審核狀態',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ['草稿箱', '審核中', '已通過', '未通過']
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            {item.auditState === 1 && <Button onClick={() => handleRevert(item)}>撤銷</Button>}
            {item.auditState === 2 && (
              <Button danger onClick={() => handlePublish(item)}>
                發布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button type="primary" onClick={() => handleUpdate(item)}>
                更新
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  // 撤銷
  const handleRevert = async (item) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    await updateAuditState(item.id, 0)

    notification.info({
      message: '通知',
      description: `您可以到草稿箱中查看您的新聞`,
      placement: 'bottomRight'
    })
  }

  // 更新
  const navigate = useNavigate()
  const handleUpdate = (item) => {
    navigate(`/news-manage/update/${item.id}`)
  }

  // 發布
  const handlePublish = async (item) => {
    await publish(item.id)
    navigate('/publish-manage/published')

    notification.info({
      message: '通知',
      description: `您可以到【發布管理/已經發布】查看您的新聞`,
      placement: 'bottomRight'
    })
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={(item) => item.id}
      />
    </div>
  )
}
