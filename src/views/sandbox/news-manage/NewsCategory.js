import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Button, Modal, message, Form, Input } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getCategories, removeCategories } from '../../../api/news'
import axios from 'axios'

const EditableContext = React.createContext(null)
const { confirm } = Modal

export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getRightsList = async () => {
    const data = await getCategories()
    setDataSource(data)
  }
  useEffect(() => {
    getRightsList()
  }, [])

  const handleSave = (record) => {
    setDataSource(
      dataSource.map((item) => {
        if (item.id === record.id) {
          return {
            id: item.id,
            title: record.title,
            value: record.title
          }
        }
        return item
      })
    )
    axios
      .patch(`http://localhost:5000/categories/${record.id}`, {
        title: record.title,
        value: record.value
      })
      .then(() => {
        message.success('修改成功')
      })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '欄目名稱',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '欄目名稱',
        handleSave: handleSave
      })
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
            />
          </div>
        )
      }
    }
  ]

  const confirmMethod = (item) => {
    confirm({
      title: '你確定要刪除嗎？',
      icon: <ExclamationCircleOutlined />,
      content: '注意！此操作不可逆',
      cancelText: '取消',
      okText: '確定',
      onOk() {
        setIsLoading(true)
        deleteMethod(item)
      },
      onCancel() {
        message.warning('已取消')
      }
    })
  }

  // 刪除方法
  const deleteMethod = async (item) => {
    await removeCategories(item.id)
    setTimeout(() => {
      setDataSource(dataSource.filter((data) => data.id !== item.id))
      setIsLoading(false)
      message.success('已成功刪除')
    }, 500)
  }

  // -------------------------------------------
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef(null)
    const form = useContext(EditableContext)
    useEffect(() => {
      if (editing) {
        inputRef.current.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
        [dataIndex]: record[dataIndex]
      })
    }

    const save = async () => {
      try {
        const values = await form.validateFields()
        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`
            }
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }

    return <td {...restProps}>{childNode}</td>
  }
  // -------------------------------------------

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
        loading={isLoading}
        rowKey={(item) => item.id}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell
          }
        }}
      />
    </>
  )
}
