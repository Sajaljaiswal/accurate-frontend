// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import AllPatient from "./pages/AllPatient";
import Account from "./pages/Account";
import NewDoctor from "./pages/Doctors/NewDoctor";
import NewPanel from "./pages/Panel/NewPanel";

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
