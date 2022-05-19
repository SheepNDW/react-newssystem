import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader, Descriptions, Divider } from 'antd'
import { HeartTwoTone } from '@ant-design/icons'
import { getNewsInfo, updatePublishedNews } from '../../api/news'
import moment from 'moment'

export default function Detail() {
  const [newsInfo, setNewsInfo] = useState(null)
  const params = useParams()

  const getNewsDetail = useCallback(async () => {
    const data = await getNewsInfo(params.id)
    setNewsInfo({
      ...data,
      view: data.view + 1
    })
    return data
  }, [params.id])

  useEffect(() => {
    getNewsDetail().then((data) => {
      updatePublishedNews(params.id, { view: data.view + 1 })
    })
  }, [getNewsDetail, params.id])

  const handleStar = () => {
    setNewsInfo({
      ...newsInfo,
      star: newsInfo.star + 1
    })
    updatePublishedNews(params.id, { star: newsInfo.star + 1 })
  }

  return (
    <>
      {newsInfo && (
        <div>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={
              <div>
                {newsInfo.category.title}
                <HeartTwoTone
                  twoToneColor="#eb2f96"
                  style={{ marginLeft: '10px' }}
                  onClick={() => handleStar()}
                />
              </div>
            }
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="創建者">{newsInfo.author}</Descriptions.Item>
              <Descriptions.Item label="發布時間">
                {newsInfo.publishTime
                  ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="區域">{newsInfo.region}</Descriptions.Item>
              <Descriptions.Item label="訪問數量">{newsInfo.view}</Descriptions.Item>
              <Descriptions.Item label="點讚數量">{newsInfo.star}</Descriptions.Item>
              <Descriptions.Item label="評論數量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>

          <Divider orientation="left" plain orientationMargin={20}>
            文章内容
          </Divider>

          <div
            dangerouslySetInnerHTML={{ __html: newsInfo.content }}
            style={{ marginLeft: '24px' }}
          ></div>
        </div>
      )}
    </>
  )
}
