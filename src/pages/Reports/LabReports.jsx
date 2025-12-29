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
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Create the Reference
  const reportRef = useRef();

  // 2. Setup the Print Function
  const handlePrint = useReactToPrint({
    contentRef: reportRef, // Note: newer versions of react-to-print use contentRef
    documentTitle: `Report_${patient?.firstName || "Patient"}`,
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/patients/${id}`);
        setPatient(res.data.data);
      } catch (err) {
        console.error("Error fetching patient:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [id]);

  const handleValueChange = (testId, newValue) => {
    const updatedTests = patient.tests.map((t) =>
      t.testId === testId ? { ...t, resultValue: newValue } : t
    );
    setPatient({ ...patient, tests: updatedTests });
  };

  const handleSaveResults = async () => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/patients/${id}/results`, {
        tests: patient.tests 
      });
      alert("Results saved successfully! ✅");
    } catch (err) {
      alert("Failed to save results");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navigation />
        
        {/* --- UI EDITOR VIEW (What you see on screen) --- */}
        <div className="p-8 pb-32">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit Lab Results</h1>
            <div className="flex gap-2">
               <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded">
                 <Printer size={18} /> Print Report
               </button>
               <button onClick={handleSaveResults} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
                 <Save size={18} /> {saving ? "Saving..." : "Save"}
               </button>
            </div>
          </div>

          {/* Editor Table */}
          <div className="bg-white rounded-lg shadow border">
            {patient.tests.map((test) => (
              <div key={test.testId} className="grid grid-cols-4 p-4 border-b items-center">
                <span className="font-semibold">{test.name}</span>
                <input 
                  className="border p-2 rounded w-32 text-center"
                  value={test.resultValue} 
                  onChange={(e) => handleValueChange(test.testId, e.target.value)}
                />
                <span className="text-gray-500">{test.unit}</span>
                <span className="text-sm">Ref: {test.referenceRange}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- PRINTABLE TEMPLATE (Hidden from screen, seen by Printer) --- */}
        <div style={{ display: "none" }}>
          <div ref={reportRef} className="p-10 text-black font-serif">
            {/* Professional Letterhead */}
            <div className="text-center border-b-2 border-black pb-4 mb-6">
              <h1 className="text-3xl font-bold uppercase">Accurate Diagnostic Center</h1>
              <p>123 Medical Lane, Healthcare City | Tel: +91 9876543210</p>
            </div>

            {/* Patient Header for Print */}
            <div className="grid grid-cols-2 gap-4 mb-8 border p-4 rounded">
              <div>
                <p><strong>Patient:</strong> {patient.title} {patient.firstName}</p>
                <p><strong>Age/Sex:</strong> {patient.age}Y / {patient.gender}</p>
              </div>
              <div className="text-right">
                <p><strong>Reg No:</strong> {patient.registrationNumber}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Clean Table for Print */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="py-2">Test Name</th>
                  <th className="py-2">Result</th>
                  <th className="py-2">Unit</th>
                  <th className="py-2">Reference Range</th>
                </tr>
              </thead>
              <tbody>
                {patient.tests.map((test) => (
                  <tr key={test.testId} className="border-b">
                    <td className="py-3 font-medium">{test.name}</td>
                    <td className="py-3 font-bold">{test.resultValue || "N/A"}</td>
                    <td className="py-3">{test.unit}</td>
                    <td className="py-3">{test.referenceRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="mt-20 flex justify-between">
              <div className="text-center">
                <div className="w-32 border-t border-black mt-10">Lab Technician</div>
              </div>
              <div className="text-center">
                <div className="w-32 border-t border-black mt-10">Pathologist</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LabReports;