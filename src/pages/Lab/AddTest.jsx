import React, { useState, useEffect } from "react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { addTest } from "../../api/testApi";
import { getAllCategories } from "../../api/categoryApi"; // Ensure this import exists
import { Plus, Trash2 } from "lucide-react";

const AddTest = () => {
  const navigate = useNavigate();

  // 1. Add state to hold categories fetched from DB
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    shortName: "",
    category: "", // Leave empty initially
    unit: "g/dl",
    inputType: "Numeric",
    isOptional: false,
    status: "ACTIVE",
    defaultPrice: "",
    referenceRanges: [
      { gender: "BOTH", ageMin: 0, ageMax: 100, lowRange: "", highRange: "" },
    ],
  });

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
                <p className="text-sm text-slate-500 font-medium">
                  Test details
                </p>
              </div>
            </div>

            <div className="p-4 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-600">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-all"
                    placeholder="Hemoglobin"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-600">
                    Short name
                  </label>
                  <input
                    name="shortName"
                    value={form.shortName}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-all"
                    placeholder="Hb"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-600">
                    Category
                  </label>
                  {/* 3. Updated Select field to use dynamic data */}
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="" disabled>
                      {loading
                        ? "Loading categories..."
                        : "-- Select Category --"}
                    </option>
                    {dbCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ... Rest of the form (Unit, Input Type, Result, Price) remains the same ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-600">
                      Unit
                    </label>
                    <button className="text-blue-600 text-xs font-bold flex items-center gap-1">
                      <Plus size={12} /> Add new
                    </button>
                  </div>
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="g/dl">g/dl</option>
                    <option value="mg/dl">mg/dl</option>
                    <option value="%">%</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-600">
                    Input type
                  </label>
                  <select
                    name="inputType"
                    value={form.inputType}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="Numeric">Numeric</option>
                    <option value="Text">Text</option>
                    <option value="RichText">Rich Text</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isOptional"
                  id="isOptional"
                  checked={form.isOptional}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="isOptional"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  Optional
                </label>
              </div>

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
                    className="w-full border border-slate-300 bg-slate-50 rounded-lg p-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-blue-800 uppercase tracking-widest">
                    Reference Ranges (Gender/Age Wise)
                  </h3>
                  <button
                    onClick={addRangeRow}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1 font-bold"
                  >
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
                              <option value="All">BOTH</option>
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

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-md transition-colors"
                >
                  SAVE TEST
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-slate-100 text-slate-600 px-10 py-3 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddTest;
