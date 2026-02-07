import React, { useCallback, useEffect, useState } from "react";
import { Printer, Edit, Loader2 } from "lucide-react";
import { getAllPatients } from "../../api/patientApi";
import { useNavigate } from "react-router-dom";
import SearchCriteria from "../../commom/SearchCriteria";

const getTodayDate = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

const CommonPatientReports = ({ title, testType }) => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    labNo: "",
    mobile: "",
    fromDate: getTodayDate(),
    toDate: getTodayDate(),
    patientName: "",
    orderId: "",
  });

  const statusColors = {
    Pending: "bg-rose-50 text-rose-700 border-rose-200",
    Partial: "bg-amber-50 text-amber-700 border-amber-200",
    Done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllPatients({
        page,
        limit: itemsPerPage,
        ...filters,
        testType,
      });

      setPatients(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
      setTotalRecords(res.data.pagination?.totalItems || 0);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  }, [page, filters, testType, itemsPerPage]);

  useEffect(() => {
    fetchData(page);
  }, [fetchData]);

  const handleSearch = () => {
    setPage(1); // Reset to first page on new search
    fetchData();
  };
  const headers = [
    "Reg. no.",
    "Time",
    "Patient",
    "Referred by",
    "Tests",
    "Print Status", // Updated Header Name
    "Actions",
  ];

  // Helper to calculate print status based on tests array
  const getPrintStatus = (tests = []) => {
    if (tests.length === 0)
      return {
        label: "NO TESTS",
        style: "bg-gray-50 text-gray-500 border-gray-200",
      };

    const totalTests = tests.length;
    const printedCount = tests.filter((t) => t.isPrinted).length;

    const base = "text-[10px] font-bold px-2 py-0.5 rounded border uppercase";

    if (printedCount === totalTests) {
      return {
        label: "DONE",
        style: `${base} bg-emerald-50 text-emerald-700 border-emerald-200`,
      };
    } else if (printedCount > 0) {
      return {
        label: "PARTIAL",
        style: `${base} bg-amber-50 text-amber-700 border-amber-200`,
      };
    } else {
      return {
        label: "PENDING",
        style: `${base} bg-rose-50 text-rose-700 border-rose-200`,
      };
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-red-600 font-semibold uppercase">
          Total Patients Found: {totalRecords}
        </p>
      </div>

      <SearchCriteria
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
        statusColors={statusColors}
        onSearch={handleSearch}
      />

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
                patients.map((p) => {
                  // Calculate status for each patient row
                  const printStatus = getPrintStatus(p.tests);

                  return (
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
                          .join(", ") || "No tests"}
                      </td>

                      <td className="p-4 cursor-pointer" onClick={() => navigate(`/lab-report/${p._id}`)}>
                        <span className={printStatus.style} >
                          {printStatus.label}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI remains same */}
        <div className="flex justify-between items-center p-4 bg-slate-50 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Showing {patients.length} of {totalRecords}
          </div>
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
              className="px-4 py-2 text-xs font-bold border rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              PREVIOUS
            </button>
            <div className="flex gap-1">
              {/* Optional: Add numbered page buttons here */}
            </div>
            <button
              disabled={page === totalPages || loading}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 text-xs font-bold border rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonPatientReports;
