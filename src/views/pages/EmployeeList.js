import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import api from '../../services/useApi'

function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const { vendorId } = useParams()
  const location = useLocation()

  // ✅ Business name from navigate state
  const businessName = location.state?.businessName || 'Business Name'

  useEffect(() => {
    api
      .get(`/admin/employee-list/${vendorId}`)
      .then((response) => {
        console.log(response.data.data, 'Hello')
        setEmployees(response.data.data)
      })
      .catch((error) => {
        console.error(error.message)
      })
  }, [vendorId])

  return (
    <>
      <div style={{ padding: '20px' }}>
        {/* ✅ Show Business Name */}
        <h3 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
          Employee List - {businessName}
        </h3>

        <CTable bordered hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">E-mail</CTableHeaderCell>
              <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
              <CTableHeaderCell scope="col">Address</CTableHeaderCell>
              <CTableHeaderCell scope="col">Role</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {employees.map((emp, index) => (
              <CTableRow key={emp?.employees_id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{emp?.employee_name}</CTableDataCell>
                <CTableDataCell>{emp?.employee_email}</CTableDataCell>
                <CTableDataCell>{emp?.employee_mobile}</CTableDataCell>
                <CTableDataCell>{emp?.employee_address}</CTableDataCell>
                <CTableDataCell>{emp?.employee_role}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </>
  )
}

export default EmployeeList
