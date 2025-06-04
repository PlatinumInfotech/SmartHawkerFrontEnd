import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            {/* Renders page content here */}
            <main className="p-4 overflow-auto bg-gray-50 h-full">
              <AppContent />
            </main>
          </div>
          <AppFooter />
        </div>
      </div>
    </>
  )
}

export default DefaultLayout
