import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'
import { AppHeader, AppSidebar } from '../../components'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const { vendorId } = useParams()

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/admin/employee-list/${vendorId}`)
      .then((response) => {
        console.log(response.data.data, 'Hello')
        setEmployees(response.data.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  return (
    <>
      <div>
        <CTable>
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
            {employees.map((employees, index) => (
              <CTableRow key={employees?.employees_id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{employees?.employee_name}</CTableDataCell>
                <CTableDataCell>{employees?.employee_email}</CTableDataCell>
                <CTableDataCell>{employees?.employee_mobile}</CTableDataCell>
                <CTableDataCell>{employees?.employee_address}</CTableDataCell>
                <CTableDataCell>{employees?.employee_role}</CTableDataCell>
                <CTableDataCell className="flex gap-2">
                  {/* <CButton color="primary" size="sm" className="me-2">
                    View Employee
                  </CButton>
                  <CButton color="info" size="sm">
                    View Customer
                  </CButton> */}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </>
  )
}
export default EmployeeList
