import React, { useState } from "react";
import { 
  Plus, Shield, Save, Edit2, LayoutGrid, 
  Trash2, ChevronRight, CheckCircle2 
} from "lucide-react";

// Mock Data for UI readying
const SIDEBAR_TABS = [
  { value: "dashboard", label: "Dashboard" },
  { value: "users", label: "Users" },
  { value: "inventory", label: "Inventory" },
  { value: "reports", label: "Reports" },
  { value: "settings", label: "Settings" },
];

const RoleManagement = () => {
  // --- UI STATES ---
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // --- FORM STATES ---
  const [roleName, setRoleName] = useState("");
  const [selectedTabs, setSelectedTabs] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Mock roles for visual development
  const roles = [
    { id: "1", name: "Super Admin", tabs: 5, status: "System" },
    { id: "2", name: "Lab Technician", tabs: 3, status: "Custom" },
    { id: "3", name: "Receptionist", tabs: 2, status: "Custom" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Shield className="text-blue-600" size={28} />
            Role & Access Control
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure system-wide permissions and sidebar visibility for different staff roles.
          </p>
        </div>
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          ADD NEW ROLE
        </button>
      </div>

      {/* ROLE GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div 
            key={role.id} 
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                role.status === 'System' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {role.status}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-1">{role.name}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
              <LayoutGrid size={14} />
              <span>{role.tabs} Sidebar modules active</span>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between group-hover:text-blue-600 cursor-pointer">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-600">View Permissions</span>
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* CREATE ROLE MODAL OVERLAY (Placeholder UI) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus size={20} /> Create New Role
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="hover:rotate-90 transition-transform text-white/70 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Role Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Pathologist"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Sidebar Access</label>
                <div className="grid grid-cols-2 gap-3">
                  {SIDEBAR_TABS.map(tab => (
                    <button 
                      key={tab.value}
                      className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-blue-50 text-left transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700">{tab.label}</span>
                      <CheckCircle2 size={16} className="text-slate-200" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button className="bg-blue-900 text-white px-8 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all">
                Save & Finalize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION (Simple UI) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Delete Role?</h3>
            <p className="text-slate-500 text-sm mt-2 mb-8">This action cannot be undone and will affect any users currently assigned this role.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 font-bold text-slate-400 hover:bg-slate-50 rounded-xl">No, Keep it</button>
              <button className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;