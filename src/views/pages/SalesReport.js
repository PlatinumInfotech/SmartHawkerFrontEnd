import React, { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import {
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CSpinner,
} from '@coreui/react'

import api from '../../services/useApi'

function SalesReport() {
  const { vendorId, customerId } = useParams()
  const location = useLocation()
  const customerName = location.state?.customerName

  const [sales, setSales] = useState([])
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [datewiseSales, setDatewiseSales] = useState([])
  const [datewiseError, setDatewiseError] = useState(null)

  const [expandedItems, setExpandedItems] = useState({})
  const [detailedSales, setDetailedSales] = useState({})

  const [datewiseLoading, setDatewiseLoading] = useState(false)

  const fetchDatewiseReport = async () => {
    if (!startDate || !endDate) {
      setDatewiseError('Please select both start and end date')
      return
    }

    setDatewiseLoading(true)
    setDatewiseError(null)
    setDatewiseSales([])

    try {
      const response = await api.post('/api/admin/customer/sales-report/datewise', {
        vendorId,
        customerId,
        startDate,
        endDate,
      })
      setDatewiseSales(response.data.summary)
      setTotalExpenses(
        response.data.summary.reduce(
          (sum, item) => sum + parseFloat(item.total_sales_amount),
          0,
        ),
      )
    } catch (err) {
      console.error(err)
      setDatewiseError('Failed to fetch date-wise data')
    } finally {
      setDatewiseLoading(false)
    }
  }

  const toggleAccordion = async (productId, index) => {
    const isOpen = expandedItems[index]
    setExpandedItems((prev) => ({ ...prev, [index]: !isOpen }))
    if (!isOpen && !detailedSales[productId]) {
      try {
        const response = await api.post('/api/admin/customer/sales-report/date', {
          vendorId,
          customerId,
          productId,
          startDate,
          endDate,
        })
        setDetailedSales((prev) => ({
          ...prev,
          [productId]: response.data.sales || [],
        }))
      } catch (err) {
        console.error(`Failed to fetch details for product ${productId}`, err)
      }
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-black mb-6">
        Sales Report of {customerName}
      </h2>

      {/* ----- Date-wise Section ----- */}
      <div className="border-t border-gray-300 pt-6 mt-6">
        <h3 className="text-xl font-bold text-black mb-4"></h3>

        {/* Start Date + End Date + Button in Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '1rem',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          {/* Start Date */}
          <div style={{ width: '220px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.3rem',
                fontWeight: 'bold',
                color: '#374151',
              }}
            >
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                fontWeight: 'bold',
                backgroundColor: 'white',
                color: 'black',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* End Date */}
          <div style={{ width: '220px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.3rem',
                fontWeight: 'bold',
                color: '#374151',
              }}
            >
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '100%',
                fontWeight: 'bold',
                backgroundColor: 'white',
                color: 'black',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* Button */}
          <div>
            <CButton
              color="info"
              className="text-white"
              onClick={fetchDatewiseReport}
              disabled={datewiseLoading}
              style={{
                whiteSpace: 'nowrap',
                height: '42px',
                marginTop: '1.5rem',
              }}
            >
              {datewiseLoading ? (
                <CSpinner size="sm" color="light" />
              ) : (
                'Generate Report'
              )}
            </CButton>
          </div>
        </div>
      </div>

      {/* ----- Spinner & Errors ----- */}
      {loading && (
        <div className="text-center text-white">
          <CSpinner color="light" />
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {datewiseError && (
        <p className="text-red-500 text-center">{datewiseError}</p>
      )}

      {/* ----- Accordion Summary Section ----- */}
      {!loading && !error && datewiseSales?.length > 0 && (
        <CAccordion>
          {datewiseSales.map((item, index) => (
            <CAccordionItem key={index} itemKey={index}>
              <CAccordionHeader
                onClick={() => toggleAccordion(item.product_id, index)}
              >
                <div className="flex justify-between w-full px-4">
                  <div className="font-bold">{item?.product_name}</div>
                  <div>
                    {item?.total_quantity_sold} {item?.product_unit}
                  </div>
                  <div>₹{item?.total_sales_amount}</div>
                </div>
              </CAccordionHeader>
              <CAccordionBody>
                {detailedSales[item.product_id] ? (
                  <CTable hover responsive>
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Date</CTableHeaderCell>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Quantity</CTableHeaderCell>
                        <CTableHeaderCell>Price/Unit</CTableHeaderCell>
                        <CTableHeaderCell>Total</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {detailedSales[item.product_id].map((entry, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{idx + 1}</CTableDataCell>
                          <CTableDataCell>{entry?.formatted_date}</CTableDataCell>
                          <CTableDataCell>{entry?.product_name}</CTableDataCell>
                          <CTableDataCell>{entry?.quantity}</CTableDataCell>
                          <CTableDataCell>₹{entry?.price_per_unit}</CTableDataCell>
                          <CTableDataCell>₹{entry?.total_amount}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <div className="text-center text-muted">Loading...</div>
                )}
              </CAccordionBody>
            </CAccordionItem>
          ))}
          <CAccordionItem itemKey="total">
            <CAccordionHeader>
              <div className="w-full text-right font-bold text-lg">
                Total Spent: ₹{totalExpenses}
              </div>
            </CAccordionHeader>
          </CAccordionItem>
        </CAccordion>
      )}
    </div>
  )
}

export default SalesReport
