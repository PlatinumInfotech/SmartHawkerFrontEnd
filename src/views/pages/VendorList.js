import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CTooltip,
} from '@coreui/react'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/useApi'

// ✅ Import icons from react-icons
import { FaUsers, FaUser, FaBox } from 'react-icons/fa'

function VendorList() {
  const [vendors, setVendors] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    status: 'active', // ✅ Default Active
  })
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get('/api/admin/vendor-list')
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
    const searchLower = filters.search.toLowerCase()
    return (
      (vendor.vendor_name?.toLowerCase().includes(searchLower) ||
        vendor.vendor_email?.toLowerCase().includes(searchLower) ||
        vendor.vendor_mobile?.includes(searchLower)) &&
      (filters.status === '' ||
        vendor.vendor_status.toLowerCase() === filters.status)
    )
  })

  return (
    <>
      <CTable>
        {/* 🔎 Filter Row */}
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell colSpan={9}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '8px 0',
                }}
              >
                {/* Search Input */}
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="🔍 Search by name, email or mobile"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    fontSize: '1rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                  }}
                />

                {/* Status Dropdown */}
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  style={{
                    minWidth: '180px',
                    padding: '10px 14px',
                    fontSize: '1rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    color: filters.status === '' ? '#6c757d' : 'inherit',
                  }}
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </CTableHeaderCell>
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
            <CTableHeaderCell scope="col" style={{ paddingLeft: '30px' }}>
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        {/* Table Body */}
        <CTableBody>
          {filteredVendors.map((vendor, index) => (
            <CTableRow key={vendor.vendor_id} style={{ fontSize: '0.9rem' }}>
              <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
              <CTableDataCell>{vendor.vendor_name}</CTableDataCell>
              <CTableDataCell>{vendor.vendor_email}</CTableDataCell>
              <CTableDataCell>{vendor.vendor_mobile}</CTableDataCell>
              <CTableDataCell>{vendor.vendor_address}</CTableDataCell>
              <CTableDataCell>{vendor.vendor_business_name}</CTableDataCell>
              <CTableDataCell
                className={
                  vendor.vendor_status === 'active'
                    ? 'text-success fw-bold'
                    : 'text-danger fw-bold'
                }
              >
                {vendor.vendor_status}
              </CTableDataCell>
              <CTableDataCell>
                ₹{parseFloat(vendor.today_sales_amount || 0).toFixed(2)}
              </CTableDataCell>

              {/* ✅ Action Buttons with Tooltips */}
              <CTableDataCell>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <CTooltip content="Employees" placement="top">
                    <CButton
                      color="transparent"
                      size="sm"
                      style={{
                        padding: '6px',
                        minWidth: 'auto',
                        border: 'none',
                      }}
                      onClick={() =>
                        navigate(`/Employee-list/${vendor.vendor_id}`, {
                          state: { businessName: vendor.vendor_business_name },
                        })
                      }
                    >
                      <FaUsers size={16} color="black" />
                    </CButton>
                  </CTooltip>

                  <CTooltip content="Customers" placement="top">
                    <CButton
                      color="transparent"
                      size="sm"
                      style={{
                        padding: '6px',
                        minWidth: 'auto',
                        border: 'none',
                      }}
                      onClick={() =>
                        navigate(`/Customer-list/${vendor.vendor_id}`, {
                          state: { businessName: vendor.vendor_business_name },
                        })
                      }
                    >
                      <FaUser size={15} color="black" />
                    </CButton>
                  </CTooltip>

                  <CTooltip content="Products" placement="top">
                    <CButton
                      color="transparent"
                      size="sm"
                      style={{
                        padding: '6px',
                        minWidth: 'auto',
                        border: 'none',
                      }}
                      onClick={() =>
                        navigate(`/Product-list/${vendor.vendor_id}`, {
                          state: { businessName: vendor.vendor_business_name },
                        })
                      }
                    >
                      <FaBox size={15} color="black" />
                    </CButton>
                  </CTooltip>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

export default VendorList
