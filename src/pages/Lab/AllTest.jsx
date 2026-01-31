import React, { useEffect, useState } from "react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import { getAllTests } from "../../api/testApi";
import { Search, Filter, RotateCcw, Plus } from "lucide-react";
import { getAllCategories } from "../../api/categoryApi";
import { Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteTest } from "../../api/testApi";
import { updateTest } from "../../api/testApi";
import { Editor } from "@tinymce/tinymce-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

const AllTest = () => {
  const location = useLocation(); // 2. Initialize location
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [dbCategories, setDbCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(
    location.state?.categoryId || "",
  );
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [saving, setSaving] = useState(false);
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // active or inactive
  const navigate = useNavigate();

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTests = async () => {
    setLoadingTests(true);
    try {
      // Pass pagination AND filters to the API
      const res = await getAllTests(
        currentPage,
        itemsPerPage,
        searchQuery,
        statusFilter,
        categoryFilter,
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

  useEffect(() => {
    if (location.state?.categoryId) {
      setCategoryFilter(location.state.categoryId);
      setCurrentPage(1);
    }
  }, [location.state?.categoryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setCategoryFilter("");
    setCurrentPage(1);
  };

  const handleDelete = async (testId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this test?",
    );

    if (!confirmDelete) return;

    try {
      await deleteTest(testId);
      fetchTests(); // refresh list after delete
    } catch (err) {
      alert("Failed to delete test");
      console.error(err);
    }
  };

  const handleRangeChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...editingTest.referenceRanges];
    updated[index][name] = value;

    setEditingTest({
      ...editingTest,
      referenceRanges: updated,
    });
  };

  const addRangeRow = () => {
    setEditingTest({
      ...editingTest,
      referenceRanges: [
        ...editingTest.referenceRanges,
        {
          gender: "BOTH",
          ageMin: 0,
          ageMax: 100,
          lowRange: "",
          highRange: "",
        },
      ],
    });
  };

  const removeRangeRow = (index) => {
    const updated = editingTest.referenceRanges.filter((_, i) => i !== index);

    setEditingTest({
      ...editingTest,
      referenceRanges: updated.length ? updated : editingTest.referenceRanges,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Search Criteria Panel (Based on your image) */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div
              className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <ChevronDown size={18} className="text-slate-600" />
              ) : (
                <ChevronRight size={18} className="text-slate-600" />
              )}

              <Filter size={18} className="text-blue-600" />
              <h2 className="font-bold text-slate-700">Search Criteria</h2>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showFilters ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
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
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="">
                        {loadingCategories
                          ? "Loading categories..."
                          : "All Categories"}
                      </option>

                      {dbCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
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
          </div>

          {/* Table Header Row */}
          <div className="flex justify-between items-end mb-6">
            {/* Left Side: Titles */}
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Diagnostic Test List
              </h2>
              <p className="text-sm text-gray-500">
                Total{" "}
                <span className="font-semibold text-blue-600">
                  {totalItems}
                </span>{" "}
                tests found
              </p>
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
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-3 text-left">Test Name</th>
                  <th className="p-3 text-center">Category</th>
                  <th className="p-3 text-center">Price (₹)</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Actions</th>
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
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => {
                              setEditingTest(test);
                              setIsEditOpen(true);
                            }}
                            className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(test._id)}
                            className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                            title="Delete Test"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Edit Test Modal */}
          {isEditOpen && editingTest && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                  <h3 className="font-bold text-lg text-blue-900">
                    Edit Diagnostic Test
                  </h3>
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="text-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Test Name
                      </label>
                      <input
                        value={editingTest.name}
                        onChange={(e) =>
                          setEditingTest({
                            ...editingTest,
                            name: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Default Price (₹)
                      </label>
                      <input
                        type="number"
                        value={editingTest.defaultPrice}
                        onChange={(e) =>
                          setEditingTest({
                            ...editingTest,
                            defaultPrice: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* INPUT TYPE SELECTION */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <label className="text-xs font-bold text-blue-700 uppercase block mb-3">
                      Report Entry Type
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="inputType"
                          value="Numeric"
                          checked={editingTest.inputType === "Numeric"}
                          onChange={(e) =>
                            setEditingTest({
                              ...editingTest,
                              inputType: e.target.value,
                            })
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Range Based (Numeric)
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="inputType"
                          value="RichText"
                          checked={editingTest.inputType === "RichText"}
                          onChange={(e) =>
                            setEditingTest({
                              ...editingTest,
                              inputType: e.target.value,
                            })
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Document Entry (Rich Text)
                        </span>
                      </label>
                    </div>
                  </div>
                  {/* ✅ REFERENCE RANGE TABLE (ONLY FOR NUMERIC) */}
                  {editingTest.inputType === "Numeric" && (
                    <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-gray-700">
                          Reference Ranges
                        </h4>
                        <button
                          onClick={addRangeRow}
                          className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          + Add Range
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="p-2">Gender</th>
                              <th className="p-2">Age Min</th>
                              <th className="p-2">Age Max</th>
                              <th className="p-2">Low</th>
                              <th className="p-2">High</th>
                              <th className="p-2"></th>
                            </tr>
                          </thead>

                          <tbody className="divide-y">
                            {editingTest.referenceRanges.map((range, index) => (
                              <tr key={index}>
                                <td className="p-2">
                                  <select
                                    name="gender"
                                    value={range.gender}
                                    onChange={(e) =>
                                      handleRangeChange(index, e)
                                    }
                                    className="border rounded p-1.5 w-full"
                                  >
                                    <option value="BOTH">BOTH</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                  </select>
                                </td>

                                <td className="p-2">
                                  <input
                                    type="number"
                                    name="ageMin"
                                    value={range.ageMin}
                                    onChange={(e) =>
                                      handleRangeChange(index, e)
                                    }
                                    className="border rounded p-1.5 w-16"
                                  />
                                </td>

                                <td className="p-2">
                                  <input
                                    type="number"
                                    name="ageMax"
                                    value={range.ageMax}
                                    onChange={(e) =>
                                      handleRangeChange(index, e)
                                    }
                                    className="border rounded p-1.5 w-16"
                                  />
                                </td>

                                <td className="p-2">
                                  <input
                                    type="text"
                                    name="lowRange"
                                    value={range.lowRange}
                                    onChange={(e) =>
                                      handleRangeChange(index, e)
                                    }
                                    className="border rounded p-1.5 w-20"
                                    placeholder="0"
                                  />
                                </td>

                                <td className="p-2">
                                  <input
                                    type="text"
                                    name="highRange"
                                    value={range.highRange}
                                    onChange={(e) =>
                                      handleRangeChange(index, e)
                                    }
                                    className="border rounded p-1.5 w-20"
                                    placeholder="100"
                                  />
                                </td>

                                <td className="p-2 text-center">
                                  <button
                                    onClick={() => removeRangeRow(index)}
                                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-full"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {editingTest.inputType === "RichText" && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Default Report Template (Document)
                      </label>
                      <div className="border rounded-md overflow-hidden min-h-[250px]">
                        <Editor
                          value={editingTest.defaultResult || ""}
                          apiKey="hml3sge863d0muab0z1r2uw4zrvx02egn0usxwoif1h49otp"
                          onEditorChange={(content) => {
                            setEditingTest((prev) => ({
                              ...prev,
                              defaultResult: content,
                            }));
                          }}
                          init={{
                            height: 350,
                            menubar: true,
                            placeholder:
                              "Design the default structure for MRI/USG reports here...",
                            plugins: [
                              "advlist",
                              "autolink",
                              "lists",
                              "link",
                              "image",
                              "charmap",
                              "preview",
                              "anchor",
                              "searchreplace",
                              "visualblocks",
                              "code",
                              "fullscreen",
                              "insertdatetime",
                              "media",
                              "table",
                              "help",
                              "wordcount",
                            ],
                            toolbar:
                              "undo redo | formatselect | bold italic underline | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | link image table | code fullscreen",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-blue-500 italic">
                        * This template will be saved as the default starting
                        point for this test.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Unit (e.g. mg/dL)
                      </label>
                      <input
                        value={editingTest.unit || ""}
                        onChange={(e) =>
                          setEditingTest({
                            ...editingTest,
                            unit: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                        placeholder="Leave empty if not applicable"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Active Status
                      </label>
                      <select
                        value={editingTest.isActive ? "active" : "inactive"}
                        onChange={(e) =>
                          setEditingTest({
                            ...editingTest,
                            isActive: e.target.value === "active",
                          })
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="px-5 py-2 text-sm font-bold text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={saving}
                    onClick={async () => {
                      try {
                        setSaving(true);
                        await updateTest(editingTest._id, {
                          name: editingTest.name,
                          defaultPrice: editingTest.defaultPrice,
                          isActive: editingTest.isActive,
                          inputType: editingTest.inputType,
                          unit: editingTest.unit,
                          defaultResult: editingTest.defaultResult, // ✅ Save CKEditor data to DB
                          referenceRanges: editingTest.referenceRanges,
                        });
                        setIsEditOpen(false);
                        fetchTests();
                        alert("Test updated successfully!");
                      } catch (err) {
                        alert("Update failed");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}
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
