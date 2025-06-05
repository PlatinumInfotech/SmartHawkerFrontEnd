import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react'
import React from 'react'
import { AppHeader, AppSidebar } from '../../components'
import DefaultLayout from '../../layout/DefaultLayout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import api from '../../services/useApi'

function CustomerList() {
  const [customers, setCustomers] = useState([])
  const { vendorId } = useParams()
  const navigate = useNavigate()

  const fetchMonthlySales = async () => {
    try {
      const response = await api.get(`/admin/customer-list/${vendorId}`)

      console.log(response.data.data)
      setCustomers(response.data.data)
      // setSalesData(response.data.sales)
      // setTotalExpenses(response.data.totalMonthlyExpenses)
    } catch (error) {
      console.error('Failed to fetch sales:', error.message)
      // setError(error.message)
    }
  }

  useEffect(() => {
    fetchMonthlySales()
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
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {customers.map((customers, index) => (
              <CTableRow key={customers?.customers_id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{customers?.customer_name}</CTableDataCell>
                <CTableDataCell>{customers?.customer_email}</CTableDataCell>
                <CTableDataCell>{customers?.customer_mobile}</CTableDataCell>
                <CTableDataCell>{customers?.customer_address}</CTableDataCell>
                <CTableDataCell className="flex gap-2">
                  <CButton
                    color="success"
                    size="sm"
                    onClick={() =>
                      navigate(`/sales-report/${vendorId}/${customers.customer_id}`, {
                        state: {
                          customerName: customers.customer_name,
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
