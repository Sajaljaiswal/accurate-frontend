import React, { useEffect, useState } from "react";
import {
  Printer,
  Filter,
  Truck,
  Search,
} from "lucide-react";
import Navigation from "./Navigation";
import { getAllPatients } from "../api/patientApi";

const AllPatient = () => {
  const statusColors = {
    fullPaid: "bg-[#00ff99] text-emerald-900", // Green
    partialPaid: "bg-[#ffb6c1] text-pink-900", // Pink
    fullyUnpaid: "bg-[#ff3366] text-white", // Red
    credit: "bg-[#f0fff0] text-green-800", // Light Green/Cream
    settlement: "bg-[#00ff00] text-green-950", // Bright Green
  };

  const [patients, setPatients] = useState([]);
  console.log(patients, "all patients");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getAllPatients();
        setPatients(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const headers = [
    "Date",
    "Lab No",
    "MRN No",
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
    "PaidAmt",
    "Curr. Balance",
    "Discount Reason",
    "Edit Info",
    "Receipt Edit",
    "Settle ment",
    "Discount After Bill",
    "Full Paid",
    "Upload Doc",
  ];
  return (
    <div>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-700">
        <Navigation />

        <div className="min-h-screen bg-slate-100 font-sans p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Receipt Re-Print
              </h1>
              <p className="text-sm text-red-600 font-semibold uppercase tracking-wide">
                Total Patients Found: 25
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
                      <select className="w-1/3 bg-slate-50 border border-slate-300 rounded p-2 text-sm">
                        <option>Lab No</option>
                      </select>
                      <input
                        type="text"
                        className="w-2/3 border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter ID..."
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Mobile No
                    </label>
                    <input
                      type="text"
                      className="border border-slate-300 rounded p-2 text-sm"
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
                        defaultValue="2025-12-19"
                        className="w-1/2 border border-slate-300 rounded p-2 text-sm"
                      />
                      <span className="text-slate-400">-</span>
                      <input
                        type="date"
                        defaultValue="2025-12-19"
                        className="w-1/2 border border-slate-300 rounded p-2 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Phlebotomist
                    </label>
                    <select className="border border-slate-300 rounded p-2 text-sm bg-white">
                      <option>--Select--</option>
                    </select>
                  </div>
                </div>

                {/* Column 4 */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      className="border border-slate-300 rounded p-2 text-sm"
                      placeholder="Enter name..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Order ID / MRN
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="w-1/2 border border-slate-300 rounded p-2 text-sm"
                        placeholder="Order ID"
                      />
                      <input
                        type="text"
                        className="w-1/2 border border-slate-300 rounded p-2 text-sm"
                        placeholder="MRN"
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
                      <td colSpan={headers.length} className="p-6 text-center">
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
                    patients.map((p, index) => (
                      <tr
                        key={p._id}
                        className="bg-[#00ff99] border-b hover:brightness-95"
                      >
                        <td className="p-3">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-mono">{p.labNo || "-"}</td>
                        <td className="p-3">{p._id.slice(-6)}</td>
                        <td className="p-3">{p.orderId || "-"}</td>
                        <td className="p-3 text-center">{p.regNo || "-"}</td>

                        <td className="p-3 font-bold sticky left-0 bg-inherit z-10">
                          {p.firstName} {p.age ? `${p.age} Y` : ""}
                        </td>

                        <td className="p-3">{p.referredBy || "-"}</td>
                        <td className="p-3">{p.mobile}</td>
                        <td className="p-3 italic text-[11px]">
                          {p.panel || "-"}
                        </td>

                        <td className="p-3 font-bold">
                          {p.billing?.grossTotal}
                        </td>
                        <td className="p-3">
                          {p.billing?.discountAmount || 0}
                        </td>
                        <td className="p-3 font-bold">
                          {p.billing?.netAmount}
                        </td>
                        <td className="p-3">{p.billing?.netAmount}</td>
                        <td className="p-3 text-red-700 font-bold">0</td>

                        <td className="p-3">-</td>
                       

                        <td className="p-3 italic">-</td>

                        <td className="p-3 text-center">
                          <button>Edit</button>
                        </td>

                        <td className="p-3 text-center">
                          <button>Receipt</button>
                        </td>

                        <td className="p-3 text-center">
                          <button className="bg-blue-800 text-white px-2 py-0.5 rounded">
                            Settle
                          </button>
                        </td>

                        <td className="p-3 text-center">0</td>
                        <td className="p-3 text-center font-bold">YES</td>
                        <td className="p-3 text-center">Upload</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <footer className="bg-blue-900 text-white text-xs py-3 text-center">
          © 2026 Accurate Diagnostic Center. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AllPatient;
