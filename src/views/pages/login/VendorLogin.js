import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPhone, cilLockLocked } from '@coreui/icons'
import api from '../../../services/useApi'

const VendorLogin = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    mobile: '',
    otp: ''
  })
  const [verificationId, setVerificationId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(true)

  const navigate = useNavigate()


  const CUSTOMER_ID = import.meta.env.VITE_MESSAGE_CENTRAL_CUSTOMER_ID
  const AUTH_TOKEN = import.meta.env.VITE_MESSAGE_CENTRAL_AUTH_TOKEN
  const COUNTRY_CODE = '91'

  console.log('Customer ID:', CUSTOMER_ID)
  console.log('Auth Token length:', AUTH_TOKEN?.length)


  // Timer countdown for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(mobile)
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.mobile.trim()) {
      setError('Mobile number is required')
      return
    }

    if (!validateMobile(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(
        `https://cpaas.messagecentral.com/verification/v3/send?countryCode=${COUNTRY_CODE}&customerId=${CUSTOMER_ID}&flowType=SMS&mobileNumber=${formData.mobile}`,
        {
          method: 'POST',
          headers: {
            'authToken': AUTH_TOKEN,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()

      if (data.responseCode === 200) {
        setVerificationId(data.data.verificationId)
        setStep(2)
        setTimer(30)
        setCanResend(false)
      } else {
        setError(data.message || 'Failed to send OTP')
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      setError('Unable to send OTP. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend || timer > 0) return

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `https://cpaas.messagecentral.com/verification/v3/send?countryCode=${COUNTRY_CODE}&customerId=${CUSTOMER_ID}&flowType=SMS&mobileNumber=${formData.mobile}`,
        {
          method: 'POST',
          headers: {
            'authToken': AUTH_TOKEN,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()

      if (data.responseCode === 200) {
        setVerificationId(data.data.verificationId)
        setTimer(30)
        setCanResend(false)
        setError('')
      } else {
        setError(data.message || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      setError('Unable to resend OTP. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.otp.trim()) {
      setError('Please enter OTP')
      return
    }

    if (formData.otp.length < 4) {
      setError('Please enter a valid OTP')
      return
    }

    setIsSubmitting(true)

    try {
      // Step 1: Verify OTP with MessageCentral
      const verifyResponse = await fetch(
        `https://cpaas.messagecentral.com/verification/v3/validateOtp?countryCode=${COUNTRY_CODE}&mobileNumber=${formData.mobile}&verificationId=${verificationId}&customerId=${CUSTOMER_ID}&code=${formData.otp}`,
        {
          method: 'GET',
          headers: {
            'authToken': AUTH_TOKEN
          }
        }
      )

      const verifyData = await verifyResponse.json()

      if (
        verifyData.responseCode === 200 &&
        verifyData.data.verificationStatus === 'VERIFICATION_COMPLETED'
      ) {
        // Step 2: Login with backend - SIMPLIFIED like admin login
        const res = await api.post('/login', {
          mobile: formData.mobile,
          userType: 'vendor',
          fcmToken: null
        })

        console.log('Login response:', res.data) // Debug

        // Match admin login pattern - simple token check
        if (!res.data.error && res.data.token) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userType', 'vendor')
          localStorage.setItem('userData', JSON.stringify(res.data.user))

          console.log('✅ Vendor login successful')
          console.log('Token:', localStorage.getItem('token'))
          console.log('UserType:', localStorage.getItem('userType'))

          // Navigate to vendor dashboard
          window.location.href = '/#/vendor/dashboard'  // Force reload to ensure proper routing
        } else {
          setError('Login failed. Please try again.')
        }
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setError('Verification failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleEditMobile = () => {
    setStep(1)
    setFormData({ ...formData, otp: '' })
    setError('')
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <h1>SmartHawker</h1>
                  <h2>Vendor Login</h2>
                  <p className="text-body-secondary">
                    {step === 1 ? 'Enter your mobile number' : 'Enter OTP sent to your mobile'}
                  </p>

                  {error && (
                    <CAlert color="danger" className="mb-3">
                      {error}
                    </CAlert>
                  )}

                  {step === 1 ? (
                    <CForm onSubmit={handleSendOTP}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilPhone} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Mobile Number"
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          maxLength={10}
                          autoComplete="tel"
                        />
                      </CInputGroup>

                      <CRow>
                        <CCol xs={6}>
                          <CButton
                            color="primary"
                            className="px-4"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Sending...' : 'Send OTP'}
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-end">
                          <Link to="/register">
                            <CButton color="link" className="px-0">
                              Sign Up
                            </CButton>
                          </Link>
                        </CCol>
                      </CRow>

                      <CRow className="mt-3">
                        <CCol xs={12}>
                          <Link to="/login">
                            <CButton color="link" className="px-0">
                              Admin Login
                            </CButton>
                          </Link>
                        </CCol>
                      </CRow>
                    </CForm>
                  ) : (
                    <CForm onSubmit={handleVerifyOTP}>
                      <div className="mb-3">
                        <small className="text-muted">
                          OTP sent to +91 {formData.mobile}{' '}
                          <CButton
                            color="link"
                            size="sm"
                            className="p-0"
                            onClick={handleEditMobile}
                          >
                            Edit
                          </CButton>
                        </small>
                      </div>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Enter OTP"
                          type="text"
                          name="otp"
                          value={formData.otp}
                          onChange={handleChange}
                          maxLength={6}
                          autoComplete="one-time-code"
                          autoFocus
                        />
                      </CInputGroup>

                      <div className="mb-3">
                        {timer > 0 ? (
                          <small className="text-muted">
                            Resend OTP in {timer} seconds
                          </small>
                        ) : (
                          <CButton
                            color="link"
                            size="sm"
                            className="p-0"
                            onClick={handleResendOTP}
                            disabled={!canResend || isSubmitting}
                          >
                            Resend OTP
                          </CButton>
                        )}
                      </div>

                      <CRow>
                        <CCol xs={12}>
                          <CButton
                            color="primary"
                            className="px-4 w-100"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Verifying...' : 'Verify & Login'}
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  )}
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default VendorLogin
