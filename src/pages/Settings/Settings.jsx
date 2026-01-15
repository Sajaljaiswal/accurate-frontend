import { useState } from "react";
import { Save, Building, CreditCard, Lock } from "lucide-react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import api from "../../api/axios"; // Adjust path to your axios instance

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">System Settings</h1>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 space-y-2">
                <TabButton 
                  label="Clinic Profile" 
                  icon={<Building size={18} />} 
                  active={activeTab === "profile"} 
                  onClick={() => setActiveTab("profile")} 
                />
                <TabButton 
                  label="Banking & Billing" 
                  icon={<CreditCard size={18} />} 
                  active={activeTab === "billing"} 
                  onClick={() => setActiveTab("billing")} 
                />
                <TabButton 
                  label="Security" 
                  icon={<Lock size={18} />} 
                  active={activeTab === "security"} 
                  onClick={() => setActiveTab("security")} 
                />
              </div>

              {/* Content Area */}
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {activeTab === "profile" && <ProfileSettings />}
                {activeTab === "billing" && <BillingSettings />}
                {activeTab === "security" && <SecuritySettings />}
                
                {/* <div className="mt-8 pt-6 border-t flex justify-end">
                  <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md">
                    <Save size={18} /> Save Changes
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const ProfileSettings = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Clinic Information</h3>
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Clinic Name</label>
        <input type="text" defaultValue="ACCURATE DIAGNOSTIC CENTER" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Registered Address</label>
        <textarea defaultValue="Patel Nagar, Durgapuri, Naka, Faizabad, UP 224001" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none h-20" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Phone</label>
          <input type="text" defaultValue="0522-4341100" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
          <input type="email" defaultValue="info@accuratediagnostic.com" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
      </div>
    </div>
  </div>
);

const BillingSettings = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Remittance Details</h3>
    <p className="text-xs text-red-500 font-bold uppercase italic">Used for automated report headers and bills.</p>
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bank Name</label>
        <input type="text" defaultValue="INDUSIND BANK" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Number</label>
          <input type="text" defaultValue="201004379103" className="w-full border rounded-lg px-3 py-2 text-sm font-mono outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">IFSC Code</label>
          <input type="text" defaultValue="INDB0000758" className="w-full border rounded-lg px-3 py-2 text-sm font-mono outline-none" />
        </div>
      </div>
    </div>
  </div>
);


const SecuritySettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: "error", message: "New passwords do not match" });
    }
    if (formData.newPassword.length < 4) {
      return setStatus({ type: "error", message: "Password must be more than 4 character" });
    }

    setLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setStatus({ type: "success", message: "Password updated successfully!" });
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Failed to update password" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Account Security</h3>
      
      <form onSubmit={handlePasswordChange} className="space-y-4">
        {status.message && (
          <div className={`p-3 rounded-lg text-xs font-bold ${
            status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {status.message}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Password</label>
          <input 
            type="password" 
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
          <input 
            type="password" 
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Min 8 characters" 
            required
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm New Password</label>
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat new password" 
            required
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" 
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold text-sm hover:bg-slate-900 transition-all disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

const TabButton = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
      active 
        ? "bg-teal-600 text-white shadow-md translate-x-1" 
        : "text-gray-600 hover:bg-white hover:text-teal-600 border border-transparent hover:border-gray-200"
    }`}
  >
    {icon} {label}
  </button>
);

export default Settings;