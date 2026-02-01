import React, { useState, useEffect, useMemo } from "react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import { Plus, GripVertical, Edit2, Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryModal from "./CategoryModal";
import { getAllCategories } from "../../api/categoryApi";

const TestCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // GLOBAL SEARCH LOGIC
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // PAGINATION LOGIC
  const totalRecords = filteredCategories.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  
  const currentTableData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, page, itemsPerPage]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleAddClick = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = (savedCategory) => {
    setCategories((prev) => {
      const exists = prev.find((cat) => cat._id === savedCategory._id);
      if (exists) {
        return prev.map((cat) => (cat._id === savedCategory._id ? savedCategory : cat));
      } else {
        return [...prev, savedCategory];
      }
    });
    handleCloseModal();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto bg-slate-100">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Test Categories
              </h1>
              <div className="flex items-center gap-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                  onClick={() => navigate("/addTest")}
                >
                  <Plus size={20} /> Add Test
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                  onClick={handleAddClick}
                >
                  <Plus size={20} /> Add Category
                </button>
              </div>
            </div>

            {/* Search Bar Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search categories by name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-blue-900 uppercase">
                    <th className="px-6 py-4 text-[11px] font-black tracking-widest w-24">Order</th>
                    <th className="px-6 py-4 text-[11px] font-black tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[11px] font-black tracking-widest text-center w-64">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[14px]">
                  {loading ? (
                    <tr><td colSpan="3" className="text-center py-10 text-slate-400">Loading...</td></tr>
                  ) : currentTableData.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-10 text-slate-400 italic">No matches found.</td></tr>
                  ) : (
                    currentTableData.map((category, index) => (
                      <tr key={category._id || category.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 text-slate-600">
                          <div className="flex items-center gap-3">
                            <GripVertical size={16} className="text-slate-300 cursor-grab" />
                            <span className="font-bold">{(page - 1) * itemsPerPage + index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">{category.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-8">
                            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold" onClick={() => handleEditClick(category)}>
                              <Edit2 size={16} /> Edit
                            </button>
                            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold" onClick={() => navigate("/lab", { state: { categoryId: category._id } })}>
                              <Eye size={18} /> View tests
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white border-t gap-4">
                <span className="text-sm text-slate-500">
                  Showing <strong>{currentTableData.length}</strong> of <strong>{totalRecords}</strong> categories
                </span>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Rows:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
                      className="border rounded-md px-2 py-1 text-xs font-bold bg-white"
                    >
                      {[10, 20, 50, 100].map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={page === 1 || loading}
                      onClick={() => setPage((prev) => prev - 1)}
                      className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-50 hover:bg-slate-50 text-sm font-semibold"
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
            </div>
          </div>
        </main>

        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCategory}
          categoryData={selectedCategory}
        />
      </div>
    </div>
  );
};

export default TestCategories;