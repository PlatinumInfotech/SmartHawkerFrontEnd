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

function ProductList() {
  const [products, setProducts] = useState([])
  const { vendorId } = useParams()
  const location = useLocation()

  // ✅ Business name from state
  const businessName = location.state?.businessName || 'Business Name'

  useEffect(() => {
    api
      .get(`/admin/product-list/${vendorId}`)
      .then((response) => {
        console.log(response.data.data, 'Hello')
        setProducts(response.data.data)
      })
      .catch((error) => {
        console.error(error.message)
      })
  }, [vendorId])

  return (
    <>
      <div style={{ padding: '20px' }}>
        {/* ✅ Business Name Heading */}
        <h3 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
          Product List - {businessName}
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
            {products.map((product, index) => (
              <CTableRow key={product?.products_id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{product?.product_name}</CTableDataCell>
                <CTableDataCell>{product?.product_price_per_unit}</CTableDataCell>
                <CTableDataCell>{product?.product_unit}</CTableDataCell>
                <CTableDataCell>{product?.product_status}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </>
  )
}
export default ProductList
