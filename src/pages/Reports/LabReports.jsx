import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { 
  Printer, ChevronDown, Edit, Save, CheckCircle, 
  Clock, Calendar, MoreHorizontal, Plus, Loader2 
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import Sidebar from "../Sidebar";
import Navigation from "../Navigation";

const LabReports = () => {
  const { id } = useParams(); // Get patient ID from URL
  console.log("LabReports component loaded with ID:", id);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch Patient Data on Load
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/patients/${id}`);
        setPatient(res.data.data);
        console.log("Fetched patient data:", res.data.data);
      } catch (err) {
        console.error("Error fetching patient:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [id]);

  // Create a reference to the printable area
  const reportRef = useRef(); // 1. Reference created

  const handlePrint = useReactToPrint({
    content: () => reportRef.current, // 2. Attached to the ref
    documentTitle: `Lab_Report_${patient?.registrationNumber || 'Export'}`,
  });
  const handleValueChange = (testId, newValue) => {
    const updatedTests = patient.tests.map((t) =>
      t.testId === testId ? { ...t, resultValue: newValue } : t
    );
    setPatient({ ...patient, tests: updatedTests });
  };

// Update this function in your LabReports.jsx
const handleSaveResults = async () => {
  if (!patient || !patient.tests) return;
  
  setSaving(true);
  try {
    // Check console to see if IDs are correct
    console.log("Sending tests to save:", patient.tests);

    const res = await axios.put(`http://localhost:5000/api/patients/${id}/results`, {
      tests: patient.tests // Send the updated tests array
    });

    if (res.data.success) {
      alert("Results saved successfully! ✅");
    }
  } catch (err) {
    console.error("Save Error Details:", err.response?.data);
    alert(err.response?.data?.message || "Failed to save results");
  } finally {
    setSaving(false);
  }
};
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (!patient) return <div className="p-10 text-center">Patient not found.</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navigation />
        <div className="min-h-screen bg-white text-slate-800 font-sans p-4">
          
          {/* Top Header Bar */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-700">Lab report</h1>
              <div className="flex gap-2 mt-1">
                <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 font-bold rounded">
                  Reg no. {patient.registrationNumber} | {patient.labNumber}
                </span>
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
          </div>

          {/* Patient Info Card */}
          <div className="border border-slate-300 rounded overflow-hidden mb-4">
            <div className="grid grid-cols-2 text-sm divide-x divide-slate-200">
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="font-medium">{patient.title} {patient.firstName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Age / Sex:</span>
                  <span className="font-medium">{patient.age} YRS / {patient.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Referred By:</span>
                  <span className="font-medium">{patient.referredBy || "Self"}</span>
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
                    <span>{new Date().toLocaleDateString()}</span> <Calendar size={12} />
                    <span className="border-l pl-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span> <Clock size={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Test Results Table */}
          <div className="mb-6">
            <div className="grid grid-cols-12 border-y border-slate-800 text-[11px] font-bold uppercase py-2 mb-4">
              <div className="col-span-5">TEST</div>
              <div className="col-span-3 text-center">VALUE</div>
              <div className="col-span-2">UNIT</div>
              <div className="col-span-2">REFERENCE</div>
            </div>

            {patient.tests.map((test) => (
              <div key={test.testId} className="space-y-4 mb-8 pb-4 border-b border-slate-50">
                <div className="grid grid-cols-12 items-center text-sm">
                  <div className="col-span-5 flex items-center gap-2">
                    <Edit size={14} className="text-slate-400" />
                    <span className="font-medium">{test.name}</span>
                  </div>
                  <div className="col-span-3 flex justify-center items-center gap-2">
                    <input
                      type="text"
                      className="w-24 border border-slate-300 rounded p-1.5 text-center focus:ring-1 focus:ring-blue-400 outline-none"
                      value={test.resultValue}
                      onChange={(e) => handleValueChange(test.testId, e.target.value)}
                    />
                  </div>
                  <span className="hidden print:block font-bold text-lg">{test.resultValue || '---'}</span>
                  <div className="col-span-2 text-slate-600">{test.unit}</div>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="font-bold">{test.referenceRange}</span>
                  </div>
                </div>
                
                {/* Actions per test */}
                <div className="flex gap-4 ml-6">
                  {["Notes", "Remarks", "Advice"].map((item) => (
                    <button key={item} className="text-[11px] text-slate-500 flex items-center gap-1 border border-slate-200 rounded-full px-2 py-0.5">
                      <Plus size={12} /> {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Sticky Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end items-center shadow-lg">
            <div className="flex gap-3">
              <button 
              onClick={handlePrint}
              className="bg-slate-800 text-white px-6 py-2 text-sm font-bold rounded flex items-center gap-2 hover:bg-slate-900"
            >
              <Printer size={16} /> Print PDF
            </button>
              <button 
                onClick={handleSaveResults}
                disabled={saving}
                className="bg-blue-600 text-white px-8 py-2 text-sm font-bold rounded flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-300"
              >
                <Save size={16} /> {saving ? "Saving..." : "Save only"}
              </button>
            </div>
          </div>
          <div className="h-24 print:hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default LabReports;