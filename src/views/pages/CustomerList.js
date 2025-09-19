import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import api from '../../services/useApi'

function CustomerList() {
  const [customers, setCustomers] = useState([])
  const { vendorId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // ✅ Business name from state
  const businessName = location.state?.businessName || 'Business Name'

  const fetchMonthlySales = async () => {
    try {
      const response = await api.get(`/admin/customer-list/${vendorId}`)
      console.log(response.data.data)
      setCustomers(response.data.data)
    } catch (error) {
      console.error('Failed to fetch customers:', error.message)
    }
  }

  useEffect(() => {
    fetchMonthlySales()
  }, [vendorId])

  return (
    <>
      <div style={{ padding: '20px' }}>
        {/* ✅ Business Name Heading */}
        <h3 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
          Customer List - {businessName}
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
            {customers.map((customer, index) => (
              <CTableRow key={customer?.customers_id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{customer?.customer_name}</CTableDataCell>
                <CTableDataCell>{customer?.customer_email}</CTableDataCell>
                <CTableDataCell>{customer?.customer_mobile}</CTableDataCell>
                <CTableDataCell>{customer?.customer_address}</CTableDataCell>
                <CTableDataCell className="flex gap-2">
                  <CButton
                    color="success"
                    size="sm"
                    onClick={() =>
                      navigate(`/sales-report/${vendorId}/${customer.customer_id}`, {
                        state: {
                          customerName: customer.customer_name,
                          businessName: businessName, // ✅ pass further
                        },
                      })
                    }
                  >
                    View Sales
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </>
  )
}
export default CustomerList
