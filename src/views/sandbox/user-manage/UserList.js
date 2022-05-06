import React, { useState, useEffect, useRef } from 'react'
import UserForm from '../../../components/user-manage/UserForm'
import { getUsers, removeUser, setUser, updateUserInfo, updateUserState } from '../../../api/user'
import { getRoles } from '../../../api/roles'
import { getRegions } from '../../../api/region'
import { Table, Button, Modal, message, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

export default function UserList() {
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const addForm = useRef(null)
  const updateForm = useRef(null)

  // --- 向後台取得資料 ---
  const [dataSource, setDataSource] = useState([])
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])

  const getUserList = async () => {
    const data = await getUsers()
    setDataSource(data)
  }
  const getRoleList = async () => {
    const data = await getRoles()
    setRoleList(data)
  }
  const getRegionList = async () => {
    const data = await getRegions()
    setRegionList(data)
  }

  useEffect(() => {
    getUserList()
    getRoleList()
    getRegionList()
  }, [])
  // ---------------------

  const columns = [
    {
      title: '區域',
      dataIndex: 'region',
      filters: [
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value
        })),
        { text: '全球', value: '' }
      ],
      onFilter: (value, item) => item.region === value,
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      }
    },
    {
      title: '角色名稱',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用戶名',
      dataIndex: 'username'
    },
    {
      title: '用戶狀態',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => handleChange(item)}
          ></Switch>
        )
      }
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
              style={{ marginRight: '10px' }}
              onClick={() => confirmMethod(item)}
              disabled={item.default}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => handleUpdate(item)}
            />
          </div>
        )
      }
    }
  ]

  const handleUpdate = (item) => {
    // 寫一個 setTimeout 讓 setIsUpdateVisible 變成同步的
    setTimeout(() => {
      setIsUpdateVisible(true)
      if (item.roleId === 1) {
        // 禁用區域
        setIsUpdateDisabled(true)
      } else {
        // 取消禁用區域
        setIsUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0)

    setCurrentItem(item)
  }

  const handleChange = (item) => {
    item.roleState = !item.roleState
    updateUserState(item).then(() => {
      message.success('更新用戶狀態成功')
      setDataSource([...dataSource])
    })
  }

  const confirmMethod = (item) => {
    confirm({
      title: '你確定要刪除嗎？',
      icon: <ExclamationCircleOutlined />,
      content: '注意！此操作不可逆',
      cancelText: '取消',
      okText: '確定',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        message.warning('已取消')
      }
    })
  }

  // 刪除方法
  const deleteMethod = (item) => {
    removeUser(item.id).then(() => {
      message.success('已成功刪除該用戶')
      setDataSource(dataSource.filter((data) => data.id !== item.id))
    })
  }

  // 添加用戶方法
  const addFormOk = () => {
    addForm.current
      .validateFields()
      .then((value) => {
        // 關閉並重置 Modal 表單
        setIsAddVisible(false)
        addForm.current.resetFields()

        // 新增用戶並重新獲取 userList
        setUser(value).then(() => {
          getUserList().then(() => {
            message.success('添加用戶成功')
          })
        })
      })
      .catch((err) => {
        console.log(err)
        message.error('添加失敗 請再試一次')
      })
  }

  // 更新用戶方法
  const updateFormOk = () => {
    updateForm.current
      .validateFields()
      .then((value) => {
        setIsUpdateVisible(false)

        updateUserInfo(currentItem.id, value).then(async () => {
          await getUserList()
          message.success('更新用戶資訊成功')
        })

        setIsUpdateDisabled(!isUpdateDisabled)
      })
      .catch((err) => {
        console.log(err)
        message.error('更新失敗 請再試一次')
      })
  }

  return (
    <>
      <Button type="primary" onClick={() => setIsAddVisible(true)}>
        添加用戶
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={(item) => item.id}
      />

      <Modal
        visible={isAddVisible}
        title="添加用戶"
        okText="確定"
        cancelText="取消"
        onCancel={() => setIsAddVisible(false)}
        onOk={() => addFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm} />
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新用戶資訊"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => updateFormOk()}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
        />
      </Modal>
    </>
  )
}
