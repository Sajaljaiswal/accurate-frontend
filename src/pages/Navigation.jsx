import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ConfirmModal from "../commom/ConfirmModal";

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    navigate("/landingPage");
  };
  return (
    <div>
      <header className="bg-[#1e3a8a] text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-full">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            ACCURATE DIAGNOSTIC CENTER, AYODHYA
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded text-sm font-bold transition"
            onClick={() => navigate("/register")}
          >
            New Registration
          </button>
          <button
            className="bg-white text-gray-800 px-3 py-1 rounded text-sm font-mono"
            onClick={() => {
              navigate("/profile");
            }}
          >
            {user?.username || "Admin"}
          </button>
          <button
            className="bg-white text-gray-800 px-3 py-1 rounded text-sm font-mono"
            onClick={() => setShowLogoutModal(true)}
          >
            {"Logout"}
          </button>
        </div>
      </header>

      <ConfirmModal
        open={showLogoutModal}
        title="Confirm Logout"
        message="You will be logged out from the system."
        confirmText="Logout"
        variant="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default Navigation;
