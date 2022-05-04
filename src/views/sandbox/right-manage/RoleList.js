import React, { useState, useEffect } from 'react'
import { getRoles, removeRole, updateRightsList } from '../../../api/roles'
import { getRights } from '../../../api/rights'
import { Table, Button, Modal, message, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    getRoles().then((res) => {
      setDataSource(res)
    })
    getRights().then((res) => {
      setRightList(res)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名稱',
      dataIndex: 'roleName'
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
            />
            <Button
              type="primary"
              shape="circle"
              icon={<UnorderedListOutlined />}
              onClick={() => {
                setIsModalVisible(true)
                setCurrentRights(item.rights)
                setCurrentId(item.id)
              }}
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
        deleteMethod(item)
      },
      onCancel() {
        message.warning('已取消')
      }
    })
  }

  const deleteMethod = (item) => {
    removeRole(item.id).then(() => {
      setDataSource(dataSource.filter((data) => data.id !== item.id))
      message.success('已成功刪除')
    })
  }

  const handleOk = () => {
    setIsModalVisible(false)
    // #1 同步 dataSource
    // 註: 也可以直接進行修改後重新請求一次資料, 這樣就不用去操作更新 dataSource
    setDataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          return {
            ...item,
            rights: currentRights
          }
        }
        return item
      })
    )
    // #2 發出修改請求
    updateRightsList(currentId, currentRights).then(() => {
      message.success('更新權限成功')
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onCheck = (checkedKeys) => {
    setCurrentRights(checkedKeys.checked)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />

      <Modal
        title="權限分配"
        cancelText="取消"
        okText="確定"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
