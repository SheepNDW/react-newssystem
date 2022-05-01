import React from 'react'
import { Outlet } from 'react-router-dom'

import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'

export default function NewsSandBox() {
  return (
    <>
      <SideMenu></SideMenu>
      <TopHeader></TopHeader>

      <Outlet></Outlet>
    </>
  )
}
