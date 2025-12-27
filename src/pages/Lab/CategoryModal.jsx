import React, { useState } from "react";
import { createCategory } from "../../api/categoryApi";

const CategoryModal = ({ isOpen, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createCategory(categoryName);
      
      // Use the onSave prop passed from the parent to update the list
      if (onSave) {
        onSave(response.data.data);
      }
      
      alert("Category added successfully!");
      setCategoryName(""); // Reset input
      onClose(); // Close modal
    } catch (err) {
      alert(err.response?.data?.message || "Error saving category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">New category</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-xl"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
               Name
            </label>
            <input
              type="text"
              autoFocus
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory()}
              placeholder="e.g. Histopathology"
              disabled={isSubmitting}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm disabled:bg-slate-50"
            />
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCategory}
            disabled={isSubmitting}
            className="bg-[#1d61d1] hover:bg-blue-700 text-white px-10 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;