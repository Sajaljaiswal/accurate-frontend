import { Printer, Eye, X, Search, RotateCcw, Phone } from "lucide-react";
import Navigation from "../Navigation";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { getAllDoctors } from "../../api/doctorApi";
import DoctorTestList from "./DoctorTestList";
import Sidebar from "../Sidebar";

const AllDoctor = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Search States
  const [filters, setFilters] = useState({
    name: "",
    clinic: "",
    mobile: "",
    status: "all",
  });

  // Modal States
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getAllDoctors({});
        setDoctors(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  /** * Global Search Logic: Filters the entire doctors list 
   */
  const filteredResults = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesName = doc.fullName?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesClinic = doc.clinicName?.toLowerCase().includes(filters.clinic.toLowerCase());
      const matchesMobile = doc.mobile?.includes(filters.mobile);
      const matchesStatus = 
        filters.status === "all" ? true : 
        (doc.status || "UNTAGGED") === filters.status;

      return matchesName && matchesClinic && matchesMobile && matchesStatus;
    });
  }, [filters, doctors]);

  // Pagination Logic
  const totalRecords = filteredResults.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  const currentTableData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredResults.slice(start, start + itemsPerPage);
  }, [filteredResults, page, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [filters]);

  const resetFilters = () => {
    setFilters({ name: "", clinic: "", mobile: "", status: "all" });
  };

  const openTestModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto bg-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Doctors Management</h1>
            <button
              onClick={() => navigate("/newDoctor")}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition active:scale-95 shadow-md shadow-green-200"
            >
              <Printer size={18} /> Add New Doctor
            </button>
          </div>

          {/* Search Criteria Section */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6">
            <div className="flex items-center gap-2 mb-4 text-blue-900 font-bold text-sm">
              <Search size={18} /> <span>SEARCH DOCTORS ({totalRecords})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Doctor Name</label>
                <input
                  type="text"
                  placeholder="Search name..."
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Clinic/Hospital</label>
                <input
                  type="text"
                  placeholder="Search clinic..."
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.clinic}
                  onChange={(e) => setFilters({ ...filters, clinic: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Mobile</label>
                <input
                  type="text"
                  placeholder="Search mobile..."
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.mobile}
                  onChange={(e) => setFilters({ ...filters, mobile: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
                <select
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="all">All Status</option>
                  <option value="TAGGED">Tagged</option>
                  <option value="UNTAGGED">Untagged</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center justify-center gap-2 w-full text-slate-600 hover:text-red-600 font-bold py-2 px-4 text-sm transition-colors border border-transparent hover:border-red-100 rounded-md"
                >
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Doctors Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white">
                <tr className="text-[11px] uppercase tracking-wider">
                  <th className="p-4 text-left font-bold">Doctor Name</th>
                  <th className="p-4 font-bold text-center">Mobile</th>
                  <th className="p-4 font-bold text-center">Clinic</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="6" className="p-10 text-center text-gray-500">Loading...</td></tr>
                ) : currentTableData.length === 0 ? (
                  <tr><td colSpan="6" className="p-10 text-center text-gray-500 italic">No doctors found matching criteria</td></tr>
                ) : (
                  currentTableData.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4 font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {doctor.fullName?.[0]}
                          </div>
                          {doctor.title} {doctor.fullName}
                        </div>
                      </td>
                      <td className="p-4 text-center text-slate-600 font-mono">
                         <div className="flex items-center justify-center gap-1">
                            <Phone size={12} className="text-slate-400" />
                            {doctor.mobile || "N/A"}
                         </div>
                      </td>
                      <td className="p-4 text-center text-gray-600 font-medium">{doctor.clinicName || "-"}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${doctor.status === "TAGGED" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                          {doctor.status || "UNTAGGED"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => openTestModal(doctor)} className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-blue-200 transition shadow-sm">
                          <Eye size={14} /> View Tests
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Footer */}
            <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white border-t gap-4">
              <span className="text-sm text-gray-500 font-medium">
                Showing {currentTableData.length} of <strong>{totalRecords}</strong>
              </span>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Rows:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
                    className="border rounded px-2 py-1 text-xs font-bold bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[10, 20, 50, 100].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-50 hover:bg-gray-50 text-sm font-semibold transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center px-4 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm font-bold">
                    {page} / {totalPages}
                  </div>
                  <button
                    disabled={page === totalPages || loading}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-blue-900 text-white rounded shadow-sm disabled:opacity-50 hover:bg-blue-800 text-sm font-semibold transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- MODAL FOR ASSIGNED TESTS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 border border-slate-200">
            <div className="bg-blue-900 p-5 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-bold">Assigned Diagnostic Tests</h2>
                <p className="text-xs text-blue-200 mt-1">Doctor: {selectedDoctor?.title} {selectedDoctor?.fullName}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"><X size={20} /></button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto bg-slate-50">
              <DoctorTestList doctorId={selectedDoctor?._id} />
            </div>
            <div className="bg-gray-100 p-4 border-t flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition shadow-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDoctor;