  import React, { useState, useEffect } from "react"; // Added missing hooks
  import { Printer } from "lucide-react";
  import Navigation from "../Navigation";
  import { useNavigate } from "react-router-dom";
  import { addTest } from "../../api/testApi";


  const AddTest = () => {
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
      name: "",
      category: "",
      sampleType: "NA",
      defaultPrice: "",
      status: "ACTIVE", // Added status to initial state
    });

    // Added missing handleChange function
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
      console.log("Submitting Form State:", form);
    try {
      if (!form.name || !form.category || !form.sampleType || !form.defaultPrice) {
        alert("Please fill all required fields");
        return;
      }

      const payload = {
        name: form.name.trim(),
        category: form.category,
        sampleType: form.sampleType,
        defaultPrice: Number(form.defaultPrice),
        isActive: form.status === "ACTIVE",
      };

      await addTest(payload);

      alert("Test added successfully ✅");

      setForm({
        name: "",
        category: "",
        sampleType: "",
        defaultPrice: "",
        status: "ACTIVE",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save test");
    }
  };


    useEffect(() => {
      if (["USG", "XRAY", "MRI"].includes(form.category)) {
        setForm((prev) => ({ ...prev, sampleType: "IMAGING" }));
      }
    }, [form.category]);

    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />

        <main className="flex-grow bg-slate-50 p-6 flex justify-center">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg border border-slate-200 h-fit">
            {/* Header */}
            <div className="bg-blue-900 py-4 rounded-t-xl">
              <h1 className="text-white text-center text-lg font-bold uppercase tracking-wider">
                Add Diagnostic Test
              </h1>
            </div>

            {/* Form Content */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                
                {/* LEFT SECTION */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-blue-900 uppercase border-b pb-2">
                    Test Information
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Test Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="CBC, USG Abdomen"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                    >
                      <option value="">Select</option>
                      <option value="BLOOD">Blood Test</option>
                      <option value="USG">USG</option>
                      <option value="XRAY">X-Ray</option>
                      <option value="MRI">MRI</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Sample Type
                    </label>
                    <select
                      name="sampleType"
                      value={form.sampleType}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                    >
                    <option value="NA">Not Applicable (NA)</option>
                      <option value="BLOOD">Blood</option>
                      <option value="URINE">Urine</option>
                      <option value="STOOL">Stool</option>
                      <option value="SALIVA">Saliva</option>
                      <option value="IMAGING">Imaging</option>
                      <option value="NA">Not Applicable</option>
                    </select>
                  </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-blue-900 uppercase border-b pb-2">
                    Pricing & Status
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Test Price (₹)
                    </label>
                    <input
                      type="number"
                      name="defaultPrice"
                      value={form.defaultPrice}
                      onChange={handleChange}
                      placeholder="500"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Status
                    </label>
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="ACTIVE"
                          checked={form.status === "ACTIVE"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        Active
                      </label>

                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="INACTIVE"
                          checked={form.status === "INACTIVE"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        Inactive
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t flex gap-4">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-900 text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-800 transition-colors"
                >
                  SAVE TEST
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-slate-200 text-slate-700 px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-300 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-blue-900 text-white text-xs py-3 text-center">
          © 2026 Accurate Diagnostic Center. All rights reserved.
        </footer>
      </div>
    );
  };

  export default AddTest;