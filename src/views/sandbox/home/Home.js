import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, List, Avatar } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { getAllPublished, getMostStars, getMostViews } from '../../../api/news'
import * as echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card

export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  useEffect(() => {
    getMostViews().then((data) => {
      setViewList(data)
    })
    getMostStars().then((data) => {
      setStarList(data)
    })
    getAllPublished().then((data) => {
      renderBarView(_.groupBy(data, (item) => item.category.title))
    })

    return () => {
      window.onresize = null
    }
  }, [])

  const barRef = useRef()
  const renderBarView = (obj) => {
    const myChart = echarts.init(barRef.current)

    const option = {
      title: {
        text: '新聞分類'
      },
      tooltip: {},
      legend: {
        data: ['數量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '數量',
          type: 'bar',
          data: Object.values(obj).map((item) => item.length)
        }
      ]
    }

    myChart.setOption(option)

    window.onresize = () => {
      myChart.resize()
    }
  }

  const {
    username,
    region,
    role: { roleName }
  } = JSON.parse(localStorage.getItem('token'))

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用戶最常瀏覽" bordered>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用戶點讚最多" bordered>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ paddingLeft: '30px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <div ref={barRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
    </div>
  )
}
