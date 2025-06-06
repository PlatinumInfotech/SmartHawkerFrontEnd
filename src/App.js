import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'
// import VendorList from './views/pages/VendorList';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Vendorlist = React.lazy(() => import('./views/pages/VendorList'))
const CustomerList = React.lazy(() => import('./views/pages/CustomerList'))
const EmployeeList = React.lazy(() => import('./views/pages/EmployeeList'))
const ProductList = React.lazy(() => import('./views/pages/ProductList'))

import ProtectedRoute from './ProtectedRoute'

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route
            path="*"
            element={localStorage.getItem('token') ? <DefaultLayout /> : <Navigate to="/login" />}
          />

          <Route
            path="/vendorlist"
            name="Vendorlist"
            element={
              <ProtectedRoute>
                <Vendorlist />
              </ProtectedRoute>
            }
          />
          <Route path="/customerlist" name="Customerlist" element={<CustomerList />} />
          <Route path="/employeelist" name="Employeelist" element={<EmployeeList />} />
          <Route path="/productlist" name="Productlist" element={<ProductList />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
