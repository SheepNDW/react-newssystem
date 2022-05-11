import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader, Descriptions, Divider } from 'antd'
import { getNewsInfo } from '../../../api/news'
import moment from 'moment'

export default function NewsPreview() {
  const [newsInfo, setNewsInfo] = useState(null)
  const params = useParams()
  useEffect(() => {
    getNewsInfo(params.id).then((data) => {
      setNewsInfo(data)
    })
  }, [params.id])

  const auditList = ['未審核', '審核中', '已通過', '未通過']
  const publishList = ['未發布', '待發布', '已上線', '已下線']

  return (
    <>
      {newsInfo && (
        <div>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="創建者">{newsInfo.author}</Descriptions.Item>
              <Descriptions.Item label="創建時間">
                {moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="發布時間">
                {newsInfo.publishTime
                  ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="區域">{newsInfo.region}</Descriptions.Item>
              <Descriptions.Item label="審核狀態">
                <span style={{ color: 'red' }}>{auditList[newsInfo.auditState]}</span>
              </Descriptions.Item>
              <Descriptions.Item label="發布狀態">
                <span style={{ color: 'red' }}>{publishList[newsInfo.publishState]}</span>
              </Descriptions.Item>
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
