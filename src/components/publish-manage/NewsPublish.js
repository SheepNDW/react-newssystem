import React from 'react'

import { Table } from 'antd'

export default function NewsPublish(props) {
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
        return <div>{props.button(item.id)}</div>
      }
    }
  ]

  return (
    <>
      <Table
        dataSource={props.dataSource}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={(item) => item.id}
      />
    </>
  )
}
