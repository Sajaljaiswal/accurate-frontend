import React, { useEffect, useState, useMemo } from "react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import { getAllTests } from "../../api/testApi";
import { Search, Filter, RotateCcw, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { getAllCategories } from "../../api/categoryApi";
import { Edit, Trash2, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteTest } from "../../api/testApi";
import { updateTest } from "../../api/testApi";
import JoditEditor from "jodit-react"; // Import Jodit

const AllTest = () => {
  const location = useLocation();
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [dbCategories, setDbCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(location.state?.categoryId || "");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); 
  const navigate = useNavigate();

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTests = async () => {
    setLoadingTests(true);
    try {
      const res = await getAllTests(currentPage, itemsPerPage, searchQuery, statusFilter, categoryFilter);
      setTests(res.data.data);
      setTotalPages(res.data.pagination.pages);
      setTotalItems(res.data.pagination.totalItems);
    } catch (err) {
      console.error("Failed to fetch tests:", err);
    } finally {
      setLoadingTests(false);
    }
  };

  const config = useMemo(() => ({
    readonly: false,
    placeholder: "Design your report template here...",
    height: 350,
    toolbarButtonSize: "middle",
  
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_as_html",
  
    // 🔥 IMPORTANT: disable cleaner
    cleanHTML: false,
  
    // Allow styling
    allowAttributes: {
      '*': ['style', 'class', 'cellspacing', 'cellpadding', 'border', 'align']
    },
  
    // Ensure formatting tags are preserved
    controls: {
      bold: {
        tags: ['strong', 'b']
      },
      italic: {
        tags: ['em', 'i']
      },
      underline: {
        tags: ['u']
      }
    },
  
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'fullsize'
    ],
  }), []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await getAllCategories();
        setDbCategories(res.data.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTests();
  }, [currentPage, itemsPerPage, statusFilter, searchQuery, categoryFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setCategoryFilter("");
    setCurrentPage(1);
  };

  const handleDelete = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await deleteTest(testId);
      fetchTests();
    } catch (err) {
      alert("Failed to delete test");
    }
  };

  const handleRangeChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...editingTest.referenceRanges];
    updated[index][name] = value;
    setEditingTest({ ...editingTest, referenceRanges: updated });
  };

  const addRangeRow = () => {
    setEditingTest({
      ...editingTest,
      referenceRanges: [...editingTest.referenceRanges, { gender: "BOTH", ageMin: 0, ageMax: 100, lowRange: "", highRange: "" }]
    });
  };

  const removeRangeRow = (index) => {
    const updated = editingTest.referenceRanges.filter((_, i) => i !== index);
    setEditingTest({ ...editingTest, referenceRanges: updated.length ? updated : editingTest.referenceRanges });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Search Criteria Panel */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2 cursor-pointer select-none" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <Filter size={18} className="text-blue-600" />
              <h2 className="font-bold text-slate-700">Search Criteria</h2>
            </div>
            <div className={`transition-all duration-300 overflow-hidden ${showFilters ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Test Name</label>
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Search..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                    <option value="">All Categories</option>
                    {dbCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                   <button onClick={resetFilters} className="p-2 text-gray-500 hover:bg-gray-100 rounded-md border transition-all"><RotateCcw size={18} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Diagnostic Test List</h2>
              <p className="text-sm text-gray-500">Total <span className="text-blue-600 font-bold">{totalItems}</span> found</p>
            </div>

            {/* Right Side: Action Group */}
            <div className="flex items-center gap-4">
              {/* Rows Selector */}
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Rows:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-slate-200 rounded-md px-2 py-1.5 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[10, 20, 50, 100].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Test Button */}
              <button
                type="button"
                onClick={() => navigate("/addTest")}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <Plus size={16} /> Add Test
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-3">Test Name</th>
                  <th className="p-3 text-center">Category</th>
                  <th className="p-3 text-center">Price</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map(test => (
                  <tr key={test._id} className="border-b hover:bg-blue-50">
                    <td className="p-3 font-semibold text-blue-900">{test.name}</td>
                    <td className="p-3 text-center">{test.category?.name || "N/A"}</td>
                    <td className="p-3 text-center font-bold">₹{test.defaultPrice}</td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${test.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {test.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                       <div className="flex justify-center gap-2">
                          <button onClick={() => { setEditingTest(test); setIsEditOpen(true); }} className="p-2 bg-blue-100 text-blue-700 rounded"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(test._id)} className="p-2 bg-red-100 text-red-700 rounded"><Trash2 size={16} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EDIT MODAL WITH CKEDITOR */}
          {isEditOpen && editingTest && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                  <h3 className="font-bold text-blue-900">Edit Diagnostic Test</h3>
                  <button onClick={() => setIsEditOpen(false)}><X size={20} /></button>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Test Name</label>
                      <input value={editingTest.name} onChange={(e) => setEditingTest({...editingTest, name: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                      <input type="number" value={editingTest.defaultPrice} onChange={(e) => setEditingTest({...editingTest, defaultPrice: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <label className="text-xs font-bold text-blue-700 uppercase block mb-3">Report Entry Type</label>
                    <div className="flex gap-6">
                      {['Numeric', 'RichText'].map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" checked={editingTest.inputType === type} onChange={() => setEditingTest({...editingTest, inputType: type})} className="accent-blue-600" />
                          <span className="text-sm font-medium">{type === 'Numeric' ? 'Numeric (Range)' : 'Rich Text (Document)'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {editingTest.inputType === "Numeric" ? (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between mb-3"><h4 className="font-bold text-sm">Reference Ranges</h4><button onClick={addRangeRow} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">+ Add</button></div>
                      <table className="w-full text-xs border bg-white">
                        <thead><tr className="bg-gray-100"><th>Gender</th><th>Min Age</th><th>Max Age</th><th>Low</th><th>High</th><th></th></tr></thead>
                        <tbody>
                          {editingTest.referenceRanges.map((range, i) => (
                            <tr key={i}>
                              <td><select value={range.gender} name="gender" onChange={(e) => handleRangeChange(i, e)} className="w-full"><option>BOTH</option><option>Male</option><option>Female</option></select></td>
                              <td><input type="number" name="ageMin" value={range.ageMin} onChange={(e) => handleRangeChange(i, e)} className="w-full border-none" /></td>
                              <td><input type="number" name="ageMax" value={range.ageMax} onChange={(e) => handleRangeChange(i, e)} className="w-full border-none" /></td>
                              <td><input type="text" name="lowRange" value={range.lowRange} onChange={(e) => handleRangeChange(i, e)} className="w-full border-none" /></td>
                              <td><input type="text" name="highRange" value={range.highRange} onChange={(e) => handleRangeChange(i, e)} className="w-full border-none" /></td>
                              <td><button onClick={() => removeRangeRow(i)} className="text-red-500 p-1"><Trash2 size={14}/></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Default Report Template</label>
                      <div className="ck-editor-container border rounded overflow-hidden min-h-[300px]">
                       <JoditEditor
        value={editingTest.defaultResult || ""}
        config={config}
        onBlur={(newContent) => 
          setEditingTest(prev => ({ ...prev, defaultResult: newContent }))
        }
      />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Unit</label>
                        <input value={editingTest.unit || ""} onChange={(e) => setEditingTest({...editingTest, unit: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                        <select value={editingTest.isActive ? "active" : "inactive"} onChange={(e) => setEditingTest({...editingTest, isActive: e.target.value === 'active'})} className="w-full border rounded px-3 py-2 text-sm">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                  <button onClick={() => setIsEditOpen(false)} className="text-sm font-bold text-gray-500 px-4">Cancel</button>
                  <button 
                    disabled={saving} 
                    onClick={async () => {
                        setSaving(true);
                        try {
                            await updateTest(editingTest._id, editingTest);
                            setIsEditOpen(false);
                            fetchTests();
                            alert("Updated!");
                        } catch { alert("Failed"); } finally { setSaving(false); }
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded font-bold"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
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