import { Printer, Building, Phone, ShieldCheck, Search, RotateCcw } from "lucide-react";
import Navigation from "../Navigation";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { getAllPanels } from "../../api/panelApi";
import Sidebar from "../Sidebar";

const AllPanel = () => {
  const navigate = useNavigate();

  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Search States
  const [filters, setFilters] = useState({
    name: "",
    mobile: "",
    email: "",
    status: "all",
  });

  useEffect(() => {
    const fetchPanels = async () => {
      setLoading(true);
      try {
        const res = await getAllPanels();
        // Assuming res.data.data contains the FULL array of panels
        setPanels(res.data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPanels();
  }, []);

  /**
   * GLOBAL SEARCH LOGIC
   * We use useMemo to filter the entire 'panels' array first. 
   * This ensures we are searching through every record regardless of the current page.
   */
  const allFilteredResults = useMemo(() => {
    return panels.filter((panel) => {
      const matchesName = panel.name?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesMobile = panel.contact?.mobile?.includes(filters.mobile);
      const matchesEmail = panel.contact?.email?.toLowerCase().includes(filters.email.toLowerCase());
      const matchesStatus = 
        filters.status === "all" ? true :
        filters.status === "active" ? panel.isActive === true :
        panel.isActive === false;

      return matchesName && matchesMobile && matchesEmail && matchesStatus;
    });
  }, [filters, panels]);

  // Derived Pagination Values
  const totalRecords = allFilteredResults.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  
  // Slice the filtered results for the current page
  const currentTableData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return allFilteredResults.slice(startIndex, startIndex + itemsPerPage);
  }, [allFilteredResults, page, itemsPerPage]);

  // Ensure we don't stay on a page that no longer exists after filtering
  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [allFilteredResults, page, totalPages]);

  const resetFilters = () => {
    setFilters({ name: "", mobile: "", email: "", status: "all" });
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Hospital / Clinic Panel List
            </h1>
            <button
              onClick={() => navigate("/newPanel")}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition active:scale-95 shadow-md shadow-green-200"
            >
              <Printer size={18} /> Add New Panel
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Search size={18} /> <span>SEARCH ALL RECORDS ({totalRecords})</span>
              </div>
              {totalRecords < panels.length && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                  FILTERS ACTIVE
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Panel Name</label>
                <input
                  type="text"
                  placeholder="Global name search..."
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Mobile</label>
                <input
                  type="text"
                  placeholder="Global mobile search..."
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.mobile}
                  onChange={(e) => setFilters({ ...filters, mobile: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Email</label>
                <input
                  type="text"
                  placeholder="Global email search..."
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.email}
                  onChange={(e) => setFilters({ ...filters, email: e.target.value })}
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
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center justify-center gap-2 w-full text-slate-600 hover:text-red-600 font-bold py-2 px-4 text-sm transition-colors border border-transparent hover:border-red-100 rounded-md"
                >
                  <RotateCcw size={16} /> Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden relative">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white">
                <tr className="text-[11px] uppercase tracking-wider">
                  <th className="p-4 text-left font-bold">Hospital Name</th>
                  <th className="p-4 font-bold text-center">Type</th>
                  <th className="p-4 font-bold text-center">Mobile</th>
                  <th className="p-4 font-bold text-center">Email</th>
                  <th className="p-4 font-bold text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-medium">Fetching global database...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentTableData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-500 font-medium italic">
                      No matches found in the entire list.
                    </td>
                  </tr>
                ) : (
                  currentTableData.map((panel) => (
                    <tr key={panel._id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-2 rounded-lg text-blue-900">
                            <Building size={16} />
                          </div>
                          {panel.name}
                        </div>
                      </td>
                      <td className="p-4 text-center text-slate-600 font-medium uppercase text-[12px]">
                        {panel.organizationType || "-"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-700 font-mono">
                          <Phone size={14} className="text-slate-400" />
                          {panel.contact?.mobile}
                        </div>
                      </td>
                      <td className="p-4 text-center text-slate-600 font-medium">
                        {panel.contact?.email || "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          {panel.isActive ? (
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 border border-emerald-200 shadow-sm">
                              <ShieldCheck size={12} /> ACTIVE
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black border border-red-200 uppercase shadow-sm">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white border-t gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Showing <strong>{currentTableData.length}</strong> of <strong>{totalRecords}</strong> results</span>
                {filters.name || filters.mobile || filters.email ? (
                  <span className="text-blue-600 font-medium">(Filtered from {panels.length})</span>
                ) : null}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Rows:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="border rounded px-2 py-1 text-xs font-bold bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {[10, 20, 50, 100].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-semibold transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex items-center px-4 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm font-bold">
                    {page} / {totalPages}
                  </div>

                  <button
                    disabled={page === totalPages || loading}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-blue-900 text-white rounded shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 text-sm font-semibold transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllPanel;