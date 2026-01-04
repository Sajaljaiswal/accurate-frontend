import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Edit, Trash2, X, Loader2 } from "lucide-react"; 
import api from "../../api/axios";


const DoctorTestList = ({ doctorId }) => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newCustomPrice, setNewCustomPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Track initial loading

  // Wrapped in useCallback to prevent unnecessary re-renders
  const load = useCallback(async () => {
    if (!doctorId) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/doctorTests/doctor/${doctorId}`);
      // Check if your API returns data directly or inside a data property
      const fetchedData = res.data.data || res.data; 
      setItems(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (err) {
      console.error("Failed to load doctor tests", err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this test?")) {
      try {
        await api.delete(`/doctorTests/${id}`);
        load();
      } catch (err) {
        alert("Failed to delete test");
      }
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setNewCustomPrice(item.customPrice || "");
  };

  const handleUpdatePrice = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    try {
      await api.patch(`/doctorTests/${editingItem._id}`, {
        customPrice: newCustomPrice === "" ? null : Number(newCustomPrice),
      });
      setEditingItem(null);
      load();
    } catch (err) {
      alert("Failed to update price");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-[200px]">
      <table className="w-full text-sm mt-4 border border-collapse bg-white">
        <thead className="bg-slate-100 text-slate-700">
          <tr className="text-left">
            <th className="p-3 border font-semibold">Test Name</th>
            <th className="p-3 border text-center font-semibold">Default Price</th>
            <th className="p-3 border text-center font-semibold">Custom Price</th>
            <th className="p-3 border text-center font-semibold">Status</th>
            <th className="p-3 border text-center font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="relative">
          {isLoading ? (
            <tr>
              <td colSpan="5" className="p-10 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                  <span>Loading diagnostic tests...</span>
                </div>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-10 text-center text-slate-400 italic">
                No custom tests found for this doctor.
              </td>
            </tr>
          ) : (
            items.map((i) => (
              <tr key={i._id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="p-3 border font-medium text-slate-800">
                    {i.test?.name || "Unknown Test"}
                </td>
                <td className="p-3 border text-center text-slate-500">
                    ₹{i.test?.defaultPrice || 0}
                </td>
                <td className="p-3 border text-center font-bold text-blue-700">
                  {i.customPrice !== null ? `₹${i.customPrice}` : "-"}
                </td>
                <td className="p-3 border text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${i.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                     {i.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td className="p-3 border text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(i)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                      title="Edit Price"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(i._id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-md transition"
                      title="Delete"
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

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold tracking-tight">Modify Custom Pricing</h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="hover:bg-blue-800 p-1 rounded-full transition"
              >
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Test Information</label>
                <p className="text-lg font-semibold text-slate-900 leading-tight">
                    {editingItem.test?.name}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Standard Fee</label>
                  <p className="text-slate-600 text-lg">₹{editingItem.test?.defaultPrice}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Doctor's Fee (₹)</label>
                  <input
                    type="number"
                    value={newCustomPrice}
                    onChange={(e) => setNewCustomPrice(e.target.value)}
                    className="w-full border-b-2 border-blue-100 focus:border-blue-600 outline-none py-1 text-xl font-bold transition-all text-blue-900"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-[11px] text-amber-700 italic">
                * If left blank, the standard system price will apply to this doctor's referrals.
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePrice}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                {isSaving && <Loader2 className="animate-spin" size={14} />}
                {isSaving ? "Saving..." : "Apply Price"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorTestList;