import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getRights = async () => {
    const { data } = await axios.get('http://localhost:5000/rights?_embed=children')
    // 清除沒有 children 時後端預設的 children: []
    data.forEach((item) => {
      if (item.children.length === 0) {
        item.children = null
      }
    })
    setDataSource(data)
  }
  useEffect(() => {
    getRights()
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '權限名稱',
      dataIndex: 'title'
    },
    {
      title: '權限路徑',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="volcano">{key}</Tag>
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
              style={{ marginRight: '10px' }}
              onClick={() => confirmMethod(item)}
            />

            <Popover
              content={
                <div style={{ textAlign: 'center' }}>
                  <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)} />
                </div>
              }
              title="頁面配置項"
              trigger={item.pagepermisson === undefined ? '' : 'click'}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              />
            </Popover>
          </div>
        )
      }
    }
  ]

  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])

    if (item.grade === 1) {
      axios.patch(`http://localhost:5000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`http://localhost:5000/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }

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
  const deleteMethod = (item) => {
    console.log(item)
    // 當前頁面同步狀態 + 後端同步
    if (item.grade === 1) {
      // 如果是刪除一級權限
      axios.delete(`http://localhost:5000/rights/${item.id}`).then(() => {
        // 註: 寫個 timeout 模擬真實後端請求時間
        setTimeout(() => {
          setDataSource(dataSource.filter((data) => data.id !== item.id))
          setIsLoading(false)
        }, 500)
      })
    } else {
      // 刪除的是二級權限
      console.log(item.rightId)
      axios.delete(`http://localhost:5000/children/${item.id}`).then(() => {
        setTimeout(() => {
          const list = dataSource.filter((data) => data.id === item.rightId)
          list[0].children = list[0].children.filter((data) => data.id !== item.id)
          setDataSource([...dataSource])
          setIsLoading(false)
        }, 500)
      })
    }
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
      />
    </>
  )
}
