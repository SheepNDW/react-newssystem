import React, { useEffect, useState } from 'react'
import { getAllPublished } from '../../api/news'
import { PageHeader, Row, Col, Card, List } from 'antd'
import _ from 'lodash'

export default function News() {
  const [list, setList] = useState([])
  useEffect(() => {
    getAllPublished().then((data) => {
      // entries ==> 將原本的物件轉為二維陣列
      setList(Object.entries(_.groupBy(data, (item) => item.category.title)))
    })
  }, [])

  return (
    <div style={{ width: '95%', margin: '0 auto' }}>
      <PageHeader className="site-page-header" title="全球大新聞" subTitle="查看新聞" />

      <div className="site-card-wrapper">
        <Row gutter={[16, 16]}>
          {list.map((item) => (
            <Col span={8} key={item[0]}>
              <Card title={item[0]} bordered hoverable>
                <List
                  size="small"
                  dataSource={item[1]}
                  pagination={{
                    pageSize: 3
                  }}
                  renderItem={(data) => (
                    <List.Item>
                      <a href={`#/detail/${data.id}`}>{data.title}</a>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}
