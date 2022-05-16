import { useEffect, useState } from 'react'
import axios from 'axios'
import { publish, removeNews, updatePublishState } from '../../api/news'
import { notification } from 'antd'

function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem('token'))

  const [dataSource, setDataSource] = useState([])

  const getPublishInfo = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/news?author=${username}&publishState=${type}&_expand=category`
    )
    setDataSource(data)
  }

  useEffect(() => {
    getPublishInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePublish = async (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id))

    await publish(id)
    notification.info({
      message: '通知',
      description: `您可以到【發布管理/已經發布】中查看您的新聞`,
      placement: 'bottomRight'
    })
  }

  const handleSunset = async (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id))

    await updatePublishState(id, 3)
    notification.info({
      message: '通知',
      description: `您可以到【發布管理/已下線】中查看您的新聞`,
      placement: 'bottomRight'
    })
  }

  const handleDelete = async (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id))

    await removeNews(id)
    notification.info({
      message: '通知',
      description: `您已經刪除了已下線的新聞`,
      placement: 'bottomRight'
    })
  }

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete
  }
}

export default usePublish
