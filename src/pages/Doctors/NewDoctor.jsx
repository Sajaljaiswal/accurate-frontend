import React, { useState } from "react";
import { createDoctor } from "./../../api/doctorApi";
import Navigation from "../Navigation";
import {
  Save,
  UserPlus,
  MapPin,
  Building2,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Lock,
} from "lucide-react";

const NewDoctor = () => {
  const [form, setForm] = useState({
    title: "Dr.",
    fullName: "",
    degree: "",
    specialization: "",
    clinicName: "",
    hospitalName: "",
    clinicAddress: "",
    mobile: "",
    clinicPhone: "",
    email: "",
    dob: "",
    password: "",
    status: "UNTAGGED",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await createDoctor(form);
    alert("Doctor registered successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to save doctor");
  }
};


  return (
    <div>
      <Navigation />

      <div className="flex flex-col min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-blue-900 py-4 shadow-md">
          <h1 className="text-xl font-bold text-white text-center uppercase tracking-wider">
            Referring Doctor Registration
          </h1>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Form Tab Indicator */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
              <div className="inline-block bg-white border-x border-t border-slate-200 px-4 py-2 rounded-t-lg -mb-[13px]">
                <span className="text-red-700 font-bold flex items-center gap-2">
                  <UserPlus size={18} /> Doctor Details
                </span>
              </div>
            </div>

            <form className="p-6 md:p-10 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                {/* Section 1: Basic & Professional Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-blue-900 uppercase border-b border-slate-100 pb-2">
                    Professional Information
                  </h3>

                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Title
                      </label>
                      <select
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                      >
                        <option>Dr.</option>
                        <option>Mr.</option>
                        <option>Ms.</option>
                      </select>
                    </div>
                    <div className="w-2/3">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={form.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Degree
                      </label>
                      <div className="flex gap-1">
                        <select
                          className="flex-grow border border-slate-300 rounded-lg p-2.5 text-sm"
                          value={form.degree}
                          onChange={(e) =>
                            handleChange("degree", e.target.value)
                          }
                        >
                          <option>Select Degree</option>
                          <option>MBBS</option>
                          <option>MD</option>
                        </select>
                        <button
                          type="button"
                          className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200 text-blue-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Specialization
                      </label>
                      <div className="flex gap-1">
                        <select
                          className="flex-grow border border-slate-300 rounded-lg p-2.5 text-sm"
                          value={form.specialization}
                          onChange={(e) =>
                            handleChange("specialization", e.target.value)
                          }
                        >
                          <option>Select</option>
                        </select>
                        <button
                          type="button"
                          className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200 text-blue-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

               

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Hospital Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Clinic Address
                    </label>
                    <textarea
                      rows="2"
                      value={form.clinicAddress}
                      onChange={(e) =>
                        handleChange("clinicAddress", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                    ></textarea>
                  </div>
                </div>

                {/* Section 2: Contact & Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-blue-900 uppercase border-b border-slate-100 pb-2">
                    Contact & Personal
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Mobile No
                      </label>
                      <input
                        type="text"
                        value={form.mobile}
                        onChange={(e) => handleChange("mobile", e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Phone (Clinic)
                      </label>
                      <input
                        type="text"
                        value={form.clinicPhone}
                        onChange={(e) =>
                          handleChange("clinicPhone", e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Email ID
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="doctor@example.com"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={form.dob}
                        onChange={(e) => handleChange("dob", e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Portal Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute right-3 top-2.5 text-slate-400"
                        size={16}
                      />
                      <input
                        type="password"
                        placeholder="Create password"
                        value={form.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Status:
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={form.status === "TAGGED"}
                          onChange={() => handleChange("status", "TAGGED")}
                          className="w-4 h-4 text-blue-600"
                        />{" "}
                        Tagged
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={form.status === "UNTAGGED"}
                          onChange={() => handleChange("status", "UNTAGGED")}
                          className="w-4 h-4 text-blue-600"
                          defaultChecked
                        />{" "}
                        UnTagged
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Form Footer Action */}
              <div className="pt-6 border-t border-slate-100 flex justify-center">
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-12 rounded-lg shadow-md flex items-center gap-2 transition-transform active:scale-95"
                onClick={handleSubmit}>
                  <Save size={20} /> Save Doctor Registration
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <footer className="bg-blue-900 text-white text-xs py-3 text-center">
        © 2026 Accurate Diagnostic Center. All rights reserved.
      </footer>
    </div>
  );
};

export default NewDoctor;
