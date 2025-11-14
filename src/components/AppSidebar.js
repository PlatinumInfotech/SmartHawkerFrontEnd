import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

// Import logo
import logo from '../assets/images/logo.png'


// Import both navigation configs
import adminNav from '../_nav'
import vendorNav from '../_vendorNav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  // Get user type and determine which nav to show
  const [navigation, setNavigation] = useState([])

  useEffect(() => {
    const userType = localStorage.getItem('userType') || 'admin'

    if (userType === 'vendor') {
      setNavigation(vendorNav)
    } else {
      setNavigation(adminNav)
    }
  }, [])

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0.5rem 1rem'
          }}>
            {/* Logo Image */}
            <img
              src={logo}
              alt="SmartHawker"
              height={40}
              style={{ objectFit: 'contain' }}
            />
            {/* Text Logo - shown when sidebar is expanded */}
            <span
              className={unfoldable ? 'd-none' : ''}
              style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#fff',
                whiteSpace: 'nowrap'
              }}
            >
              SmartHawker
            </span>
          </div>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>


      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
