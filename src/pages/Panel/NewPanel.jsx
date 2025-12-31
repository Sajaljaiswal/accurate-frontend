import { Printer } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Navigation from "../Navigation";
import {
  Save,
  Building,
  MapPin,
  Phone,
  Mail,
  FileText,
  CreditCard,
  ShieldCheck,
  Globe,
  User,
} from "lucide-react";
import Sidebar from "../Sidebar";

const NewPanel = () => {
  const [form, setForm] = useState({
    name: "",
    organizationType: "Private Limited",
    address: {
      fullAddress: "",
      pincode: "",
    },
    contact: {
      mobile: "",
      email: "",
      website: "",
    },
    billing: {
      gstNumber: "",
      panNumber: "",
      creditLimit: 0,
      paymentCycle: "Prepaid",
    },
    portalUsername: "",
    isActive: true,
  });

  const handleChange = (path, value) => {
    setForm((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;

      keys.slice(0, -1).forEach((k) => {
        obj[k] = { ...obj[k] };
        obj = obj[k];
      });

      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSave = async () => {
    if (!form.name || !form.contact.mobile) {
      alert("Hospital name and mobile are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/panels/register",
        form
      );

      alert("Hospital registered successfully ✅");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  return (
     <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Form Tab Indicator */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex justify-between items-center">
              <div className="inline-block bg-white border-x border-t border-slate-200 px-4 py-2 rounded-t-lg -mb-[13px]">
                <span className="text-blue-700 font-bold flex items-center gap-2">
                  <Building size={18} /> Panel Details
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Registration ID: NEW-HOSP-2026
              </span>
            </div>

            <form className="p-6 md:p-10 space-y-10">
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-1 bg-blue-600 rounded-full"></div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase">
                    General Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Hospital / Clinic Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building
                        className="absolute left-3 top-2.5 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="e.g. City General Hospital"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="w-full pl-10 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Organization Type
                    </label>
                    <select
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none"
                      value={form.organizationType}
                      onChange={(e) =>
                        handleChange("organizationType", e.target.value)
                      }
                    >
                      <option>Private Limited</option>
                      <option>Government / Trust</option>
                      <option>Individual Clinic</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Full Address
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-2.5 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Street, Landmark, City"
                        value={form.address.fullAddress}
                        onChange={(e) =>
                          handleChange("address.fullAddress", e.target.value)
                        }
                        className="w-full pl-10 border border-slate-300 rounded-lg p-2.5 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      value={form.address.pincode}
                      onChange={(e) =>
                        handleChange("address.pincode", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Communication */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-1 bg-blue-600 rounded-full"></div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase">
                    Contact & Communication
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Primary Mobile
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-2.5 text-slate-400"
                        size={16}
                      />
                      <input
                        type="tel"
                        value={form.contact.mobile}
                        onChange={(e) =>
                          handleChange("contact.mobile", e.target.value)
                        }
                        className="w-full pl-10 border border-slate-300 rounded-lg p-2.5 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Official Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-2.5 text-slate-400"
                        size={16}
                      />
                      <input
                        type="email"
                        value={form.contact.email}
                        onChange={(e) =>
                          handleChange("contact.email", e.target.value)
                        }
                        className="w-full pl-10 border border-slate-300 rounded-lg p-2.5 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Website (Optional)
                    </label>
                    <div className="relative">
                      <Globe
                        className="absolute left-3 top-2.5 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="www.hospital.com"
                        className="w-full pl-10 border border-slate-300 rounded-lg p-2.5 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Billing & Commercials */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="text-blue-600" size={18} />
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    Billing & Commercials
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={form.billing.gstNumber}
                      onChange={(e) =>
                        handleChange("billing.gstNumber", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm uppercase"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      value={form.billing.panNumber}
                      onChange={(e) =>
                        handleChange("billing.panNumber", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm uppercase"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Credit Limit
                    </label>
                    <input
                      type="number"
                      placeholder="₹ 0.00"
                      value={form.billing.creditLimit}
                      onChange={(e) =>
                        handleChange(
                          "billing.creditLimit",
                          Number(e.target.value)
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Payment Cycle
                    </label>
                    <select
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none bg-white"
                      value={form.billing.paymentCycle}
                      onChange={(e) =>
                        handleChange("billing.paymentCycle", e.target.value)
                      }
                    >
                      <option>Prepaid</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Security & Access */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-emerald-600" size={18} />
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    Security & Account Status
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Portal Username
                      </label>
                      <input
                        type="text"
                        value={form.portalUsername}
                        onChange={(e) =>
                          handleChange("portalUsername", e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <span className="text-sm font-medium text-blue-900">
                        Active Status
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isActive}
                          onChange={(e) =>
                            handleChange("isActive", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-center">
                    <FileText className="text-slate-300 mb-2" size={32} />
                    <p className="text-xs text-slate-500 font-medium">
                      Upload Hospital Registration Certificate
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Action */}
              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg shadow-md flex items-center gap-2 transition-transform active:scale-95"
                  onClick={handleSave}
                >
                  <Save size={20} /> Register Hospital
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewPanel;
