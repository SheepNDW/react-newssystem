import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, PieChartOutlined } from '@ant-design/icons'
import { getAllPublished, getMostStars, getMostViews } from '../../../api/news'
import * as echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card

export default function Home() {
  const [allList, setAllList] = useState([])
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    getMostViews().then((data) => {
      setViewList(data)
    })
    getMostStars().then((data) => {
      setStarList(data)
    })
    getAllPublished().then((data) => {
      renderBarView(_.groupBy(data, (item) => item.category.title))
      setAllList(data)
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

  const pieRef = useRef()
  const [pieChart, setPieChart] = useState(null)
  const renderPieView = () => {
    // 資料處理工作
    const currentList = allList.filter((item) => item.author === username)
    const groupObj = _.groupBy(currentList, (item) => item.category.title)

    const list = []
    for (const i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }

    let myChart
    if (!pieChart) {
      myChart = echarts.init(pieRef.current)
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }
    let option

    option = {
      title: {
        text: '當前用戶新聞分類圖示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '發布數量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    option && myChart.setOption(option)
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
              <PieChartOutlined
                key="setting"
                onClick={() => {
                  setTimeout(() => {
                    setVisible(true)
                    renderPieView()
                  }, 0)
                }}
              />,
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

      <Drawer
        width="500px"
        title="個人新聞分類"
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <div ref={pieRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
      </Drawer>

      <div ref={barRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
    </div>
  )
}
