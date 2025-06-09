import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CToast,
  CToastBody,
  CToaster,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [toasts, setToasts] = useState([])
  const username = 'User'
  const initial = username.charAt(0).toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToasts((prevToasts) => [
      ...prevToasts,
      <CToast
        key={Date.now()}
        className="align-items-center text-white bg-success border-0"
        delay={2000}
        autohide
      >
        <CToastBody>Logout successful</CToastBody>
      </CToast>,
    ])
    setTimeout(() => navigate('/login'), 1500) // Wait for toast before redirecting
  }

  return (
    <>
      {/* <CToaster push={toasts} placement="top-end" /> */}
      <CDropdown variant="nav-item" placement="bottom-end">
        <CDropdownToggle caret={false} className="nav-link px-2 d-flex align-items-center">
          <div
            style={{
              backgroundColor: '#6c757d',
              color: '#fff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}
          >
            {initial}
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilBell} className="me-2" />
            Updates
            <CBadge color="info" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Messages
            <CBadge color="success" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilTask} className="me-2" />
            Tasks
            <CBadge color="danger" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilCommentSquare} className="me-2" />
            Comments
            <CBadge color="warning" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>

          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilSettings} className="me-2" />
            Settings
          </CDropdownItem>
          <CDropdownItem onClick={handleLogout}>
            <CIcon icon={cilCreditCard} className="me-2" />
            Logout
          </CDropdownItem>

          <CDropdownDivider />
          <CDropdownItem href="#">
            <CIcon icon={cilLockLocked} className="me-2" />
            Lock Account
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default AppHeaderDropdown 
