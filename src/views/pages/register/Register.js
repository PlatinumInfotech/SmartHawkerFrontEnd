import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormTextarea,
  CRow,
  CAlert,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilBriefcase,
  cilPhone,
  cilEnvelopeOpen,
  cilLocationPin,
  cilNotes,
  cilGift,
  cilCheckCircle,
} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import api from '../../../../src/services/useApi'

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    mobile: '',
    email: '',
    address: '',
    gst_number: '',
    referralCode: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const validateEmail = (email) => {
    if (!email) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(mobile)
  }

  const validateGST = (gst) => {
    if (!gst) return true
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    return gstRegex.test(gst)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Vendor name is required'
    }

    if (!formData.business_name.trim()) {
      newErrors.business_name = 'Business name is required'
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number'
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Business address is required'
    }

    if (formData.gst_number && !validateGST(formData.gst_number)) {
      newErrors.gst_number = 'Please enter a valid GST number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const dataToSend = {
        name: formData.name,
        business_name: formData.business_name,
        mobile: formData.mobile,
        email: formData.email || null,
        address: formData.address,
        gst_number: formData.gst_number || null,
      }

      const response = await api.post('/register/vendor', dataToSend)

      if (response.data.statusCode === 201) {
        setSubmitSuccess(true)
        setTimeout(() => {
          navigate('/vendor-login')
        }, 4000)
      } else {
        setSubmitError(response.data.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message)
      } else {
        setSubmitError('Unable to connect to server. Please check if the backend is running.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* CSS for placeholder visibility */}
      <style>
        {`
          .register-input::placeholder {
            color: #94a3b8 !important;
            opacity: 1 !important;
          }
          .register-input::-webkit-input-placeholder {
            color: #94a3b8 !important;
            opacity: 1 !important;
          }
          .register-input::-moz-placeholder {
            color: #94a3b8 !important;
            opacity: 1 !important;
          }
          .register-input:-ms-input-placeholder {
            color: #94a3b8 !important;
            opacity: 1 !important;
          }
        `}
      </style>

      <div
        className="min-vh-100 d-flex flex-row align-items-center"
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.08)',
          }}
        />

        <CContainer style={{ position: 'relative', zIndex: 1 }}>
          <CRow className="justify-content-center">
            <CCol md={11} lg={10} xl={9}>
              <CCard
                className="shadow-lg border-0"
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                <CCardBody className="p-5">
                  <CRow className="g-0">
                    {/* Left Side - Branding */}
                    <CCol lg={5} className="d-none d-lg-flex flex-column justify-content-center align-items-center pe-5">
                      <div className="text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center mb-4"
                          style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '30px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                          }}
                        >
                          <CIcon icon={cilBriefcase} size="4xl" className="text-white" />
                        </div>
                        <h3 className="fw-bold mb-3" style={{ color: '#1e293b' }}>
                          SmartHawker
                        </h3>
                        <p className="text-muted mb-4">
                          Simplify your business management with our all-in-one platform
                        </p>

                        {/* Features List */}
                        <div className="text-start mt-5">
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className="d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(102, 126, 234, 0.1)',
                              }}
                            >
                              <CIcon icon={cilCheckCircle} className="text-primary" />
                            </div>
                            <div>
                              <h6 className="mb-0 fw-semibold" style={{ color: '#1e293b' }}>Easy Management</h6>
                              <small className="text-muted">Track customers & sales</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className="d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(102, 126, 234, 0.1)',
                              }}
                            >
                              <CIcon icon={cilCheckCircle} className="text-primary" />
                            </div>
                            <div>
                              <h6 className="mb-0 fw-semibold" style={{ color: '#1e293b' }}>Digital Reports</h6>
                              <small className="text-muted">Analytics at your fingertips</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div
                              className="d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(102, 126, 234, 0.1)',
                              }}
                            >
                              <CIcon icon={cilCheckCircle} className="text-primary" />
                            </div>
                            <div>
                              <h6 className="mb-0 fw-semibold" style={{ color: '#1e293b' }}>Grow Faster</h6>
                              <small className="text-muted">Scale your business efficiently</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CCol>

                    {/* Right Side - Form */}
                    <CCol lg={7}>
                      <div className="mb-4">
                        <h2 className="fw-bold mb-2" style={{ color: '#1e293b' }}>
                          Business Registration
                        </h2>
                        <p style={{ color: '#64748b', marginBottom: 0 }}>
                          Create your account on SmartHawker
                        </p>
                      </div>

                      {/* Success Alert */}
                      {submitSuccess && (
                        <CAlert color="success" className="mb-4 border-0" style={{ borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)' }}>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilCheckCircle} className="me-2" size="lg" />
                            <div>
                              <strong>Registration Success!</strong> Redirecting to login...
                            </div>
                          </div>
                        </CAlert>
                      )}

                      {/* Error Alert */}
                      {submitError && (
                        <CAlert color="danger" className="mb-4 border-0" style={{ borderRadius: '12px' }}>
                          <strong>Error!</strong> {submitError}
                        </CAlert>
                      )}

                      <CForm onSubmit={handleSubmit}>
                        <CRow>
                          {/* Vendor Name */}
                          <CCol md={6} className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#475569' }}>
                              Vendor Name <span className="text-danger">*</span>
                            </label>
                            <CInputGroup>
                              <CInputGroupText style={{ background: 'transparent', border: '1px solid #e2e8f0' }}>
                                <CIcon icon={cilUser} style={{ color: '#94a3b8' }} />
                              </CInputGroupText>
                              <CFormInput
                                type="text"
                                name="name"
                                placeholder="Your full name"
                                value={formData.name}
                                onChange={handleChange}
                                invalid={!!errors.name}
                                className="register-input"
                                style={{
                                  border: '1px solid #e2e8f0',
                                  background: 'white',
                                  color: '#1e293b'
                                }}
                              />
                            </CInputGroup>
                            {errors.name && <small className="text-danger">{errors.name}</small>}
                          </CCol>

                          {/* Business Name */}
                          <CCol md={6} className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#475569' }}>
                              Business Name <span className="text-danger">*</span>
                            </label>
                            <CInputGroup>
                              <CInputGroupText style={{ background: 'transparent', border: '1px solid #e2e8f0' }}>
                                <CIcon icon={cilBriefcase} style={{ color: '#94a3b8' }} />
                              </CInputGroupText>
                              <CFormInput
                                type="text"
                                name="business_name"
                                placeholder="Your business name"
                                value={formData.business_name}
                                onChange={handleChange}
                                invalid={!!errors.business_name}
                                className="register-input"
                                style={{
                                  border: '1px solid #e2e8f0',
                                  background: 'white',
                                  color: '#1e293b'
                                }}
                              />
                            </CInputGroup>
                            {errors.business_name && <small className="text-danger">{errors.business_name}</small>}
                          </CCol>

                          {/* Mobile Number */}
                          <CCol md={6} className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#475569' }}>
                              Mobile Number <span className="text-danger">*</span>
                            </label>
                            <CInputGroup>
                              <CInputGroupText style={{ background: 'transparent', border: '1px solid #e2e8f0' }}>
                                <CIcon icon={cilPhone} style={{ color: '#94a3b8' }} />
                              </CInputGroupText>
                              <CFormInput
                                type="tel"
                                name="mobile"
                                placeholder="10-digit number"
                                value={formData.mobile}
                                onChange={handleChange}
                                invalid={!!errors.mobile}
                                maxLength={10}
                                className="register-input"
                                style={{
                                  border: '1px solid #e2e8f0',
                                  background: 'white',
                                  color: '#1e293b'
                                }}
                              />
                            </CInputGroup>
                            {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                          </CCol>

                          {/* Email */}
                          <CCol md={6} className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#475569' }}>
                              Email Address
                            </label>
                            <CInputGroup>
                              <CInputGroupText style={{ background: 'transparent', border: '1px solid #e2e8f0' }}>
                                <CIcon icon={cilEnvelopeOpen} style={{ color: '#94a3b8' }} />
                              </CInputGroupText>
                              <CFormInput
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                invalid={!!errors.email}
                                className="register-input"
                                style={{
                                  border: '1px solid #e2e8f0',
                                  background: 'white',
                                  color: '#1e293b'
                                }}
                              />
                            </CInputGroup>
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                          </CCol>

                          {/* Address */}
                          <CCol md={12} className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#475569' }}>
                              Business Address <span className="text-danger">*</span>
                            </label>
                            <CInputGroup>
                              <CInputGroupText className="align-items-start pt-2" style={{ background: 'transparent', border: '1px solid #e2e8f0' }}>
                                <CIcon icon={cilLocationPin} style={{ color: '#94a3b8' }} />
                              </CInputGroupText>
                              <CFormTextarea
                                name="address"
                                placeholder="Complete business address"
                                value={formData.address}
                                onChange={handleChange}
                                invalid={!!errors.address}
                                rows={3}
                                className="register-input"
                                style={{
                                  border: '1px solid #e2e8f0',
                                  background: 'white',
                                  color: '#1e293b'
                                }}
                              />
                            </CInputGroup>
                            {errors.address && <small className="text-danger">{errors.address}</small>}
                          </CCol>

                          {/* GST Number */}
                          <CCol md={6} className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#475569' }}>
                              GST Number
                            </label>
                            <CInputGroup>
                              <CInputGroupText style={{ background: 'transparent', border: '1px solid #e2e8f0' }}>
                                <CIcon icon={cilNotes} style={{ color: '#94a3b8' }} />
                              </CInputGroupText>
                              <CFormInput
                                type="text"
                                name="gst_number"
                                placeholder="15-digit GST"
                                value={formData.gst_number}
                                onChange={handleChange}
                                invalid={!!errors.gst_number}
                                maxLength={15}
                                className="register-input"
                                style={{
                                  textTransform: 'uppercase',
                                  border: '1px solid #e2e8f0',
                                  background: 'white',
                                  color: '#1e293b'
                                }}
                              />
                            </CInputGroup>
                            {errors.gst_number && <small className="text-danger">{errors.gst_number}</small>}
                          </CCol>

                          {/* Referral Code */}
                          <CCol md={6} className="mb-4">
                            <label className="form-label fw-semibold small" style={{ color: '#475569' }}>
                              Referral Code
                            </label>
                            <CInputGroup>
                              <CInputGroupText style={{ background: 'transparent', border: '1px solid #e2e8f0' }}>
                                <CIcon icon={cilGift} style={{ color: '#94a3b8' }} />
                              </CInputGroupText>
                              <CFormInput
                                type="text"
                                name="referralCode"
                                placeholder="Have a code?"
                                value={formData.referralCode}
                                onChange={handleChange}
                                className="register-input"
                                style={{
                                  border: '1px solid #e2e8f0',
                                  background: 'white',
                                  color: '#1e293b'
                                }}
                              />
                            </CInputGroup>
                          </CCol>
                        </CRow>

                        {/* Submit Button */}
                        <div className="d-grid mb-3">
                          <CButton
                            size="lg"
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '14px',
                              fontWeight: '600',
                              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Creating Account...
                              </>
                            ) : (
                              'Create Account'
                            )}
                          </CButton>
                        </div>

                        {/* Link to Login */}
                        <div className="text-center">
                          <p style={{ color: '#64748b', marginBottom: 0 }}>
                            Already have an account?{' '}
                            <a
                              href="/#/vendor-login"
                              className="fw-semibold text-decoration-none"
                              style={{ color: '#667eea' }}
                            >
                              Sign in here
                            </a>
                          </p>
                        </div>
                      </CForm>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              {/* Footer Note */}
              <div className="text-center mt-4">
                <p className="mb-0" style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  By registering, you agree to our{' '}
                  <a
                    href="https://platinuminfo.tech/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                    style={{ color: '#667eea', fontWeight: '500' }}
                  >
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a
                    href="https://platinuminfo.tech/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                    style={{ color: '#667eea', fontWeight: '500' }}
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Register
