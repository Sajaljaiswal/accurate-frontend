import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import Sidebar from '../Sidebar';
import { Printer, Edit, CreditCard, Loader2 } from 'lucide-react';
import { getAllPatients } from "../../api/patientApi";
import { useNavigate } from 'react-router-dom';

const PatientReports = () => {
      const navigate = useNavigate();
  
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Fetch live data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllPatients(page); // Assuming your API supports pagination
        // Adjust based on your actual API response structure
        const patientData = res.data.data || res.data; 
        setPatients(patientData);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching patient reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  // Updated Headers as per your request
  const headers = [
    "Reg. no.", 
    "Time", 
    "Patient", 
    "Referred by", 
    "Tests", 
    "Status", 
    "Actions"
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "text-[10px] font-bold px-2 py-0.5 rounded border uppercase";
    switch (status) {
      case "PAID": return `${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200`;
      case "PARTIAL": return `${baseClasses} bg-pink-50 text-pink-700 border-pink-200`;
      case "UNPAID": return `${baseClasses} bg-red-50 text-red-700 border-red-200`;
      default: return `${baseClasses} bg-gray-50 text-gray-700 border-gray-200`;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navigation />
        
        <main className="p-4 md:p-6 bg-slate-100 min-h-screen">
          <div className="max-w-[1600px] mx-auto">
            
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Patient Reports</h1>
                <p className="text-sm text-red-600 font-semibold tracking-wide uppercase">
                  Total Patients Found: {patients.length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white text-[11px] uppercase tracking-wider">
                      {headers.map((header, index) => (
                        <th key={index} className="p-4 border-r border-blue-800 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[13px] divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={headers.length} className="p-20 text-center">
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <Loader2 className="animate-spin" size={32} />
                            <span>Fetching live reports...</span>
                          </div>
                        </td>
                      </tr>
                    ) : patients.length === 0 ? (
                      <tr><td colSpan={headers.length} className="p-10 text-center text-slate-500">No records found</td></tr>
                    ) : (
                      patients.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                          {/* Reg. No. */}
                          <td className="p-4 font-medium text-blue-700">{p.registrationNumber}</td>
                          
                          {/* Time */}
                          <td className="p-4 text-slate-500 font-mono">
                            {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </td>
                          
                          {/* Patient */}
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{p.title} {p.firstName}</div>
                            <div className="text-[11px] text-slate-400">{p.gender} / {p.age} Y</div>
                          </td>
                          
                          {/* Referred by */}
                          <td className="p-4 text-slate-600 font-medium">
                            {p.referredBy || "Self"}
                          </td>
                          
                          {/* Tests */}
                          <td className="p-4">
                            <div className="max-w-[250px] truncate text-slate-600 font-medium" title={p.tests?.map(t => t.name).join(', ')}>
                              {p.tests?.map(t => t.name).join(', ') || "-"}
                            </div>
                            <div className="text-[10px] font-bold text-blue-600 uppercase mt-0.5">
                              Items: {p.tests?.length || 0}
                            </div>
                          </td>
                          
                          {/* Status */}
                          <td className="p-4">
                            <span className={getStatusBadge(p.billing?.paymentStatus)}>
                              {p.billing?.paymentStatus || "UNPAID"}
                            </span>
                          </td>
                          
                          {/* Actions */}
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <button title="Print Receipt" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Printer size={16} />
                              </button>
                              <button title="Edit Patient" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" onClick={()=>{navigate("/labReports")}}>
                                <Edit size={16} />
                              </button>
                              
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Section */}
              <div className="flex justify-between items-center p-4 bg-slate-50 border-t border-slate-200">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border rounded-lg shadow-sm disabled:opacity-30 hover:bg-gray-50 transition-all active:scale-95"
                >
                  PREVIOUS
                </button>
                <span className="text-xs font-bold text-slate-400 tracking-widest">
                  PAGE {page} OF {totalPages}
                </span>
                <button
                  disabled={page === totalPages || loading}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border rounded-lg shadow-sm disabled:opacity-30 hover:bg-gray-50 transition-all active:scale-95"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientReports;