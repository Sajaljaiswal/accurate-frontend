import React from 'react'
import Sidebar from '../Sidebar'
import Navigation from '../Navigation'
import CommonPatientReports from "./CommonPatientReports";

const CtScanReport = () => {
  return (
    <>
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <CommonPatientReports title="CT Scan Reports" testType="ct" />
        </main>
      </div>
    </>
  )
}

export default CtScanReport
