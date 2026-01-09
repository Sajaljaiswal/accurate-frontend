import React from 'react'
import Navigation from '../Navigation'
import Sidebar from '../Sidebar'
import CommonPatientReports from "./CommonPatientReports";

const XrayReport = () => {
  return (
    <>
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <CommonPatientReports title="XRAY Reports" testType="xray" />
        </main>
      </div>
    </>
  )
}

export default XrayReport
