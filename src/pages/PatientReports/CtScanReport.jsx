import React from 'react'
import Sidebar from '../Sidebar'
import Navigation from '../Navigation'

const CtScanReport = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto"> 

          <h1>CT Scan Report</h1>
        </main>
        </div>
    </div>
  )
}

export default CtScanReport
