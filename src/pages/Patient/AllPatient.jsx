import React, { useEffect, useState } from "react";
import { Filter, Search, ChevronDown, ChevronRight } from "lucide-react";
import Navigation from "../Navigation";
import { getAllPatients } from "../../api/patientApi";
import EditPatientModal from "./EditPatientModal";
import SettleBillingModal from "./SettleBillingModal";
import Sidebar from "../Sidebar";
import { printReceipt } from "../Register/RegisterUtils";

const getTodayLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

const AllPatient = () => {
  const statusColors = {
    fullPaid: "bg-[#00ff99] text-emerald-900",
    partialPaid: "bg-[#ffb6c1] text-pink-900",
    fullyUnpaid: "bg-[#ff3366] text-white",
    credit: "bg-[#f0fff0] text-green-800",
    settlement: "bg-[#00ff00] text-green-950",
    return: "bg-gray-100 text-gray-950",
  };

  const [showFilters, setShowFilters] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const [billingPatient, setBillingPatient] = useState(null);
  const [hoveredPatient, setHoveredPatient] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const [filters, setFilters] = useState({
    labNo: "",
    mobile: "",
    patientName: "",
    orderId: "",
    fromDate: getTodayLocal(),
    toDate: getTodayLocal(),
  });

 const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const limit = 5;

 const fetchPatients = async (pageToLoad = page) => {
  setLoading(true);
  try {

    const res = await getAllPatients({
      page: pageToLoad,
      limit,
      search: filters.patientName,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    });

    setPatients(res.data.data);
    setTotalPages(res.data.pagination.pages);
    setTotalRecords(res.data.pagination.totalItems);
  } catch (err) {
    console.error("Error fetching patients:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPatients(page);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    // fetchPatients();
  };


  const closeModal = () => {
    setIsEditOpen(false);
    setSelectedPatient(null);
  };

  const closeSettleModal = () => {
    setBillingPatient(null);
    setIsSettleOpen(false);
  };

  const handleEditClick = (p) => { setSelectedPatient(p); setIsEditOpen(true); };
  const handleSettleClick = (p) => { setBillingPatient(p); setIsSettleOpen(true); };

  const getRowColor = (paymentStatus) => {
    const ps = (paymentStatus || "").toString().toUpperCase();
    switch (ps) {
      case "PAID": return "bg-[#00ff99]";
      case "PARTIAL": return "bg-[#ffb6c1]";
      case "RETURN":
      case "UNPAID": return "bg-[#ff3366] text-white";
      default: return "bg-white";
    }
  };

  const headers = [
    "Date", "Lab No", "Order Id", "Reg No", "Patient Name", "Doctor",
    "Mobile", "Panel", "Service By", "Gross Amt", "Discount",
    "Net Amount", "Paid Amount", "Current Balance", "Discount Reason",
    "Edit Info", "Receipt Edit", "Settle ment"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen bg-slate-100 font-sans p-4 md:p-6">
            <div className="max-w-[1600px] mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">All Patients</h1>
                <p className="text-sm text-red-600 font-semibold uppercase tracking-wide">
                  Total Patients Found: {totalRecords || 0}
                </p>
              </div>
            </div>

            {/* Search Criteria Card */}
            <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div
                className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <Filter size={18} className="text-blue-600" />
                <h2 className="font-bold text-slate-700">Search Criteria</h2>
              </div>

              {showFilters && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Identification</label>
                        <div className="flex gap-2">
                          <select className="w-1/2 bg-slate-50 border border-slate-300 rounded p-2 text-sm">
                            <option>Lab No</option>
                          </select>
                          <input
                            type="text"
                            className="w-2/3 border border-slate-300 rounded p-2 text-sm"
                            placeholder="Enter ID..."
                            value={filters.labNo}
                            onChange={(e) => setFilters({ ...filters, labNo: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Mobile No</label>
                        <input
                          type="text"
                          placeholder="Enter No."
                          className="border border-slate-300 rounded p-2 text-sm"
                          value={filters.mobile}
                          onChange={(e) => setFilters({ ...filters, mobile: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Date Range</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="date"
                            className="border border-slate-300 rounded p-2 text-sm"
                            value={filters.fromDate}
                            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                          />
                          <span>-</span>
                          <input
                            type="date"
                            className="border border-slate-300 rounded p-2 text-sm"
                            value={filters.toDate}
                            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Patient Name</label>
                        <input
                          type="text"
                          className="border border-slate-300 rounded p-2 text-sm"
                          placeholder="Enter name..."
                          value={filters.patientName}
                          onChange={(e) => setFilters({ ...filters, patientName: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Column 4 */}
                    <div className="space-y-4 ml-24">
                      <div className="flex flex-col gap-1 ">
                        <label className="text-xs font-bold text-slate-500 uppercase">
                          Order ID
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="w-full border border-slate-300 rounded p-2 text-sm"
                            placeholder="Order ID"
                            value={filters.orderId}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                orderId: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">
                          Reg No.
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="w-full border border-slate-300 rounded p-2 text-sm"
                            placeholder="Reg No"
                            value={filters.orderId}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                orderId: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`${statusColors.fullPaid} text-[10px] font-bold px-2 py-1 rounded border border-emerald-200 uppercase`}
                      >
                        Full Paid
                      </span>
                      <span
                        className={`${statusColors.partialPaid} text-[10px] font-bold px-2 py-1 rounded border border-pink-200 uppercase`}
                      >
                        Partial Paid
                      </span>
                      <span
                        className={`${statusColors.fullyUnpaid} text-[10px] font-bold px-2 py-1 rounded border border-red-400 uppercase`}
                      >
                        Fully Unpaid
                      </span>
                      <span
                        className={`${statusColors.credit} text-[10px] font-bold px-2 py-1 rounded border border-slate-200 uppercase`}
                      >
                        Credit
                      </span>
                      <span
                        className={`${statusColors.return} text-[10px] font-bold px-2 py-1 rounded border border-slate-200 uppercase`}
                      >
                        Return
                      </span>
                    </div>

                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-6 rounded text-sm flex items-center gap-2"
                      onClick={handleSearch}
                    >
                      <Search size={14} /> Search Records
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white text-[10px] uppercase">
                      {headers.map((h, i) => (
                        <th key={i} className={`p-3 border-r border-blue-800 whitespace-nowrap ${h === "Patient Name" ? "sticky left-0 bg-blue-900 z-30" : ""}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[13px]">
                    {loading ? (
                      <tr><td colSpan={headers.length} className="p-6 text-center">Loading...</td></tr>
                    ) : patients.length === 0 ? (
                      <tr><td colSpan={headers.length} className="p-6 text-center">No patients found</td></tr>
                    ) : (
                      patients.map((p) => (
                        <tr
                          key={p._id}
                          className={`${getRowColor(p.billing?.paymentStatus)} border-b hover:brightness-95`}
                          onMouseEnter={(e) => {
                            setHoveredPatient(p);
                            setTooltipPos({ x: e.clientX + 15, y: e.clientY + 15 });
                          }}
                          onMouseLeave={() => setHoveredPatient(null)}
                        >
                          <td className="p-3">{new Date(p.createdAt).toLocaleString("en-IN")}</td>
                          <td className="p-3 font-mono">{p.labNumber}</td>
                          <td className="p-3">{p.orderId}</td>
                          <td className="p-3 text-center">{p.registrationNumber}</td>
                          <td className="p-3 font-bold sticky left-0 bg-inherit z-10">{p.title} {p.firstName} {p.age}Y</td>
                          <td className="p-3">{p.referredBy || "-"}</td>
                          <td className="p-3">{p.mobile}</td>
                          <td className="p-3 italic text-[11px]">{p.panel || "-"}</td>
                          <td className="p-3 italic text-[11px]">-</td>
                          <td className="p-3 font-bold">₹{p.billing?.grossTotal || 0}</td>
                          <td className="p-3">₹{p.billing?.discountAmount || 0}</td>
                          <td className="p-3 font-bold">₹{p.billing?.netAmount || 0}</td>
                          <td className="p-3">₹{p.billing?.cashReceived || 0}</td>
                          <td className="p-3 text-red-700 font-bold">₹{p.billing?.dueAmount || 0}</td>
                          <td className="p-3">{p.billing?.discountReason || "-"}</td>
                          <td className="p-3 text-center">
                            <button className="bg-blue-800 text-white px-2 py-0.5 rounded" onClick={() => handleEditClick(p)}>Edit</button>
                          </td>
                          <td className="p-3 text-center">
                            <button className="bg-blue-800 text-white px-2 py-0.5 rounded" onClick={() => {
                                  const patientCalculations = {
                                    grossTotal: p.billing?.grossTotal || 0,
                                    discountAmt: p.billing?.discountAmount || 0,
                                    discountAmount:
                                      p.billing?.discountAmount || 0, // for compatibility
                                    netAmount: p.billing?.netAmount || 0,
                                    cashReceived: p.billing?.cashReceived || 0,
                                    dueAmount: p.billing?.dueAmount || 0,
                                  };

                                  printReceipt(p, p.tests, patientCalculations);
                                }}
                              >
                              Receipt
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            <button className="bg-blue-800 text-white px-2 py-0.5 rounded" onClick={() => handleSettleClick(p)}>Settle</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 bg-white border-t mt-4 max-w-[1600px] mx-auto rounded-xl">
              <span className="text-sm text-gray-500">
                Showing {patients.length} of <strong>{totalRecords}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-50 hover:bg-gray-100 text-sm font-semibold"
                >
                  Previous
                </button>

                <div className="flex items-center px-4 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm font-bold">
                  {page} / {totalPages}
                </div>

                <button
                  disabled={page === totalPages || loading}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-4 py-2 bg-blue-900 text-white rounded shadow-sm disabled:opacity-50 hover:bg-blue-800 text-sm font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isEditOpen && <EditPatientModal patient={selectedPatient} onClose={closeModal} onSuccess={fetchPatients} />}
      {isSettleOpen && <SettleBillingModal patient={billingPatient} onClose={closeSettleModal} onSuccess={fetchPatients} />}
      
      {/* Tooltip for Tests */}
      {hoveredPatient && hoveredPatient.tests?.length > 0 && (
        <div 
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 max-w-xs"
          style={{ top: tooltipPos.y, left: tooltipPos.x }}
        >
          <ul className="space-y-1">
            {hoveredPatient.tests.map((t, idx) => (
              <li key={idx} className="flex justify-between gap-4">
                <span>{t.name}</span>
                <span>₹{t.price}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AllPatient;