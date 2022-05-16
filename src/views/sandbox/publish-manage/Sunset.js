import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

import { Button } from 'antd'

export default function Sunsets() {
  const { dataSource, handleDelete } = usePublish(3)

  return (
    <>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button danger onClick={() => handleDelete(id)}>
            刪除
          </Button>
        )}
      ></NewsPublish>
    </>
  )
}
