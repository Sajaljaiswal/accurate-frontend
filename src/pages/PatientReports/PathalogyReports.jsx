import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import CommonPatientReports from "./CommonPatientReports";

export default function PathalogyReports() {
  return (
    <>
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <CommonPatientReports title="Lab Reports" testType="lab"/>
        </main>
      </div>
    </>
  );
}
