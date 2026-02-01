import React, { useEffect, useState } from "react";
import Navigation from "../Navigation";
import { getAllPatients } from "../../api/patientApi";
import EditPatientModal from "./EditPatientModal";
import SettleBillingModal from "./SettleBillingModal";
import Sidebar from "../Sidebar";
import { printReceipt } from "../Register/RegisterUtils";
import { Copy } from "lucide-react";
import SearchCriteria from "../../commom/SearchCriteria";

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
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    labNo: "",
    mobile: "",
    patientName: "",
    orderId: "",
    panelName: "",
    doctorName: "",
    fromDate: getTodayLocal(),
    toDate: getTodayLocal(),
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPatients = async (pageToLoad = page) => {
    setLoading(true);
    try {
      const res = await getAllPatients({
        page: pageToLoad,
        limit: itemsPerPage,
        search: filters.patientName,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        labNo: filters.labNo,
        mobile: filters.mobile,
        orderId: filters.orderId,
        panelName: filters.panelName,   // ✅ Added
        doctorName: filters.doctorName,
      });

      console.log("Fetched patients:", res.data);

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
  }, [page, filters, itemsPerPage]);

  const handleSearch = () => {
    if(page !== 1) {
      setPage(1); // This will trigger the useEffect
    } else {
      fetchPatients(1); // Manually trigger if already on page 1
    }
  };

  const closeModal = () => {
    setIsEditOpen(false);
    setSelectedPatient(null);
  };

  const closeSettleModal = () => {
    setBillingPatient(null);
    setIsSettleOpen(false);
  };

  const handleEditClick = (p) => {
    setSelectedPatient(p);
    setIsEditOpen(true);
  };
  const handleSettleClick = (p) => {
    setBillingPatient(p);
    setIsSettleOpen(true);
  };

  const getRowColor = (paymentStatus) => {
    const ps = (paymentStatus || "").toString().toUpperCase();
    switch (ps) {
      case "PAID":
        return "bg-[#00ff99]";
      case "PARTIAL":
        return "bg-[#ffb6c1]";
      case "RETURN":
      case "UNPAID":
        return "bg-[#ff3366] text-white";
      default:
        return "bg-white";
    }
  };

  const headers = [
    "Date",
    "Lab No",
    "Order Id",
    "Reg No",
    "Patient Name",
    "Doctor",
    "Mobile",
    "Panel",
    "Service By",
    "Gross Amt",
    "Discount",
    "Net Amount",
    "Paid Amount",
    "Current Balance",
    "Discount Reason",
    "Edit Info",
    "Receipt Edit",
    "Settle ment",
  ];

  const copyText = async (text) => {
    if (!text) return;
    await navigator.clipboard.writeText(text.toString());
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen bg-slate-100 font-sans p-4 md:p-6">
            <div className="max-w-[1600px] mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  All Patients
                </h1>
                <p className="text-sm text-red-600 font-semibold uppercase tracking-wide">
                  Total Patients Found: {totalRecords || 0}
                </p>
              </div>
            </div>

            {/* Search Criteria Card */}
            <SearchCriteria
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              filters={filters}
              setFilters={setFilters}
              statusColors={statusColors}
              onSearch={handleSearch}
            />

            {/* Table */}
            <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white text-[10px] uppercase">
                      {headers.map((h, i) => (
                        <th
                          key={i}
                          className={`p-3 border-r border-blue-800 whitespace-nowrap ${
                            h === "Patient Name"
                              ? "sticky left-0 bg-blue-900 z-30"
                              : ""
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[13px]">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={headers.length}
                          className="p-6 text-center"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : patients.length === 0 ? (
                      <tr>
                        <td
                          colSpan={headers.length}
                          className="p-6 text-center"
                        >
                          No patients found
                        </td>
                      </tr>
                    ) : (
                      patients.map((p) => (
                        <tr
                          key={p._id}
                          className={`${getRowColor(
                            p.billing?.paymentStatus
                          )} border-b hover:brightness-95`}
                          onMouseEnter={(e) => {
                            setHoveredPatient(p);
                            setTooltipPos({
                              x: e.clientX + 15,
                              y: e.clientY + 15,
                            });
                          }}
                          onMouseLeave={() => setHoveredPatient(null)}
                        >
                          <td className="p-3">
                            {new Date(p.createdAt).toLocaleString("en-IN")}
                          </td>
                          <td className="p-3 flex items-center gap-1">
                            <span className="font-mono">{p.labNumber}</span>
                            <button
                              onClick={() => copyText(p.labNumber)}
                              title="Copy Lab No"
                              className="text-gray-500 hover:text-blue-600"
                            >
                              <Copy size={13} />
                            </button>
                          </td>
                          <td className="p-3">{p.orderId}</td>
                          <td className="p-3 text-center">
                            {p.registrationNumber}
                          </td>
                          <td className="p-3 font-bold sticky left-0 bg-inherit z-10">
                            {p.title} {p.firstName} {p.age}Y
                          </td>
                          <td className="p-3">{p.referredBy || "-"}</td>
                          <td className="p-3">{p.mobile}</td>
                          <td className="p-3 italic text-[11px]">
                            {p.panel || "-"}
                          </td>
                          <td className="p-3 italic text-[11px]">{p.createdBy || "-"}</td>
                          <td className="p-3 font-bold">
                            ₹{p.billing?.grossTotal || 0}
                          </td>
                          <td className="p-3">
                            ₹{p.billing?.discountAmount || 0}
                          </td>
                          <td className="p-3 font-bold">
                            ₹{p.billing?.netAmount || 0}
                          </td>
                          <td className="p-3">
                            ₹{p.billing?.cashReceived || 0}
                          </td>
                          <td className="p-3 text-red-700 font-bold">
                            ₹{p.billing?.dueAmount || 0}
                          </td>
                          <td className="p-3">
                            {p.billing?.discountReason || "-"}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              className="bg-blue-800 text-white px-2 py-0.5 rounded"
                              onClick={() => handleEditClick(p)}
                            >
                              Edit
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              className="bg-blue-800 text-white px-2 py-0.5 rounded"
                              onClick={() => {
                                const patientCalculations = {
                                  grossTotal: p.billing?.grossTotal || 0,
                                  discountAmt: p.billing?.discountAmount || 0,
                                  discountAmount: p.billing?.discountValue || 0, // for compatibility
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
                            <button
                              className="bg-blue-800 text-white px-2 py-0.5 rounded"
                              onClick={() => handleSettleClick(p)}
                            >
                              Settle
                            </button>
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
              <span className="text-sm text-gray-500">Showing
                 {patients.length} of <strong>{totalRecords}</strong>
              </span>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Rows:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value)); // ✅ FIX
                    setPage(1);
                  }}
                  className="border rounded px-2 py-1 text-xs font-bold bg-white"
                >
                  {[10, 20, 50, 100].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
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
      {isEditOpen && (
        <EditPatientModal
          patient={selectedPatient}
          onClose={closeModal}
          onSuccess={fetchPatients}
        />
      )}
      {isSettleOpen && (
        <SettleBillingModal
          patient={billingPatient}
          onClose={closeSettleModal}
          onSuccess={fetchPatients}
        />
      )}

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
