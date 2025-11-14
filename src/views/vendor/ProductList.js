import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import api from '../../services/useApi'

function VendorProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [vendorData, setVendorData] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    setVendorData(userData)

    if (userData?.id) {
      fetchProducts()
    }
  }, [])

  const fetchProducts = async () => {
    try {
      // Backend route: GET /productByVendor (uses token to get vendor ID)
      const response = await api.get('/productByVendor')
      setProducts(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch products:', error.message)
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
        My Products - {vendorData?.name}
      </h3>

      <CTable bordered hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Price Per Unit</CTableHeaderCell>
            <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {products.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={5} className="text-center">
                No products found
              </CTableDataCell>
            </CTableRow>
          ) : (
            products.map((product, index) => (
              <CTableRow key={product?.product_id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{product?.product_name}</CTableDataCell>
                <CTableDataCell>₹{product?.product_price_per_unit}</CTableDataCell>
                <CTableDataCell>{product?.product_unit}</CTableDataCell>
                <CTableDataCell>
                  <span
                    className={
                      product?.product_status === 'active'
                        ? 'text-success fw-bold'
                        : 'text-danger fw-bold'
                    }
                  >
                    {product?.product_status}
                  </span>
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default VendorProductList
