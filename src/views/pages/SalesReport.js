import React, { useState } from 'react'
import axios from 'axios'
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
  CFormSelect,
  CButton,
  CSpinner,
} from '@coreui/react'

function SalesReport() {
  const { vendorId, customerId } = useParams()
  const location = useLocation()
  const customerName = location.state?.customerName

  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
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

  const [monthlyLoading, setMonthlyLoading] = useState(false)
  const [datewiseLoading, setDatewiseLoading] = useState(false)

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const years = Array.from({ length: 10 }, (_, i) => 2020 + i)

  const fetchSalesReport = async () => {
    if (!month || !year) {
      setError('Please select both month and year')
      return
    }

    setMonthlyLoading(true)
    setError(null)
    setSales([])

    try {
      const response = await axios.post(
        'http://localhost:3000/api/admin/customer/sales/product-summary',
        { vendorId, customerId, month, year },
      )
      const summary = response.data.summary
      setSales(summary)
      setTotalExpenses(summary.reduce((sum, item) => sum + parseFloat(item.total_sales_amount), 0))
    } catch (err) {
      console.error(err)
      setError('Failed to fetch data')
    } finally {
      setMonthlyLoading(false)
    }
  }

  const fetchDatewiseReport = async () => {
    if (!startDate || !endDate) {
      setDatewiseError('Please select both start and end date')
      return
    }

    setDatewiseLoading(true)
    setDatewiseError(null)
    setDatewiseSales([])

    try {
      const response = await axios.post(
        'http://localhost:3000/api/admin/customer/sales-report/datewise',
        { vendorId, customerId, startDate, endDate },
      )
      setDatewiseSales(response.data.summary)
      setTotalExpenses(
        response.data.summary.reduce((sum, item) => sum + parseFloat(item.total_sales_amount), 0),
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
        const response = await axios.post(
          'http://localhost:3000/api/admin/customer/sales-report/date',
          { vendorId, customerId, productId, startDate, endDate },
        )
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
      <h2 className="text-3xl font-bold text-white mb-6">Sales Report of {customerName}</h2>

      <div className="flex gap-4 mb-4">
        <CFormSelect
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-1/3 font-bold bg-white text-black"
        >
          <option value="">Month</option>
          {months.map((m, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {m}
            </option>
          ))}
        </CFormSelect>

        <CFormSelect
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-1/3 font-bold bg-white text-black"
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </CFormSelect>
      </div>

      <div className="text-center mb-5">
        <CButton color="success" onClick={fetchSalesReport} disabled={monthlyLoading}>
          {monthlyLoading ? <CSpinner size="sm" color="light" /> : 'Generate Report'}
        </CButton>
      </div>

      {/* ----- Date-wise Section ----- */}
      <div className="border-t border-gray-300 pt-6 mt-6">
        <h3 className="text-xl font-bold text-white mb-4">Or Get Report by Date Range</h3>

        <div className="flex justify-between gap-4 mb-4 w-full">
          {/* Start Date */}
          <div className="relative w-1/2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              className="w-full font-bold bg-white text-black px-4 py-2 rounded cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              onFocus={(e) => e.target.showPicker && e.target.showPicker()}
            />
            {!startDate && (
              <div className="absolute left-4 top-2 text-gray-500 pointer-events-none">
                Start Date
              </div>
            )}
          </div>

          {/* End Date */}
          <div className="relative w-1/2">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              className="w-full font-bold bg-white text-black px-4 py-2 rounded cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              onFocus={(e) => e.target.showPicker && e.target.showPicker()}
            />
            {!endDate && (
              <div className="absolute left-4 top-2 text-gray-500 pointer-events-none">
                End Date
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-5">
          <CButton color="info" onClick={fetchDatewiseReport} disabled={datewiseLoading}>
            {datewiseLoading ? <CSpinner size="sm" color="light" /> : 'Generate Date-wise Report'}
          </CButton>
        </div>

        {/* {datewiseError && <p className="text-red-500 text-center">{datewiseError}</p>}

        {datewiseSales.length > 0 && (
          <CTable hover responsive bordered>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Product</CTableHeaderCell>
                <CTableHeaderCell>Quantity</CTableHeaderCell>
                <CTableHeaderCell>Price/Unit</CTableHeaderCell>
                <CTableHeaderCell>Total</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {datewiseSales.map((item, idx) => (
                <CTableRow key={idx}>
                  <CTableDataCell>{idx + 1}</CTableDataCell>
                  <CTableDataCell>{item?.formatted_date}</CTableDataCell>
                  <CTableDataCell>{item?.product_name}</CTableDataCell>
                  <CTableDataCell>{item?.total_quantity_sold}</CTableDataCell>
                  <CTableDataCell>₹{item?.product_unit}</CTableDataCell>
                  <CTableDataCell>₹{item?.total_sales_amount}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )} */}
      </div>

      {/* ----- Spinner & Errors ----- */}
      {loading && (
        <div className="text-center text-white">
          <CSpinner color="light" />
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* ----- Accordion Summary Section ----- */}
      {!loading && !error && datewiseSales?.length > 0 && (
        <CAccordion>
          {datewiseSales.map((item, index) => (
            <CAccordionItem key={index} itemKey={index}>
              <CAccordionHeader onClick={() => toggleAccordion(item.product_id, index)}>
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
                Total Monthly Spent: ₹{totalExpenses}
              </div>
            </CAccordionHeader>
          </CAccordionItem>
        </CAccordion>
      )}
    </div>
  )
}

export default SalesReport
