// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import AllPatient from "./pages/Patient/AllPatient";
import Account from "./pages/Account";
import NewDoctor from "./pages/Doctors/NewDoctor";
import NewPanel from "./pages/Panel/NewPanel";
import AllDoctor from "./pages/Doctors/AllDoctor";
import AllPanel from "./pages/Panel/AllPanel";
import Lab from "./pages/Lab/AllTest";
import AddTest from "./pages/Lab/AddTest";
import AllTest from "./pages/Lab/AllTest";
import ProfilePage from "./pages/ProfilePage";
import RoleManagement from "./pages/RoleManagement";
import DoctorTestList from "./pages/Doctors/DoctorTestList";
import DoctorTestAssign from "./pages/Doctors/DoctorTestAssign";
import PatientReports from "./pages/PatientReports/PatientReports";
import TestCategories from "./pages/Lab/TestCategories";
import LabReports from "./pages/Reports/LabReports";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["SUPERADMIN"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/allPatient" element={<AllPatient />} />
          <Route path="/account" element={<Account />} />
          <Route path="/newDoctor" element={<NewDoctor />} />
          <Route path="/newPanel" element={<NewPanel />} />
          <Route path="/allDoctor" element={<AllDoctor />} />
          <Route path="/allPanel" element={<AllPanel />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/addTest" element={<AddTest />} />
          <Route path="/allTest" element={<AllTest />} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/roleManagement" element={<RoleManagement />} />
          <Route path="/doctorTestList" element={<DoctorTestList />} />
          <Route path="/doctorTestAssign" element={<DoctorTestAssign />} />
            <Route path="/patientReports" element={<PatientReports />} />
            <Route path="/testCategories" element={<TestCategories />} />
            <Route path="/lab-report/:id" element={<LabReports />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
