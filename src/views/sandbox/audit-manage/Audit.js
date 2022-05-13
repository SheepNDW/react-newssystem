import React, { useState, useEffect } from 'react'
import { getAuditing, updateAuditState, updatePublishState } from '../../../api/news'
import { Table, Button, notification } from 'antd'

export default function Audit() {
  const [dataSource, setDataSource] = useState([])

  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  const roleObj = {
    1: 'superAdmin',
    2: 'admin',
    3: 'editor'
  }

  const getAuditingList = () => {
    getAuditing().then((data) => {
      setDataSource(
        roleObj[roleId] === 'superAdmin'
          ? data
          : [
              ...data.filter((item) => item.author === username),
              ...data.filter((item) => item.region === region && roleObj[item.roleId] === 'editor')
            ]
      )
    })
  }

  useEffect(() => {
    getAuditingList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button type="primary" onClick={() => handleAudit(item, 2, 1)}>
              通過
            </Button>
            <Button danger onClick={() => handleAudit(item, 3, 0)}>
              駁回
            </Button>
          </div>
        )
      }
    }
  ]

  const handleAudit = async (item, auditState, publishState) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    await updateAuditState(item.id, auditState)
    await updatePublishState(item.id, publishState)

    notification.info({
      message: '通知',
      description: `您可以到【審核管理/審核列表】查看您的新聞審核狀態`,
      placement: 'bottomRight'
    })
    getAuditingList()
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
