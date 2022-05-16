import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

import { Button } from 'antd'

export default function UnPublished() {
  const { dataSource, handlePublish } = usePublish(1)

  return (
    <>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button type="primary" onClick={() => handlePublish(id)}>
            發布
          </Button>
        )}
      ></NewsPublish>
    </>
  )
}
