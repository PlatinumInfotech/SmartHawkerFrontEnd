import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CCard,
  CCardBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilPeople, cilBasket, cilDollar, cilStar } from '@coreui/icons'
import api from '../../services/useApi'

const VendorWidgetsDropdown = (props) => {
  const [data, setData] = useState({
    customersCount: 0,
    activeProducts: 0,
    yesterdaySales: 0,
    highestProduct: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendorData()
  }, [])

  const fetchVendorData = async () => {
    try {
      const [customersRes, productsRes, salesRes, highestProductRes] = await Promise.all([
        api.get('/customers/count'),
        api.get('/active-products/count'),
        api.get('/sales/yesterday'),
        api.get('/sales/highest-product'),
      ])

      console.log('Customers:', customersRes.data)
      console.log('Products:', productsRes.data)
      console.log('Sales:', salesRes.data)
      console.log('Highest Product:', highestProductRes.data)

      setData({
        customersCount: customersRes.data.data.customerCount || 0,
        activeProducts: productsRes.data.data.active_product_count || 0,
        yesterdaySales: salesRes.data.data.totalSales || 0,
        highestProduct: highestProductRes.data.data || null,
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching vendor dashboard data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <CRow className={props.className}>
        <CCol>
          <div className="text-center">Loading dashboard data...</div>
        </CCol>
      </CRow>
    )
  }

  const cardStyle = {
    minHeight: '160px',
  }

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      {/* Card 1: Total Customers */}
      <CCol sm={6} xl={4} xxl={3}>
        <CCard className="text-white bg-primary" style={cardStyle}>
          <CCardBody>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-center">
                <CIcon icon={cilPeople} size="lg" className="me-2" />
                <div className="text-white-50 small text-uppercase">Total Customers</div>
              </div>
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                  <CIcon icon={cilOptions} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem href="/#/vendor/customers">View Customers</CDropdownItem>
                  <CDropdownItem>Add Customer</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
            <div className="fs-2 fw-semibold mb-2">
              {data.customersCount}
            </div>
            <div className="text-white-75 small">Active customers</div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Card 2: Active Products */}
      <CCol sm={6} xl={4} xxl={3}>
        <CCard className="text-white bg-info" style={cardStyle}>
          <CCardBody>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-center">
                <CIcon icon={cilBasket} size="lg" className="me-2" />
                <div className="text-white-50 small text-uppercase">Active Products</div>
              </div>
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                  <CIcon icon={cilOptions} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem href="/#/vendor/products">View Products</CDropdownItem>
                  <CDropdownItem>Add Product</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
            <div className="fs-2 fw-semibold mb-2">
              {data.activeProducts}
            </div>
            <div className="text-white-75 small">Products in catalog</div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Card 3: Yesterday's Sales */}
      <CCol sm={6} xl={4} xxl={3}>
        <CCard className="text-white bg-warning" style={cardStyle}>
          <CCardBody>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-center">
                <CIcon icon={cilDollar} size="lg" className="me-2" />
                <div className="text-white-50 small text-uppercase">Yesterday's Sales</div>
              </div>
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                  <CIcon icon={cilOptions} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem href="/#/vendor/sales">View Sales Report</CDropdownItem>
                  <CDropdownItem>Download Report</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
            <div className="fs-2 fw-semibold mb-2">
              ₹{parseFloat(data.yesterdaySales).toFixed(2)}
            </div>
            <div className="text-white-75 small">Total revenue</div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Card 4: Top Selling Product */}
      <CCol sm={6} xl={4} xxl={3}>
        <CCard className="text-white bg-danger" style={cardStyle}>
          <CCardBody>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-center">
                <CIcon icon={cilStar} size="lg" className="me-2" />
                <div className="text-white-50 small text-uppercase">Top Product</div>
              </div>
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                  <CIcon icon={cilOptions} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>View Details</CDropdownItem>
                  <CDropdownItem href="/#/vendor/products">View All Products</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
            <div className="fs-5 fw-semibold mb-2 text-truncate" title={data.highestProduct?.product_name || 'N/A'}>
              {data.highestProduct?.product_name || 'No sales yet'}
            </div>
            <div className="text-white-75 small">
              {data.highestProduct
                ? `${data.highestProduct.totalQuantitySold || 0} units sold yesterday`
                : 'Start selling today'
              }
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

VendorWidgetsDropdown.propTypes = {
  className: PropTypes.string,
}

export default VendorWidgetsDropdown
