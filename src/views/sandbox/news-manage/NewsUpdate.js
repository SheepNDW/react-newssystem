import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import style from './News.module.scss'
import { getCategories, getNewsInfo, updateNews } from '../../../api/news'
import NewsEditor from '../../../components/news-manage/NewsEditor'

const { Step } = Steps
const { Option } = Select

export default function NewsUpdate() {
  const NewsForm = useRef(null)
  const [current, setCurrent] = useState(0)
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')

  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          setFormInfo(res)
          setCurrent(current + 1)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        return message.error('新聞內容不得為空')
      }

      console.log(formInfo, content)
      setCurrent(current + 1)
    }
  }
  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const [categoryList, setCategoryList] = useState([])
  useEffect(() => {
    getCategories().then((data) => {
      setCategoryList(data)
    })
  }, [])

  const params = useParams()
  useEffect(() => {
    getNewsInfo(params.id).then((data) => {
      const { title, categoryId, content } = data

      // content, formInfo
      NewsForm.current.setFieldsValue({
        title,
        categoryId
      })

      setContent(content)
    })
  }, [params.id])

  const navigate = useNavigate()
  const handleSave = async (auditState) => {
    await updateNews(params.id, formInfo, content, auditState)
    navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

    notification.info({
      message: '通知',
      description: `您可以到${auditState === 0 ? '草稿箱' : '審核列表'}中查看您的新聞`,
      placement: 'bottomRight'
    })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="更新新聞"
        onBack={() => {
          window.history.back()
        }}
      />

      <Steps current={current}>
        <Step title="基本資訊" description="新聞標題、新聞分類" />
        <Step title="新聞內容" description="新聞主要內容" />
        <Step title="新聞提交" description="保存草稿或提交審核" />
      </Steps>

      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : style.hidden}>
          <Form ref={NewsForm} name="basic" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
            <Form.Item
              label="新聞標題"
              name="title"
              rules={[{ required: true, message: '請輸入新聞標題!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新聞分類"
              name="categoryId"
              rules={[{ required: true, message: '請選擇新聞分類!' }]}
            >
              <Select>
                {categoryList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.hidden}>
          <NewsEditor getContent={(value) => setContent(value)} content={content} />
        </div>
        <div className={current === 2 ? '' : style.hidden}></div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交審核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  )
}
