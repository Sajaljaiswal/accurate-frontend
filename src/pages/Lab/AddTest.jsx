import React, { useState, useEffect, useRef, useMemo } from "react"; // Added useRef and useMemo
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { addTest } from "../../api/testApi";
import { getAllCategories } from "../../api/categoryApi";
import { Plus, Trash2 } from "lucide-react";

// 1. Import Jodit
import JoditEditor from "jodit-react";

const AddTest = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null); // Reference for Jodit

  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    shortName: "",
    category: "",
    unit: "g/dl",
    inputType: "Numeric",
    isOptional: false,
    status: "ACTIVE",
    defaultPrice: "",
    defaultResult: "",
    referenceRanges: [
      { gender: "BOTH", ageMin: 0, ageMax: 100, lowRange: "", highRange: "" },
    ],
  });

  // 2. Jodit Configuration
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
        const response = await getAllCategories();
        const categoriesData = response.data.data;
        setDbCategories(categoriesData);

        if (categoriesData.length > 0) {
          setForm((prev) => ({ ...prev, category: categoriesData[0]._id }));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 3. Updated Jodit Change Handler
  const handleEditorChange = (content) => {
    setForm((prev) => ({
      ...prev,
      defaultResult: content,
    }));
  };

  const handleRangeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRanges = [...form.referenceRanges];
    updatedRanges[index][name] = value;
    setForm({ ...form, referenceRanges: updatedRanges });
  };

  const addRangeRow = () => {
    setForm({
      ...form,
      referenceRanges: [
        ...form.referenceRanges,
        { gender: "BOTH", ageMin: 0, ageMax: 100, lowRange: "", highRange: "" },
      ],
    });
  };

  const removeRangeRow = (index) => {
    const updatedRanges = form.referenceRanges.filter((_, i) => i !== index);
    setForm({ ...form, referenceRanges: updatedRanges });
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.category || !form.defaultPrice) {
        alert("Please fill required fields (Name, Category, Price)");
        return;
      }

      const payload = {
        ...form,
        defaultPrice: Number(form.defaultPrice),
        isActive: form.status === "ACTIVE",
      };

      await addTest(payload);
      alert("Test added successfully ✅");
      navigate("/lab");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save test");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {form.name || "New Test"}
                </h1>
                <p className="text-sm text-slate-500 font-medium">Test details</p>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Basic Info & Input Type Sections... (same as before) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-600">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" placeholder="Hemoglobin" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-600">Short name</label>
                  <input name="shortName" value={form.shortName} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" placeholder="Hb" />
                </div>
              </div>

              {/* Input Type Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-600">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-white focus:border-blue-500 outline-none">
                    <option value="" disabled>{loading ? "Loading categories..." : "-- Select Category --"}</option>
                    {dbCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-600 block">Input Type</label>
                  <div className="flex flex-wrap gap-6 p-3 border border-slate-200 rounded-lg bg-white">
                    {[{ id: "Numeric", label: "Numeric (Range)" }, { id: "RichText", label: "Rich Text (Document)" }].map((option) => (
                      <label key={option.id} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="inputType" value={option.id} checked={form.inputType === option.id} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" />
                        <span className={`text-sm font-medium transition-colors ${form.inputType === option.id ? "text-blue-700 font-bold" : "text-slate-600 group-hover:text-blue-500"}`}>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Unit Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-blue-900 uppercase">
                    Test Price (₹)
                  </label>
                  <input
                    type="number"
                    name="defaultPrice"
                    value={form.defaultPrice}
                    onChange={handleChange}
                    placeholder="500"
                    className="w-full border border-slate-300 bg-slate-50 rounded-lg p-3 text-sm font-bold focus:bg-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-600">
                    Unit
                  </label>
                  <input
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                    placeholder="mg/dl"
                  />
                </div>
              </div>

              {/* 3. Conditional CKEditor for RichText Template */}
              {form.inputType === "RichText" && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-blue-800 uppercase tracking-widest">
                      Report Document Template
                    </h3>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <JoditEditor
                      ref={editorRef}
                      value={form.defaultResult}
                      config={config}
                      tabIndex={1} 
                      onBlur={handleEditorChange} // Jodit prefers onBlur or onChange
                      onChange={(newContent) => {}} // Optional: use for real-time
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    * This template will be loaded by default when generating reports for this test.
                  </p>
                </div>
              )}

              {/* Reference Ranges and Submit Buttons... (same as before) */}
              {form.inputType !== "RichText" && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                   <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-blue-800 uppercase tracking-widest">Reference Ranges</h3>
                    <button onClick={addRangeRow} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1 font-bold">
                      <Plus size={14} /> ADD RANGE
                    </button>
                  </div>
                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b">
                        <tr className="text-slate-500 text-xs uppercase">
                          <th className="p-3 text-left">Gender</th>
                          <th className="p-3 text-left">Age Min</th>
                          <th className="p-3 text-left">Age Max</th>
                          <th className="p-3 text-left">Low</th>
                          <th className="p-3 text-left">High</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {form.referenceRanges.map((range, index) => (
                          <tr key={index}>
                            <td className="p-2">
                              <select
                                name="gender"
                                value={range.gender}
                                onChange={(e) => handleRangeChange(index, e)}
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
                                onChange={(e) => handleRangeChange(index, e)}
                                className="border rounded p-1.5 w-16"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                name="ageMax"
                                value={range.ageMax}
                                onChange={(e) => handleRangeChange(index, e)}
                                className="border rounded p-1.5 w-16"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                name="lowRange"
                                value={range.lowRange}
                                onChange={(e) => handleRangeChange(index, e)}
                                className="border rounded p-1.5 w-20"
                                placeholder="0"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                name="highRange"
                                value={range.highRange}
                                onChange={(e) => handleRangeChange(index, e)}
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

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button onClick={handleSubmit} className="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-md transition-colors">SAVE TEST</button>
                <button onClick={() => navigate(-1)} className="bg-slate-100 text-slate-600 px-10 py-3 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors">CANCEL</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddTest;