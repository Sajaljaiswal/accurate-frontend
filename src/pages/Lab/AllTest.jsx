import React, { useEffect, useState } from "react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import { getAllTests } from "../../api/testApi";
import { Search, Filter, RotateCcw } from "lucide-react";

const AllTest = () => {
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // active or inactive

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTests = async () => {
    setLoadingTests(true);
    try {
      // Pass pagination AND filters to the API
      const res = await getAllTests(
        currentPage,
        itemsPerPage,
        searchQuery,
        statusFilter
      );
      setTests(res.data.data);
      setTotalPages(res.data.pagination.pages);
      setTotalItems(res.data.pagination.totalItems);
    } catch (err) {
      console.error("Failed to fetch tests:", err);
    } finally {
      setLoadingTests(false);
    }
  };

  // Re-fetch when page, limit, or status changes
  useEffect(() => {
    fetchTests();
  }, [currentPage, itemsPerPage, statusFilter, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 on new search
    fetchTests();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Search Criteria Panel (Based on your image) */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="p-4 border-b flex items-center gap-2 text-blue-900 font-bold">
              <Filter size={18} />
              <span>Search Criteria</span>
            </div>

            <form onSubmit={handleSearch} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Test Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter test name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                 <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Category
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">All Categories</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Search size={16} /> Search Records
                  </button>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-md border transition-all"
                    title="Reset Filters"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Table Header Row */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Diagnostic Test List
              </h2>
              <p className="text-sm text-gray-500">
                Total {totalItems} tests found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Rows:
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value)); // ✅ FIX
                  setCurrentPage(1);
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
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-3 text-left">Test Name</th>
                  <th className="p-3 text-center">Category</th>
                  <th className="p-3 text-center">Price (₹)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingTests ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-10 text-center text-blue-600 animate-pulse"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : tests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400">
                      No matching records.
                    </td>
                  </tr>
                ) : (
                  tests.map((test) => (
                    <tr
                      key={test._id}
                      className="border-b hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-3 font-semibold text-blue-900">
                        {test.name}
                      </td>
                      <td className="p-3 text-center text-slate-600">
                        {test.category?.name || "N/A"}
                      </td>
                      <td className="p-3 text-center font-bold text-gray-700">
                        ₹{test.defaultPrice}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            test.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {test.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-500">
              Showing {tests.length} of <strong>{totalItems}</strong>
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1 || loadingTests}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-50 hover:bg-gray-100 text-sm font-semibold"
              >
                Previous
              </button>

              <div className="flex items-center px-4 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm font-bold">
                {currentPage} / {totalPages}
              </div>

              <button
                disabled={currentPage === totalPages || loadingTests}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 bg-blue-900 text-white rounded shadow-sm disabled:opacity-50 hover:bg-blue-800 text-sm font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllTest;
