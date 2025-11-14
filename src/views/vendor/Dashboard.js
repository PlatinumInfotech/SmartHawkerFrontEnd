import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import VendorWidgetsDropdown from './VendorWidgetsDropdown'

const VendorDashboard = () => {
  const [vendorData, setVendorData] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    setVendorData(userData)
  }, [])

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <>
      {/* Welcome Section with Greeting */}
      <CRow className="mb-4">
        <CCol>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                {getGreeting()}, {vendorData?.name || 'Vendor'}! 👋
              </h2>
              <p className="text-medium-emphasis mb-0">
                Here's what's happening with your business today.
              </p>
            </div>
          </div>
        </CCol>
      </CRow>

      {/* Stats Widgets */}
      <VendorWidgetsDropdown className="mb-4" />
    </>
  )
}

export default VendorDashboard
