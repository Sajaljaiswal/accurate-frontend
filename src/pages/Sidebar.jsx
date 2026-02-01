import React, { useState } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  BriefcaseMedical,
  LogOut,
  LayoutDashboard, 
  Users, 
  FlaskConical, 
  FileSearch, 
  UserCircle, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  Stethoscope,
  Microscope,
  Database,
  ClipboardList,
  ShieldPlus,
  Building2,

} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import ConfirmModal from "../commom/ConfirmModal";
import { useAuth } from "../auth/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogoutConfirm = () => {
    logout();
    navigate("/landingPage");
  };
  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col pb-6 sticky top-0">
     
<nav className="flex-1 px-3 space-y-1 overflow-y-auto">
  <SidebarItem
    icon={<LayoutDashboard size={20} />}
    label="Dashboard"
    active={isActive("/dashboard")}
    onClick={() => navigate("/dashboard")}
  />

  {/* --- Dropdown: Cases --- */}
  <SidebarDropdown
    label="Cases"
    icon={<ClipboardList size={20} />} // Represents patient files/records
    subItems={[
      {
        label: "Patients",
        path: "/allPatient",
        icon: <Users size={18} />,
        active: isActive("/allPatient"),
      },
    ]}
    onNavigate={navigate}
  />

  {/* --- Dropdown: Laboratory --- */}
  <SidebarDropdown
    label="Laboratory"
    icon={<FlaskConical size={20} />}
    subItems={[
      {
        label: "Categories",
        path: "/TestCategories",
        icon: <Database size={18} />, // Represents the organized collection of categories
        active: isActive("/TestCategories"),
      },
      {
        label: "Tests",
        path: "/lab",
        icon: <Microscope size={18} />, // Specific to lab testing
        active: isActive("/lab"),
      },
    ]}
    onNavigate={navigate}
  />

  {/* --- Dropdown: Reports --- */}
  <SidebarDropdown
    label="Reports"
    icon={<FileSearch size={20} />} // Searching/Viewing reports
    subItems={[
      {
        label: "Reports",
        path: "/pathalogyReports",
        icon: <ClipboardList size={18} />,
        active: isActive("/pathalogyReports"),
      },
    ]}
    onNavigate={navigate}
  />

  {/* --- Dropdown: Panels & Doctors --- */}
  <SidebarDropdown
    label="Panels & Doctors"
    icon={<BriefcaseMedical size={20} />}
    subItems={[
      {
        label: "Panels",
        path: "/allPanel",
        icon: <Building2 size={18} />, // Represents Hospitals/Clinics
        active: isActive("/allPanel"),
      },
      {
        label: "Doctors",
        path: "/allDoctor",
        icon: <Stethoscope size={18} />, // Universal symbol for doctors
        active: isActive("/allDoctor"),
      },
      {
        label: "Assign",
        path: "/doctorTestAssign",
        icon: <ShieldPlus size={18} />, // Represents the link/assignment action
        active: isActive("/doctorTestAssign"),
      },
    ]}
    onNavigate={navigate}
  />

  {/* Footer Links */}
  <div className="pt-4 mt-4 border-t border-gray-100">
    <SidebarItem
      icon={<UserCircle size={20} />}
      label="Profile"
      active={isActive("/profile")}
      onClick={() => navigate("/profile")}
    />
    <SidebarItem
      icon={<TrendingUp size={20} />} // Financial growth/Business tracking
      label="Business"
      active={isActive("/dailyBusiness")}
      onClick={() => navigate("/dailyBusiness")}
    />
    <SidebarItem
      icon={<Settings size={20} />}
      label="Settings"
      active={isActive("/settings")}
      onClick={() => navigate("/settings")}
    />
    <SidebarItem
      icon={<LogOut size={20} className="text-rose-500" />} // Slight red tint for logout
      label="Logout"
      onClick={() => setShowLogoutModal(true)}
    />
    <SidebarItem
      icon={<HelpCircle size={20} />}
      label="Help"
      active={isActive("/help")}
      onClick={() => navigate("/help")}
    />
  </div>
</nav>
      <ConfirmModal
        open={showLogoutModal}
        title="Confirm Logout"
        message="You will be logged out from the system."
        confirmText="Logout"
        variant="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </aside>
  );
};

// --- Reusable Sub-Components ---

// 1. COMMON DROPDOWN COMPONENT
const SidebarDropdown = ({ label, icon, subItems, onNavigate }) => {
  // Check if any sub-item is active to keep the dropdown open automatically
  const isAnySubActive = subItems.some((item) => item.active);
  const [isOpen, setIsOpen] = useState(isAnySubActive);

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-500 group-hover:text-blue-600">
            {icon}
          </span>
          <span className="font-bold text-[16px]">{label}</span>
        </div>
        {isOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
      </button>

      {isOpen && (
        <div className="ml-6 border-l-2 border-gray-100 mt-1 space-y-1">
          {subItems.map((item, index) => (
            <SidebarSubItem
              key={index}
              icon={item.icon}
              label={item.label}
              active={item.active}
              onClick={() => onNavigate(item.path)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 2. MAIN ITEM COMPONENT
const SidebarItem = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
      active
        ? "bg-blue-50 text-blue-600 font-semibold"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }`}
  >
    <span
      className={`${
        active ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
      }`}
    >
      {icon}
    </span>
    <span className="text-[15px] font-medium">{label}</span>
  </button>
);

// 3. SUB ITEM COMPONENT
const SidebarSubItem = ({ icon, label, onClick, active = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-2.5 transition-all relative ${
      active
        ? "bg-blue-50 text-blue-600 font-semibold"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
    }`}
  >
    {active && (
      <div className="absolute left-[-2px] top-0 bottom-0 w-1 bg-blue-600 rounded-r-md" />
    )}
    <span className={active ? "text-blue-600" : "text-gray-400"}>{icon}</span>
    <span className="text-[14px]">{label}</span>
  </button>
);

export default Sidebar;
