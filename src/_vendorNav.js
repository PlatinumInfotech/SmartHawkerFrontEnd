import React from 'react'
import CIcon from '@coreui/icons-react'

import {
  cilSpeedometer,
  cilPeople,
  cilBasket,
  cilChart,
  cilUser,
  cilCreditCard,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _vendorNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/vendor/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'My Business',
  },
  {
    component: CNavItem,
    name: 'My Customers',
    to: '/vendor/customers',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Products',
    to: '/vendor/products',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Sales Reports',
    to: '/vendor/sales',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Account',
  },
  {
    component: CNavItem,
    name: 'Profile',
    to: '/vendor/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Subscription',
    to: '/vendor/subscription',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
  }
]

export default _vendorNav
