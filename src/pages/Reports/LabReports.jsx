import React, { useState } from "react";
import {
  Printer,
  ChevronDown,
  Edit,
  Save,
  CheckCircle,
  FileText,
  Clock,
  Calendar,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navigation from "../Navigation";

const LabReports = () => {
  const navigate = useNavigate();

  const [testValue, setTestValue] = useState("230");

  return (
    <div className=" flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navigation />
        <div>
          <div className="min-h-screen bg-white text-slate-800 font-sans p-4">
            {/* Top Header Bar */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-slate-700">
                  Lab report
                </h1>
                <div className="flex gap-2 mt-1">
                  <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 font-bold rounded">
                    Reg no. 1002 | L1
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 rounded p-1">
                  <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded shadow-sm">
                    Go to
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-slate-600 border-x border-slate-200">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-slate-600">
                    View
                  </button>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2 mb-4">
              <span className="bg-emerald-500 text-white text-[11px] px-2 py-1 rounded font-medium flex items-center gap-1">
                <CheckCircle size={12} /> Signed off
              </span>
              <span className="bg-emerald-500 text-white text-[11px] px-2 py-1 rounded font-medium">
                Report ready sms sent
              </span>
            </div>

            {/* Patient Info Card */}
            <div className="border border-slate-300 rounded overflow-hidden mb-4">
              <div className="grid grid-cols-2 text-sm divide-x divide-slate-200">
                <div className="p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient Name:</span>{" "}
                    <span className="font-medium">Mrs. Sim</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Age / Sex:</span>{" "}
                    <span className="font-medium">24 YRS / F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Referred By:</span>{" "}
                    <span className="font-medium">Self</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reg. no.</span>{" "}
                    <span className="font-medium">1002</span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Registered on:</span>
                    <span className="font-medium flex items-center gap-2">
                      <Edit size={12} className="text-slate-400" /> 27/12/2025
                      11:40 AM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Collected on:</span>
                    <div className="flex gap-1 border rounded px-1 text-xs items-center">
                      <span>27-12-2025</span> <Calendar size={12} />{" "}
                      <span className="border-l pl-1">--:--</span>{" "}
                      <Clock size={12} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Received on:</span>
                    <div className="flex gap-1 border rounded px-1 text-xs items-center">
                      <span>27-12-2025</span> <Calendar size={12} />{" "}
                      <span className="border-l pl-1">--:--</span>{" "}
                      <Clock size={12} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Reported on:</span>
                    <div className="flex gap-1 border rounded px-1 text-xs items-center bg-slate-50">
                      <span>27-12-2025</span> <Calendar size={12} />{" "}
                      <span className="border-l pl-1">12:14</span>{" "}
                      <Clock size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Options */}
            <div className="flex items-center gap-2 mb-8 text-xs text-slate-600">
              <input
                type="checkbox"
                checked
                readOnly
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Print categories from new page (PDF only)</span>
              <button className="text-slate-400">ⓘ</button>
            </div>

            {/* Category Header */}
            <div className="text-center mb-6 relative">
              <h2 className="text-xl font-medium tracking-widest text-slate-700 uppercase">
                HAEMATOLOGY
              </h2>
              <div className="absolute right-0 top-0 flex gap-2">
                <button className="border px-2 py-1 rounded text-xs flex items-center gap-1 bg-white">
                  Reorder <ChevronDown size={14} />
                </button>
                <button className="text-slate-400">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="mb-6">
              <div className="grid grid-cols-12 border-y border-slate-800 text-[11px] font-bold uppercase py-2 mb-4">
                <div className="col-span-5">TEST</div>
                <div className="col-span-3 text-center">VALUE</div>
                <div className="col-span-2">UNIT</div>
                <div className="col-span-2">REFERENCE</div>
              </div>

              {/* Individual Test Row */}
              <div className="space-y-4">
                <div className="grid grid-cols-12 items-center text-sm">
                  <div className="col-span-5 flex items-center gap-2">
                    <Edit size={14} className="text-slate-400" />
                    <span className="font-medium">
                      Absolute Eosinophil Count
                    </span>
                  </div>
                  <div className="col-span-3 flex justify-center items-center gap-2">
                    <input
                      type="text"
                      className="w-24 border border-slate-300 rounded p-1.5 text-center focus:ring-1 focus:ring-blue-400 outline-none"
                      value={testValue}
                      onChange={(e) => setTestValue(e.target.value)}
                    />
                    <button className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      +
                    </button>
                  </div>
                  <div className="col-span-2 text-slate-600">cumm</div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Edit size={14} className="text-slate-400" />
                    <span className="font-bold">0 - 440</span>
                  </div>
                </div>

                {/* Test Action Row */}
                <div className="flex gap-4 ml-6">
                  {["Notes", "Remarks", "Advice"].map((item) => (
                    <button
                      key={item}
                      className="text-[11px] text-slate-500 flex items-center gap-1 border border-slate-200 rounded-full px-2 py-0.5 hover:bg-slate-50"
                    >
                      <Plus size={12} /> {item}
                    </button>
                  ))}
                  <div className="flex-1 flex justify-end gap-3 text-[10px] text-slate-600">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="rounded text-pink-500"
                      />{" "}
                      Print ready
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" className="rounded" /> Page break
                      after (PDF only)
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" className="rounded" /> Skip
                      interpretation
                    </label>
                  </div>
                </div>

                {/* Interpretation Box */}
                <div className="ml-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      Interpretation
                    </h4>
                    <button className="text-[10px] bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Edit size={10} /> Edit
                    </button>
                  </div>
                  <div className="bg-slate-50 p-3 rounded text-[11px] border border-slate-100">
                    <p className="font-bold mb-1">Physiological basis</p>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      The Absolute Eosinophil Count (AEC) is a measure of the
                      number of eosinophils, a type of white blood cell, in a
                      given volume of blood. The Absolute Eosinophil Count (AEC)
                      is calculated by multiplying the percentage of eosinophils
                      in the total white blood cell count by the total white
                      blood cell count.
                    </p>

                    <div className="grid grid-cols-2 border border-slate-200 divide-x">
                      <div className="p-2 bg-white">
                        <p className="font-bold border-b pb-1 mb-1">
                          Elevated AEC
                        </p>
                        <ul className="text-slate-500 space-y-0.5">
                          <li>Allergic Reactions</li>
                          <li>Parasitic Infections</li>
                          <li>Autoimmune Diseases</li>
                          <li>Eosinophilia</li>
                        </ul>
                      </div>
                      <div className="p-2 bg-white">
                        <p className="font-bold border-b pb-1 mb-1">Low AEC</p>
                        <ul className="text-slate-500 space-y-0.5">
                          <li>Acute Infections</li>
                          <li>Adrenal Insufficiency</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="font-bold">Comments</p>
                      <p className="text-slate-600 italic">
                        The AEC is typically assessed as part of a complete
                        blood count (CBC) with a differential. If your AEC is
                        outside the normal range, it's important to consult with
                        a healthcare provider to determine the underlying cause
                        and appropriate treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* More Details Textarea */}
            <div className="mt-8 border-t pt-4">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                More details
              </label>
              <textarea
                className="w-full h-24 border border-slate-200 rounded p-3 outline-none focus:ring-1 focus:ring-blue-200 bg-slate-50/30"
                placeholder="Enter additional clinical details here..."
              />
            </div>

            {/* Bottom Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <div className="flex gap-2">
                <div className="flex rounded overflow-hidden">
                  <button className="bg-blue-600 text-white px-6 py-2 text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
                    <CheckCircle size={16} /> Sign off
                  </button>
                  <button className="bg-blue-700 text-white px-2 border-l border-blue-500 hover:bg-blue-800">
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="bg-blue-50 text-blue-600 px-8 py-2 text-sm font-bold rounded flex items-center gap-2 hover:bg-blue-100 border border-blue-100">
                  <CheckCircle size={16} /> Final
                </button>
                <button className="bg-blue-50 text-blue-600 px-8 py-2 text-sm font-bold rounded flex items-center gap-2 hover:bg-blue-100 border border-blue-100">
                  <Save size={16} /> Save only
                </button>
              </div>
            </div>

            {/* Spacer for sticky footer */}
            <div className="h-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReports;
