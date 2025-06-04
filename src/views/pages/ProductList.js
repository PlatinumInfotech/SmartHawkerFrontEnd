import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'
import { AppHeader, AppSidebar } from '../../components'
import DefaultLayout from '../../layout/DefaultLayout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ProductList() {
  const [products, setProducts] = useState([])
  const { vendorId } = useParams()

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/admin/product-list/${vendorId}`)
      .then((response) => {
        console.log(response.data.data, 'Hello')
        setProducts(response.data.data)
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
              <CTableHeaderCell scope="col">Price Per Unit</CTableHeaderCell>
              <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {products.map((products, index) => (
              <CTableRow key={products?.products_id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{products?.product_name}</CTableDataCell>
                <CTableDataCell>{products?.product_price_per_unit}</CTableDataCell>
                <CTableDataCell>{products?.product_unit}</CTableDataCell>

                <CTableDataCell className="flex gap-2"></CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </>
  )
}
export default ProductList
