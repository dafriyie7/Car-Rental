import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import { Outlet } from 'react-router-dom'
import SideBarOwner from '../../components/owner/SideBarOwner'
import { useAppContext } from '../../context/appContext'

const Layout = () => {

  const { isOwner, navigate } = useAppContext()
  
  useEffect(() => {
    if (!isOwner) {
      navigate('/')
    }
  },[isOwner])

  return (
      <div className='flex flex-col'>
          <NavbarOwner />

          <div className='flex'>
              <SideBarOwner />
              <Outlet />
          </div>
    </div>
  )
}

export default Layout