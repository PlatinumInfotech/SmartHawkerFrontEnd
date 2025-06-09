import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/useApi'

function VendorList() {
  const [vendors, setVendors] = useState([])
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    mobile: '',
    status: 'active',
  })
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get('/admin/vendor-list')
      .then((response) => {
        setVendors(response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching vendors:', error.message)
      })
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  const filteredVendors = vendors.filter((vendor) => {
    return (
      vendor.vendor_name.toLowerCase().includes(filters.name.toLowerCase()) &&
      vendor.vendor_email.toLowerCase().includes(filters.email.toLowerCase()) &&
      vendor.vendor_mobile.includes(filters.mobile) &&
      (filters.status === '' || vendor.vendor_status.toLowerCase() === filters.status)
    )
  })

  return (
    <>
      <CTable>
        {/* Filter Row - Above Header */}
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell />
            <CTableHeaderCell>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Search name"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '1rem',
                  backgroundColor: '#e8f0fe', // light blue for contrast
                  border: '1px solid #a5b4fc',
                  borderRadius: '6px',
                }}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                placeholder="Search email"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '1rem',
                  backgroundColor: '#e8f0fe',
                  border: '1px solid #a5b4fc',
                  borderRadius: '6px',
                }}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                name="mobile"
                value={filters.mobile}
                onChange={handleFilterChange}
                placeholder="Search mobile"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '1rem',
                  backgroundColor: '#e8f0fe',
                  border: '1px solid #a5b4fc',
                  borderRadius: '6px',
                }}
              />
            </CTableHeaderCell>
            <CTableHeaderCell />
            <CTableHeaderCell />
            <CTableHeaderCell>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '1rem',
                  backgroundColor: '#e8f0fe',
                  border: '1px solid #a5b4fc',
                  borderRadius: '6px',
                  color: filters.status === '' ? '#6c757d' : 'inherit', // gray if "All"
                }}
              >

                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

            </CTableHeaderCell>
            <CTableHeaderCell />
          </CTableRow>
        </CTableHead>



        {/* Column Header */}
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">E-mail</CTableHeaderCell>
            <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
            <CTableHeaderCell scope="col">Address</CTableHeaderCell>
            <CTableHeaderCell scope="col">Business_name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">TodaySales</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        {/* Table Body */}
        <CTableBody>
          {filteredVendors.map((vendor, index) => (
            <CTableRow key={vendor.vendor_id}>
              <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
              <CTableDataCell>{vendor.vendor_name}</CTableDataCell>
              <CTableDataCell>{vendor.vendor_email}</CTableDataCell>
              <CTableDataCell>{vendor.vendor_mobile}</CTableDataCell>
              <CTableDataCell>{vendor.vendor_address}</CTableDataCell>
              <CTableDataCell>{vendor.vendor_business_name}</CTableDataCell>
              <CTableDataCell
                className={
                  vendor.vendor_status === 'active' ? 'text-success fw-bold' : 'text-danger fw-bold'
                }
              >
                {vendor.vendor_status}
              </CTableDataCell>
              <CTableDataCell>
                ₹{parseFloat(vendor.today_sales_amount || 0).toFixed(2)}
              </CTableDataCell>

              <CTableDataCell className="flex gap-2">
                <CButton
                  color="primary"
                  size="sm"
                  onClick={() => navigate(`/Employee-list/${vendor.vendor_id}`)}
                >
                  View Employee
                </CButton>
                <CButton
                  color="info"
                  size="sm"
                  onClick={() => navigate(`/Customer-list/${vendor.vendor_id}`)}
                >
                  View Customer
                </CButton>
                <CButton
                  color="secondary"
                  size="sm"
                  onClick={() => navigate(`/Product-list/${vendor.vendor_id}`)}
                >
                  View Products
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

export default VendorList
