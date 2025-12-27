import React, { useState } from "react";
import { 
  PlusIcon, CheckCircleIcon, LayoutDashboardIcon, BarChart3Icon, 
  CalendarDaysIcon, WalletIcon, BellIcon, UsersIcon, 
  FileTextIcon, SearchIcon, DownloadIcon, ChevronUpIcon, ChevronDownIcon, 
  SettingsIcon
} from "lucide-react";

const Sidebar = () => {
  const [isBusinessOpen, setIsBusinessOpen] = useState(true);

  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col py-6 sticky top-0">
      {/* New Bill Button */}
      {/* <div className="px-6 mb-8">
        <button className="w-full bg-[#3366FF] hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all">
          <PlusIcon size={18} strokeWidth={3} />
          <span className="text-[15px]">New Registration</span>
        </button>
      </div> */}
      {/* <span className="bg-black ">a</span> */}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <SidebarItem icon={<CheckCircleIcon size={20} />} label="Getting Started" />
        <SidebarItem icon={<LayoutDashboardIcon size={20} />} label="Dashboard" />

        {/* Business Dropdown */}
        <div className="mt-4">
          <button 
            onClick={() => setIsBusinessOpen(!isBusinessOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors"
          >
            <div className="flex items-center gap-3">
              <BarChart3Icon size={20} className="text-gray-500 group-hover:text-blue-600" />
              <span className="font-bold text-[16px]">Business</span>
            </div>
            {isBusinessOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
          </button>

          {isBusinessOpen && (
            <div className="ml-6 border-l-2 border-gray-100 mt-1">
              <SidebarSubItem icon={<CalendarDaysIcon size={18} />} label="Daily business" />
              <SidebarSubItem icon={<WalletIcon size={18} />} label="Expenses" active />
              <SidebarSubItem icon={<WalletIcon size={18} />} label="Due reports" />
              <SidebarSubItem icon={<BellIcon size={18} />} label="Activities" />
              <SidebarSubItem icon={<UsersIcon size={18} />} label="Referral business" />
              <SidebarSubItem icon={<FileTextIcon size={18} />} label="Case wise report" />
              <SidebarSubItem icon={<SearchIcon size={18} />} label="Business analysis" />
              <SidebarSubItem icon={<DownloadIcon size={18} />} label="Data export" />
            </div>
          )}
        </div>

        <SidebarItem icon={<BarChart3Icon size={20} />} label="Reports" />
        <SidebarItem icon={<UsersIcon size={20} />} label="Customers" />
        <SidebarItem icon={<FileTextIcon size={20} />} label="Invoices" />
        <SidebarItem icon={<WalletIcon size={20} />} label="Payments" />
        <SidebarItem icon={<SettingsIcon size={20} />} label="Settings" />
      </nav>
    </aside>
  );
};

const SidebarItem = ({ icon, label }) => (
  <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all group">
    <span className="text-gray-400 group-hover:text-blue-600">{icon}</span>
    <span className="text-[15px] font-medium">{label}</span>
  </button>
);

const SidebarSubItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3 px-6 py-2.5 transition-all relative ${
    active ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
  }`}>
    {/* Active indicator bar */}
    {active && <div className="absolute left-[-2px] top-0 bottom-0 w-1 bg-blue-600 rounded-r-md" />}
    <span className={active ? "text-blue-600" : "text-gray-400"}>{icon}</span>
    <span className="text-[14px]">{label}</span>
  </button>
);

export default Sidebar;