import React, { useState } from "react";
import { 
  Plus, Shield, Lock, CreditCard, FlaskConical, BarChart3, Activity, Zap
} from "lucide-react";

// CATEGORIES FROM YOUR IMAGE
const PERMISSIONS_DATA = [
  {
    category: "Access permissions",
    icon: <Lock size={18} className="text-red-400" />,
    permissions: [
      { id: "setup_lab", label: "Can setup lab" },
      { id: "export_data", label: "Can export data" },
      { id: "view_test_counts", label: "Can view lab test counts" },
      { id: "manage_doctor_portal", label: "Can manage doctor portal" },
      { id: "limit_patient_history", label: "Add limit to patient record history", isAction: true },
    ]
  },
  {
    category: "Billing permissions",
    icon: <CreditCard size={18} className="text-blue-400" />,
    permissions: [
      { id: "manage_billing", label: "Can manage patient registration and billing" },
      { id: "cannot_remove_investigations", label: "Cannot remove investigations from case", parentId: "manage_billing" },
      { id: "cannot_change_discount", label: "Cannot change discount", parentId: "manage_billing" },
    ]
  },
  {
    category: "Lab report permissions",
    icon: <FlaskConical size={18} className="text-purple-400" />,
    permissions: [
      { id: "manage_lab_reports", label: "Can manage lab reports" },
      { id: "sign_lab_reports", label: "Can sign lab reports", parentId: "manage_lab_reports" },
      { id: "edit_lab_reports", label: "Can edit lab reports", parentId: "manage_lab_reports" },
      { id: "manage_test_database", label: "Can manage lab test database", parentId: "manage_lab_reports" },
      { id: "print_deliver_reports", label: "Can print and deliver lab reports", parentId: "manage_lab_reports" },
    ]
  },
  {
    category: "Business report permissions",
    icon: <BarChart3 size={18} className="text-blue-500" />,
    permissions: [
      { id: "view_business_reports", label: "Can view business reports", subtext: "If unchecked, employee will not be able to see daily business or any business report" },
      { id: "view_business_analysis", label: "Can view business analysis" },
      { id: "view_referral_business", label: "Can view referral business" },
      { id: "view_case_wise_business", label: "Can view case wise business" },
      { id: "limit_business_history", label: "Add limit to business report history", isAction: true },
    ]
  },
  {
    category: "USG report permissions",
    icon: <Activity size={18} className="text-pink-400" />,
    permissions: [
      { id: "manage_usg_reports", label: "Can manage usg reports" },
    ]
  },
  {
    category: "Digital X-ray report permissions",
    icon: <Zap size={18} className="text-green-500" />,
    permissions: [
      { id: "manage_xray_reports", label: "Can manage digital xray reports" },
    ]
  }
];


const RoleManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const togglePermission = (id) => {
    setSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Shield className="text-blue-600" size={28} />
            Role & Access Control
          </h1>
          <p className="text-slate-500 text-sm mt-1">Configure staff permissions as per clinical hierarchy.</p>
        </div>
        
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
          <Plus size={20} /> ADD NEW ROLE
        </button>
      </div>

      {/* CREATE ROLE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
            <div className="bg-blue-900 p-6 text-white flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2">Configure Role Permissions</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-white/70 hover:text-white text-2xl">✕</button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto flex-1 bg-slate-50">
              {/* Role Name Input */}
              <div className="max-w-md">
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Role Name</label>
                <input type="text" placeholder="e.g. Lab Manager" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" />
              </div>

              {/* PERMISSIONS GRID FROM IMAGE */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PERMISSIONS_DATA.map((group, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                      {group.icon}
                      <h3 className="font-bold text-slate-800">{group.category}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {group.permissions.map((perm) => (
                        <div key={perm.id} className={`${perm.parentId ? 'ml-6' : ''}`}>
                          {perm.isAction ? (
                            <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1 mt-2">
                              + {perm.label}
                            </button>
                          ) : (
                            <label className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative flex items-center mt-1">
                                <input 
                                  type="checkbox" 
                                  checked={selectedPermissions.includes(perm.id)}
                                  onChange={() => togglePermission(perm.id)}
                                  className="peer h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-sm ${selectedPermissions.includes(perm.id) ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                  {perm.label}
                                </span>
                                {perm.subtext && <span className="text-[10px] text-slate-400 leading-tight mt-1">{perm.subtext}</span>}
                              </div>
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2.5 font-bold text-slate-500">Cancel</button>
              <button className="bg-blue-900 text-white px-8 py-2.5 rounded-xl font-bold">Save Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;