import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import './NewsSandBox.scss'
import { connect } from 'react-redux'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// antd
import { Layout, Spin } from 'antd'
const { Content } = Layout

function NewsSandBox(props) {
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  })
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Spin size="large" spinning={props.isLoading}>
            <Outlet></Outlet>
          </Spin>
        </Content>
      </Layout>
    </Layout>
  )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({ isLoading })

export default connect(mapStateToProps)(NewsSandBox)
