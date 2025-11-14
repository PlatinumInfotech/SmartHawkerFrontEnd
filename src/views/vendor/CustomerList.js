import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/useApi'

function VendorCustomerList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [vendorData, setVendorData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get vendor data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'))
    setVendorData(userData)

    if (userData?.id) {
      fetchCustomers(userData.id)
    }
  }, [])

  const fetchCustomers = async (vendorId, search = '') => {
    try {
      setLoading(true)

      const response = await api.get(`/vendors/${vendorId}/customers`, {
        params: search ? { search } : {}
      })

      console.log('Customers response:', response.data)

      if (response.data.statusCode === 200) {
        setCustomers(response.data.data || [])
      } else {
        setCustomers([])
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
        <p className="mt-2">Loading customers...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
        My Customers - {vendorData?.name}
      </h3>

      <CTable bordered hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">E-mail</CTableHeaderCell>
            <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
            <CTableHeaderCell scope="col">Address</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {customers.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={6} className="text-center">
                No customers found
              </CTableDataCell>
            </CTableRow>
          ) : (
            customers.map((customer, index) => (
              <CTableRow key={customer.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{customer.name}</CTableDataCell>
                <CTableDataCell>{customer.email || '-'}</CTableDataCell>
                <CTableDataCell>{customer.mobile}</CTableDataCell>
                <CTableDataCell>{customer.address || '-'}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="success"
                    size="sm"
                    onClick={() => {
                      // Navigate to sales report with customer pre-selected
                      window.location.href = `/#/vendor/sales?customerId=${customer.id}`
                    }}
                  >
                    View Sales
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default VendorCustomerList
