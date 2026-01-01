import Navigation from "../Navigation";
import { useEffect, useState } from "react";
import { getAllTests } from "../../api/testApi";
import Sidebar from "../Sidebar";

const AllTest = () => {
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchTests = async () => {
      setLoadingTests(true);
      try {
        // Pass both page and limit to your API helper
        const res = await getAllTests(currentPage, itemsPerPage); 
        setTests(res.data.data);
        setTotalPages(res.data.pagination.pages);
        setTotalItems(res.data.pagination.totalItems);
      } catch (err) {
        console.error("Failed to fetch tests:", err);
      } finally {
        setLoadingTests(false);
      }
    };

    fetchTests();
  }, [currentPage, itemsPerPage]); // Re-fetch on page or limit change

  const handleLimitChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Diagnostic Test List</h1>
             
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-600">Rows per page:</label>
              <select 
                value={itemsPerPage} 
                onChange={handleLimitChange}
                className="border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-3 text-left">Test Name</th>
                  <th className="p-3 text-center">Category</th>
                  <th className="p-3 text-center">Price (₹)</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Created</th>
                </tr>
              </thead>
              <tbody>
                {loadingTests ? (
                  <tr><td colSpan="5" className="p-10 text-center text-blue-600 font-medium">Loading records...</td></tr>
                ) : tests.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-gray-400">No records found.</td></tr>
                ) : (
                  tests.map((test) => (
                    <tr key={test._id} className="border-b hover:bg-blue-50 transition-colors">
                      <td className="p-3 font-semibold text-blue-900">{test.name}</td>
                      <td className="p-3 text-center text-slate-600">{test.category?.name || "N/A"}</td>
                      <td className="p-3 text-center font-bold">₹{test.defaultPrice}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-black ${test.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {test.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3 text-center text-xs text-slate-400">
                        {new Date(test.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-600">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
             <span className="text-sm text-gray-500 mt-1">
                Showing {tests.length} of <strong>{totalItems}</strong> total tests
              </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1 || loadingTests}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-50 hover:bg-gray-100 text-sm font-semibold"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages || loadingTests}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-blue-900 text-white border border-blue-900 rounded shadow-sm disabled:opacity-50 hover:bg-blue-800 text-sm font-semibold"
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