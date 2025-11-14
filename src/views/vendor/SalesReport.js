import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CButton,
  CFormSelect,
  CBadge,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilCloudDownload, cilFilter } from '@coreui/icons'
import api from '../../services/useApi'

const VendorSalesReport = () => {
  const [sales, setSales] = useState([])
  const [productSummary, setProductSummary] = useState([])
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0)
  const [grandTotalMonthlyExpense, setGrandTotalMonthlyExpense] = useState(0)
  const [loading, setLoading] = useState(false) // Changed to false initially
  const [loadingDropdowns, setLoadingDropdowns] = useState(true) // New state for dropdowns
  const [vendorData, setVendorData] = useState(null)
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  // Filters
  const [filters, setFilters] = useState({
    customerId: '',
    productId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  // ✅ Add this to get URL parameters
  const [searchParams] = useSearchParams()
  const customerIdFromUrl = searchParams.get('customerId')

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    console.log('Vendor data:', userData)
    console.log('Customer ID from URL:', customerIdFromUrl)
    setVendorData(userData)

    if (userData?.id) {
      loadDropdownData(userData.id)
    }
  }, [])

  // ✅ Add second useEffect to handle auto-selection and auto-fetch
  useEffect(() => {
    // Only run when customers are loaded and URL has customerId
    if (customers.length > 0 && customerIdFromUrl && vendorData?.id) {
      console.log('Auto-selecting customer:', customerIdFromUrl)

      // Set the customer in filters
      setFilters(prev => ({
        ...prev,
        customerId: customerIdFromUrl
      }))

      // Auto-fetch report after 500ms delay
      setTimeout(() => {
        autoFetchReport(customerIdFromUrl, vendorData.id)
      }, 500)
    }
  }, [customers, customerIdFromUrl, vendorData]) // Run when customers load

  // ✅ Add this new function for auto-fetching
  const autoFetchReport = async (customerId, vendorId) => {
    try {
      setLoading(true)
      setError('')

      const requestData = {
        vendorId: vendorId,
        customerId: parseInt(customerId),
        month: filters.month,
        year: filters.year,
      }

      console.log('Auto-fetching sales with:', requestData)

      const response = await api.post('/sales/customer-monthly', requestData)
      console.log('Sales response:', response.data)

      if (response.data.statusCode === 200) {
        setSales(response.data.sales || [])
        setTotalMonthlyExpenses(response.data.totalMonthlyExpenses || 0)
        setGrandTotalMonthlyExpense(response.data.grandTotalMonthlyExpense || 0)
      } else if (response.data.statusCode === 404) {
        setSales([])
        setError('No sales found for this customer in the selected month')
      }

      // Fetch product summary
      try {
        const summaryResponse = await api.post('/sales/product-summary', {
          vendorId: vendorId,
          customerId: parseInt(customerId),
          month: filters.month,
          year: filters.year
        })

        if (summaryResponse.data.statusCode === 200) {
          setProductSummary(summaryResponse.data.salesSummary || [])
        }
      } catch (summaryError) {
        setProductSummary([])
      }

    } catch (error) {
      console.error('Failed to auto-fetch sales:', error)
      setError(error.response?.data?.message || 'Failed to fetch sales data')
      setSales([])
    } finally {
      setLoading(false)
    }
  }

  const loadDropdownData = async (vendorId) => {
    try {
      setLoadingDropdowns(true)
      await Promise.all([
        fetchCustomers(vendorId),
        fetchProducts(vendorId)
      ])
    } catch (error) {
      console.error('Error loading dropdown data:', error)
    } finally {
      setLoadingDropdowns(false)
    }
  }

  const fetchCustomers = async (vendorId) => {
    try {
      const response = await api.get(`/vendors/${vendorId}/customers`)
      console.log('Customers response:', response.data)

      if (response.data.statusCode === 200) {
        setCustomers(response.data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
      setError('Failed to load customers')
    }
  }

  const fetchProducts = async (vendorId) => {
    try {
      const response = await api.get('/productByVendor')
      console.log('Products response:', response.data)

      if (response.data.statusCode === 200) {
        // Map the response to match expected format
        const productsData = response.data.data.map(product => ({
          id: product.product_id,
          name: product.product_name,
          unit: product.product_unit,
          price: product.product_price,
          status: product.product_status
        }))
        setProducts(productsData)
        console.log('Products loaded:', productsData.length)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
    }
  }


  const fetchSalesReport = async () => {
    if (!filters.customerId) {
      setError('Please select a customer')
      return
    }

    if (!vendorData?.id) {
      setError('Vendor data not found')
      return
    }

    try {
      setLoading(true)
      setError('')

      const requestData = {
        vendorId: vendorData.id,
        customerId: parseInt(filters.customerId),
        month: parseInt(filters.month),
        year: parseInt(filters.year),
      }

      if (filters.productId) {
        requestData.productId = parseInt(filters.productId)
      }

      console.log('Fetching sales with:', requestData)

      const response = await api.post('/sales/customer-monthly', requestData)
      console.log('Sales response:', response.data)

      if (response.data.statusCode === 200) {
        setSales(response.data.sales || [])
        setTotalMonthlyExpenses(response.data.totalMonthlyExpenses || 0)
        setGrandTotalMonthlyExpense(response.data.grandTotalMonthlyExpense || 0)
      } else if (response.data.statusCode === 404) {
        setSales([])
        setTotalMonthlyExpenses(0)
        setGrandTotalMonthlyExpense(0)
        setError('No sales found for the selected period')
      }

      // Fetch product summary
      try {
        const summaryResponse = await api.post('/sales/product-summary', {
          vendorId: vendorData.id,
          customerId: parseInt(filters.customerId),
          month: parseInt(filters.month),
          year: parseInt(filters.year)
        })

        console.log('Summary response:', summaryResponse.data)

        if (summaryResponse.data.statusCode === 200) {
          setProductSummary(summaryResponse.data.salesSummary || [])
        }
      } catch (summaryError) {
        console.log('No product summary available')
        setProductSummary([])
      }

    } catch (error) {
      console.error('Failed to fetch sales:', error)
      setError(error.response?.data?.message || 'Failed to fetch sales data')
      setSales([])
      setProductSummary([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const applyFilters = () => {
    fetchSalesReport()
  }

  const exportToCSV = () => {
    if (sales.length === 0) return

    const headers = ['Date', 'Customer', 'Product', 'Quantity', 'Price/Unit', 'Total', 'Invoice']
    const csvData = sales.map(sale => [
      sale.formatted_date,
      sale.customer_name,
      sale.product_name,
      `${sale.quantity} ${sale.product_unit}`,
      sale.price_per_unit,
      sale.total_amount,
      sale.invoice_generated ? 'Yes' : 'No'
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-report-${filters.month}-${filters.year}.csv`
    a.click()
  }

  const selectedCustomer = customers.find(c => c.id == filters.customerId)

  if (loadingDropdowns) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
        <p className="mt-2">Loading...</p>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <CRow className="mb-4">
        <CCol>
          <h2>Sales Report</h2>
          <p className="text-medium-emphasis">
            View detailed sales data - {vendorData?.name}
          </p>
        </CCol>
      </CRow>

      {/* Error Alert */}
      {error && (
        <CRow className="mb-3">
          <CCol>
            <CAlert color="danger" dismissible onClose={() => setError('')}>
              {error}
            </CAlert>
          </CCol>
        </CRow>
      )}

      {/* Filters */}
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <CIcon icon={cilFilter} className="me-2" />
              <strong>Filters</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol md={3}>
                  <label className="form-label small fw-semibold">Customer *</label>
                  <CFormSelect
                    name="customerId"
                    value={filters.customerId}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.mobile}
                      </option>
                    ))}
                  </CFormSelect>
                  <small className="text-muted">
                    {customers.length} customers available
                  </small>
                </CCol>

                <CCol md={2}>
                  <label className="form-label small fw-semibold">Month</label>
                  <CFormSelect
                    name="month"
                    value={filters.month}
                    onChange={handleFilterChange}
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={2}>
                  <label className="form-label small fw-semibold">Year</label>
                  <CFormSelect
                    name="year"
                    value={filters.year}
                    onChange={handleFilterChange}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={3}>
                  <label className="form-label small fw-semibold">Product (Optional)</label>
                  <CFormSelect
                    name="productId"
                    value={filters.productId}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Products</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </CFormSelect>
                  <small className="text-muted">
                    {products.length} products available
                  </small>
                </CCol>

                <CCol md={2} className="d-flex align-items-end">
                  <CButton
                    color="primary"
                    onClick={applyFilters}
                    disabled={loading || !filters.customerId}
                    className="w-100"
                  >
                    {loading ? (
                      <>
                        <CSpinner size="sm" className="me-1" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilCalendar} className="me-1" />
                        View Report
                      </>
                    )}
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Summary Cards - Only show after report is loaded */}
      {sales.length > 0 && (
        <>
          <CRow className="mb-4">
            <CCol sm={6} lg={4}>
              <CCard className="text-white bg-primary">
                <CCardBody>
                  <div className="fs-4 fw-semibold">
                    ₹{grandTotalMonthlyExpense?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-uppercase text-white-50 small">Total Monthly Sales</div>
                  <small className="text-white-75">All products</small>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol sm={6} lg={4}>
              <CCard className="text-white bg-info">
                <CCardBody>
                  <div className="fs-4 fw-semibold">
                    {sales.length}
                  </div>
                  <div className="text-uppercase text-white-50 small">Total Transactions</div>
                  <small className="text-white-75">
                    {selectedCustomer?.name || 'Customer'}
                  </small>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol sm={6} lg={4}>
              <CCard className="text-white bg-warning">
                <CCardBody>
                  <div className="fs-4 fw-semibold">
                    ₹{totalMonthlyExpenses?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-uppercase text-white-50 small">Selected Filter Total</div>
                  <small className="text-white-75">
                    {filters.productId ? 'Filtered product' : 'All products'}
                  </small>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Product Summary */}
          {productSummary.length > 0 && (
            <CRow className="mb-4">
              <CCol>
                <CCard>
                  <CCardHeader>
                    <strong>Product Summary</strong>
                  </CCardHeader>
                  <CCardBody>
                    <CTable hover responsive striped>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Product</CTableHeaderCell>
                          <CTableHeaderCell>Total Quantity</CTableHeaderCell>
                          <CTableHeaderCell>Total Sales</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {productSummary.map((item, index) => (
                          <CTableRow key={item.product_id}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>{item.product_name}</CTableDataCell>
                            <CTableDataCell>
                              {item.total_quantity_sold} {item.product_unit}(s)
                            </CTableDataCell>
                            <CTableDataCell className="fw-semibold">
                              ₹{parseFloat(item.total_sales_amount).toFixed(2)}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </>
      )}

      {/* Sales Table */}
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Sales Details</strong>
                  {sales.length > 0 && (
                    <span className="text-medium-emphasis ms-2">
                      ({sales.length} transactions)
                    </span>
                  )}
                </div>
                {sales.length > 0 && (
                  <CButton color="success" size="sm" variant="outline" onClick={exportToCSV}>
                    <CIcon icon={cilCloudDownload} className="me-1" />
                    Export CSV
                  </CButton>
                )}
              </div>
            </CCardHeader>
            <CCardBody>
              {sales.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-medium-emphasis mb-0">
                    {filters.customerId
                      ? 'No sales found for the selected period. Try changing the month/year or product filter.'
                      : 'Select a customer and click "View Report" to see sales data'
                    }
                  </p>
                </div>
              ) : (
                <CTable hover responsive striped bordered>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Price/Unit</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Invoice</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {sales.map((sale, index) => (
                      <CTableRow key={sale.sale_id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{sale.formatted_date}</CTableDataCell>
                        <CTableDataCell>{sale.product_name}</CTableDataCell>
                        <CTableDataCell>
                          {sale.quantity} {sale.product_unit}(s)
                        </CTableDataCell>
                        <CTableDataCell>₹{parseFloat(sale.price_per_unit).toFixed(2)}</CTableDataCell>
                        <CTableDataCell className="fw-semibold">
                          ₹{parseFloat(sale.total_amount).toFixed(2)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={sale.invoice_generated ? 'success' : 'secondary'}>
                            {sale.invoice_generated ? 'Generated' : 'Pending'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default VendorSalesReport
