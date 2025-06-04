import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a
          href="https://play.google.com/store/apps/details?id=com.smarthawker.admin"
          target="_blank"
          rel="noopener noreferrer"
        >
          SmartHawker
        </a>
        <span className="ms-1">&copy; 2025 PlatinumInfotech </span>
      </div>
      {/* <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          CoreUI React Admin &amp; Dashboard Template
        </a>
      </div> */}
    </CFooter>
  )
}

export default React.memo(AppFooter)
