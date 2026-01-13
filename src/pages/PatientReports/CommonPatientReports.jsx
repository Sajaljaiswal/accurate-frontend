import React, { useEffect, useState } from "react";
import { Printer, Edit, Loader2 } from "lucide-react";
import { getAllPatients } from "../../api/patientApi";
import { useNavigate } from "react-router-dom";

const CommonPatientReports = ({ title, testType }) => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* Fetch + Filter */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllPatients(page);
        const allPatients = res.data.data || [];
        console.log(
          allPatients,
          "allPatientsallPatientsallPatientsallPatientsallPatientsallPatients"
        );
        setPatients(allPatients);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, testType]);

  const headers = [
    "Reg. no.",
    "Time",
    "Patient",
    "Referred by",
    "Tests",
    "Status",
    "Actions",
  ];

  const getStatusBadge = (status) => {
    const base = "text-[10px] font-bold px-2 py-0.5 rounded border uppercase";
    if (status === "PAID")
      return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
    if (status === "PARTIAL")
      return `${base} bg-pink-50 text-pink-700 border-pink-200`;
    if (status === "UNPAID")
      return `${base} bg-red-50 text-red-700 border-red-200`;
    return `${base} bg-gray-50 text-gray-700 border-gray-200`;
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-red-600 font-semibold uppercase">
          Total Patients Found: {patients.length}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white text-[11px] uppercase">
                {headers.map((h) => (
                  <th key={h} className="p-4 border-r border-blue-800">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-[13px] divide-y">
              {loading ? (
                <tr>
                  <td colSpan={headers.length} className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto" />
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="p-10 text-center">
                    No records found
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50">
                    <td className="p-4 font-medium text-blue-700">
                      {p.registrationNumber}
                    </td>

                    <td className="p-4 text-slate-500 font-mono">
                      {new Date(p.createdAt).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      <div className="font-bold">
                        {p.title} {p.firstName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {p.gender} / {p.age} Y
                      </div>
                    </td>

                    <td className="p-4">{p.referredBy || "Self"}</td>

                    <td className="p-4">
                      {p.tests
                        ?.filter((t) => t.name) 
                        .map((t) => t.name) 
                        .join(", ") || 
                        "No tests"}
                    </td>
                    <td className="p-4">
                      <span
                        className={getStatusBadge(p.billing?.paymentStatus)}
                      >
                        {p.billing?.paymentStatus || "UNPAID"}
                      </span>
                    </td>

                    <td className="p-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Printer size={16} />
                      </button>
                      <button
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded"
                        onClick={() => navigate(`/lab-report/${p._id}`)}
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 bg-slate-50 border-t">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 text-xs font-bold border rounded"
          >
            PREVIOUS
          </button>

          <span className="text-xs font-bold">
            PAGE {page} OF {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 text-xs font-bold border rounded"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonPatientReports;
