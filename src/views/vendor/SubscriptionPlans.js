import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CSpinner,
  CBadge,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilClock, cilStar } from '@coreui/icons'
import api from '../../services/useApi'

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activePlan, setActivePlan] = useState(null)

  useEffect(() => {
    fetchSubscriptionPlans()
  }, [])

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/subscription-plans')

      console.log('Subscription plans response:', response.data)

      if (response.data.statusCode === 200) {
        setPlans(response.data.data || [])

        // Find active plan and store it separately
        const active = response.data.data.find(plan => plan.is_active_for_vendor)
        if (active) {
          setActivePlan({
            ...active,
            expiresOn: active.days_left > 0
              ? new Date(Date.now() + (active.days_left * 24 * 60 * 60 * 1000))
              : null
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error)
      setError('Failed to load subscription plans')
    } finally {
      setLoading(false)
    }
  }


  const handleSubscribe = async (planId) => {
    // TODO: Integrate Razorpay payment
    alert(`Subscribing to plan ${planId}. Payment integration coming soon!`)
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
        <p className="mt-2">Loading subscription plans...</p>
      </div>
    )
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <h2>Subscription Plans</h2>
          <p className="text-medium-emphasis">
            Choose the perfect plan for your business
          </p>
        </CCol>
      </CRow>

      {error && (
        <CRow className="mb-3">
          <CCol>
            <CAlert color="danger" dismissible onClose={() => setError('')}>
              {error}
            </CAlert>
          </CCol>
        </CRow>
      )}

      {/* Active Plan Banner */}
      {activePlan && (
        <CRow className="mb-4">
          <CCol>
            <CAlert color="success">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    Active Plan: {activePlan.name}
                  </h5>
                  <p className="mb-0">
                    {activePlan.days_left > 0 ? (
                      <>
                        <CIcon icon={cilClock} className="me-1" />
                        {activePlan.days_left} days remaining
                      </>
                    ) : (
                      <span className="text-danger">
                        <CIcon icon={cilClock} className="me-1" />
                        Expired
                      </span>
                    )}
                  </p>
                </div>
                {activePlan.days_left < 15 && activePlan.days_left > 0 && (
                  <CBadge color="warning" className="px-3 py-2">
                    Expiring Soon!
                  </CBadge>
                )}
              </div>
            </CAlert>
          </CCol>
        </CRow>
      )}

      {/* Subscription Plans */}
      <CRow>
        {plans.map((plan) => {
          const isActive = plan.is_active_for_vendor
          const isExpired = isActive && plan.days_left <= 0
          const isExpiringSoon = isActive && plan.days_left > 0 && plan.days_left < 15

          return (
            <CCol key={plan.id} md={6} lg={4} className="mb-4">
              <CCard
                className={`h-100 ${isActive && !isExpired ? 'border-success border-2' : ''}`}
              >
                <CCardHeader className="text-center">
                  {isActive && !isExpired && (
                    <CBadge color="success" className="position-absolute top-0 end-0 m-2">
                      <CIcon icon={cilCheckCircle} className="me-1" />
                      Active
                    </CBadge>
                  )}
                  {isExpired && (
                    <CBadge color="danger" className="position-absolute top-0 end-0 m-2">
                      Expired
                    </CBadge>
                  )}
                  {isExpiringSoon && (
                    <CBadge color="warning" className="position-absolute top-0 end-0 m-2">
                      Expiring Soon
                    </CBadge>
                  )}

                  <h4 className="mb-0 mt-3">{plan.name}</h4>
                  <div className="text-muted small">{plan.description}</div>
                </CCardHeader>

                <CCardBody className="text-center">
                  <div className="mb-4">
                    <div className="display-4 fw-bold text-primary">
                      {plan.price === 0 ? (
                        'Free'
                      ) : (
                        `₹${plan.price.toLocaleString()}`
                      )}
                    </div>
                    <div className="text-muted mt-2">
                      <strong>Valid for {plan.duration_in_days} days</strong>
                      {plan.duration_in_days >= 365 && (
                        <span className="text-success ms-2">
                          (~{Math.floor(plan.duration_in_days / 365)} year{Math.floor(plan.duration_in_days / 365) > 1 ? 's' : ''})
                        </span>
                      )}
                      {plan.duration_in_days < 365 && plan.duration_in_days >= 30 && (
                        <span className="text-success ms-2">
                          (~{Math.floor(plan.duration_in_days / 30)} month{Math.floor(plan.duration_in_days / 30) > 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                  </div>


                  {/* Plan Features */}
                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2">
                      <CIcon icon={cilCheckCircle} className="text-success me-2" />
                      Unlimited customers
                    </li>
                    <li className="mb-2">
                      <CIcon icon={cilCheckCircle} className="text-success me-2" />
                      Unlimited products
                    </li>
                    <li className="mb-2">
                      <CIcon icon={cilCheckCircle} className="text-success me-2" />
                      Sales reports & analytics
                    </li>
                    <li className="mb-2">
                      <CIcon icon={cilCheckCircle} className="text-success me-2" />
                      Customer management
                    </li>
                    {plan.name.toLowerCase().includes('yearly') && (
                      <>
                        <li className="mb-2">
                          <CIcon icon={cilStar} className="text-warning me-2" />
                          <strong>Best Value!</strong>
                        </li>
                        <li className="mb-2">
                          <CIcon icon={cilStar} className="text-warning me-2" />
                          Priority support
                        </li>
                      </>
                    )}
                    {plan.name.toLowerCase().includes('premium') && (
                      <li className="mb-2">
                        <CIcon icon={cilStar} className="text-warning me-2" />
                        Advanced features
                      </li>
                    )}
                  </ul>


                  {/* Action Button */}
                  {isActive && !isExpired ? (
                    <CButton color="secondary" disabled block>
                      Current Plan
                    </CButton>
                  ) : (
                    <CButton
                      color={isExpired ? 'danger' : 'primary'}
                      block
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {isExpired ? 'Renew Now' : 'Subscribe'}
                    </CButton>
                  )}

                  {isActive && plan.days_left > 0 && activePlan?.expiresOn && (
                    <div className="mt-3">
                      <small className="text-muted">
                        Expires on: {activePlan.expiresOn.toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </small>
                    </div>
                  )}

                </CCardBody>
              </CCard>
            </CCol>
          )
        })}
      </CRow>

      {/* No Plans Available */}
      {plans.length === 0 && !loading && (
        <CRow>
          <CCol>
            <CAlert color="info">
              <h5>No subscription plans available</h5>
              <p className="mb-0">Please contact support for more information.</p>
            </CAlert>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default SubscriptionPlans
