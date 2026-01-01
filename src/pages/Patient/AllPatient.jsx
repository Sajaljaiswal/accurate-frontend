import React, { useEffect, useState } from "react";
import { Filter,  Search } from "lucide-react";
import Navigation from "../Navigation";
import { getAllPatients } from "../../api/patientApi";
import EditPatientModal from "./EditPatientModal";
import SettleBillingModal from "./SettleBillingModal";
import Sidebar from "../Sidebar";

const AllPatient = () => {
  const statusColors = {
    fullPaid: "bg-[#00ff99] text-emerald-900", // Green
    partialPaid: "bg-[#ffb6c1] text-pink-900", // Pink
    fullyUnpaid: "bg-[#ff3366] text-white", // Red
    credit: "bg-[#f0fff0] text-green-800", // Light Green/Cream
    settlement: "bg-[#00ff00] text-green-950", // Bright Green
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const [billingPatient, setBillingPatient] = useState(null);
  const [hoveredPatient, setHoveredPatient] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    labNo: "",
    mobile: "",
    patientName: "",
    orderId: "",
    fromDate: "",
    toDate: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setIsEditOpen(true);
  };

  const closeModal = () => {
    setIsEditOpen(false);
    setSelectedPatient(null);
  };

  const handleSettleClick = (patient) => {
    setBillingPatient(patient);
    setIsSettleOpen(true);
  };

  const closeSettleModal = () => {
    setBillingPatient(null);
    setIsSettleOpen(false);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await getAllPatients({
          page,
          limit,
          search: filters.patientName,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
        });

        setPatients(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [page, filters]);

  const getRowColor = (paymentStatus) => {
    const ps = (paymentStatus || "").toString().toUpperCase();
    switch (ps) {
      case "PAID":
        return "bg-[#00ff99]"; // green
      case "PARTIAL":
        return "bg-[#ffb6c1]"; // light pink
      case "UNPAID":
        return "bg-[#ff3366] text-white"; // red
      default:
        return "bg-white";
    }
  };

  const headers = [
    "Date",
    "Lab No",
    // "MRN No",
    "Order Id",
    "Reg No",
    "Patient Name",
    "Doctor",
    "Mobile",
    "Panel",
    "Service By",
    "Gross Amt",
    "Disc.",
    "NetAmt",
    "UnpaidAmt",
    "Discount Reason",
    "Edit Info",
    "Receipt Edit",
    "Settle ment",
  ];

  const filteredPatients = patients.filter((p) => {
    console.log("Filtering patient:", p);
    const createdDate = new Date(p.createdAt);

    const matchesLab =
      !filters.labNo ||
      p.labNumber?.toLowerCase().includes(filters.labNo.toLowerCase());

    const matchesMobile = !filters.mobile || p.mobile?.includes(filters.mobile);

    const matchesName =
      !filters.patientName ||
      `${p.firstName}`
        .toLowerCase()
        .includes(filters.patientName.toLowerCase());

    const matchesOrder =
      !filters.orderId ||
      p.orderId?.toLowerCase().includes(filters.orderId.toLowerCase()) ||
      p._id?.slice(-6).includes(filters.orderId);

    const matchesFromDate =
      !filters.fromDate || createdDate >= new Date(filters.fromDate);

    const matchesToDate =
      !filters.toDate || createdDate <= new Date(filters.toDate + "T23:59:59");

    return (
      matchesLab &&
      matchesMobile &&
      matchesName &&
      matchesOrder &&
      matchesFromDate &&
      matchesToDate
    );
  });

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
                  Receipt Re-Print
                </h1>
                <p className="text-sm text-red-600 font-semibold uppercase tracking-wide">
                  Total Patients Found: {filteredPatients.length}
                </p>
              </div>
            </div>

            {/* Search Criteria Card */}
            <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2">
                <Filter size={18} className="text-blue-600" />
                <h2 className="font-bold text-slate-700">Search Criteria</h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Identification
                      </label>
                      <div className="flex gap-2">
                        <select className="w-1/2 bg-slate-50 border border-slate-300 rounded p-2 text-sm">
                          <option>Lab No</option>
                        </select>
                        <input
                          type="text"
                          className="w-2/3 border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Enter ID..."
                          value={filters.labNo}
                          onChange={(e) =>
                            setFilters({ ...filters, labNo: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Mobile No
                      </label>
                      <input
                        type="text"
                        placeholder="Enter No."
                        className="border border-slate-300 rounded p-2 text-sm"
                        value={filters.mobile}
                        onChange={(e) =>
                          setFilters({ ...filters, mobile: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Date Range (From - To)
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="date"
                          className="border border-slate-300 rounded p-2 text-sm"
                          value={filters.fromDate}
                          onChange={(e) =>
                            setFilters({ ...filters, fromDate: e.target.value })
                          }
                        />
                        <span className="text-slate-400">-</span>
                        <input
                          type="date"
                          className="border border-slate-300 rounded p-2 text-sm"
                          value={filters.toDate}
                          onChange={(e) =>
                            setFilters({ ...filters, toDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        className="border border-slate-300 rounded p-2 text-sm"
                        placeholder="Enter name..."
                        value={filters.patientName}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            patientName: e.target.value,
                          })
                        }
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
                            setFilters({ ...filters, orderId: e.target.value })
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
                            setFilters({ ...filters, orderId: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Legends & Action Bar */}
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
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-6 rounded text-sm shadow-sm flex items-center gap-2">
                      <Search size={14} /> Search Records
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Table Card */}
            <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white text-[10px] uppercase tracking-tighter">
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className={`p-3 border-r border-blue-800 whitespace-nowrap min-w-[120px] ${
                            header === "Patient Name"
                              ? "sticky left-0 bg-blue-900 z-30 shadow-[2px_0_5px_rgba(0,0,0,0.3)]"
                              : ""
                          }`}
                        >
                          {header}
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
                          Loading patients...
                        </td>
                      </tr>
                    ) : patients.length === 0 ? (
                      <tr>
                        <td
                          colSpan={headers.length}
                          className="p-6 text-center text-gray-500"
                        >
                          No patients found
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((p) => {
                        const paymentStatus = p.billing?.paymentStatus;

                        return (
                          <tr
                            key={p._id}
                            className={`${getRowColor(
                              paymentStatus
                            )} border-b hover:brightness-95 relative`}
                            onMouseEnter={(e) => {
                              setHoveredPatient(p);
                              setTooltipPos({
                                x: e.clientX + 15,
                                y: e.clientY + 15,
                              });
                            }}
                            onMouseLeave={() => setHoveredPatient(null)}
                          >
                            {/* Date */}
                            <td className="p-3">
                              {new Date(p.createdAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </td>

                            {/* Lab No */}
                            <td className="p-3 font-mono">{p.labNumber}</td>

                            {/* MRN (use Mongo _id short) */}
                            {/* <td className="p-3">{p._id.slice(-6)}</td> */}

                            {/* Order ID */}
                            <td className="p-3">{p.orderId}</td>

                            {/* Registration No */}
                            <td className="p-3 text-center">
                              {p.registrationNumber}
                            </td>

                            {/* Patient Name */}
                            <td className="p-3 font-bold sticky left-0 bg-inherit z-10">
                              {p.title} {p.firstName}{" "}
                              {p.age ? `${p.age} Y` : ""}
                            </td>

                            {/* Doctor */}
                            <td className="p-3">{p.referredBy || "-"}</td>

                            {/* Mobile */}
                            <td className="p-3">{p.mobile}</td>

                            {/* Panel */}
                            <td className="p-3 italic text-[11px]">
                              {p.panel || "-"}
                            </td>

                            {/* Gross */}
                            <td className="p-3 font-bold">
                              ₹{p.billing?.grossTotal || 0}
                            </td>

                            {/* Discount */}
                            <td className="p-3">
                              ₹{p.billing?.discountAmount || 0}
                            </td>

                            {/* Net */}
                            <td className="p-3 font-bold">
                              ₹{p.billing?.netAmount || 0}
                            </td>

                            {/* Paid */}
                            <td className="p-3">
                              ₹{p.billing?.cashReceived || 0}
                            </td>

                            {/* Current Balance */}
                            <td className="p-3 text-red-700 font-bold">
                              ₹{p.billing?.dueAmount || 0}
                            </td>

                            {/* Discount Reason */}
                            <td className="p-3">
                              {p.billing?.discountReason || "-"}
                            </td>

                            {/* Edit */}
                            <td className="p-3 text-center">
                              <button
                                className="bg-blue-800 text-white px-2 py-0.5 rounded "
                                onClick={() => handleEditClick(p)}
                              >
                                Edit
                              </button>
                            </td>

                            {/* Receipt */}
                            <td className="p-3 text-center">
                              <button className="text-green-700 font-bold">
                                Receipt
                              </button>
                            </td>

                            {/* Settlement */}
                            <td className="p-3 text-center">
                              {paymentStatus !== "PAID" ? (
                                <button
                                  className="bg-blue-800 text-white px-2 py-0.5 rounded"
                                  onClick={() => handleSettleClick(p)}
                                >
                                  Settle
                                </button>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center p-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="font-bold">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>
        </div>
      
      {isEditOpen && (
        <EditPatientModal
          patient={selectedPatient}
          onClose={closeModal}
          onSuccess={() => {
            // reload patients after edit
            setPage(1);
          }}
        />
      )}
      {isSettleOpen && (
        <SettleBillingModal
          patient={billingPatient}
          onClose={closeSettleModal}
          onSuccess={() => {
            setPage(1); // refresh list
          }}
        />
      )}
      {hoveredPatient && hoveredPatient.tests?.length > 0 && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 max-w-xs"
          style={{
            top: tooltipPos.y,
            left: tooltipPos.x,
          }}
        >
          <ul className="space-y-1">
            {hoveredPatient.tests.map((t, idx) => (
              <li key={idx} className="flex justify-between gap-4">
                <span>{t.name}</span>
                {t.price !== undefined && (
                  <span className="text-gray-300">₹{t.price}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AllPatient;
