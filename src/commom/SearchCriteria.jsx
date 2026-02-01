import React from "react";
import { Filter, Search, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";

const SearchCriteria = ({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  statusColors,
  onSearch,
}) => {
  
  // Generic handler to update filter state
  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset all filters
  const handleReset = () => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    setFilters(clearedFilters);
  };

  return (
    <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8 transition-all">
      {/* Header - Toggle Section */}
      <div
        className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100 transition-colors"
        onClick={() => setShowFilters(!showFilters)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-1.5 rounded-lg">
            <Filter size={18} className="text-blue-600" />
          </div>
          <h2 className="font-bold text-slate-700 tracking-tight">Search Criteria</h2>
        </div>
        <div className="text-slate-400">
          {showFilters ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </div>

      {/* Body - Filter Form */}
      {showFilters && (
        <div className="p-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            
            {/* Column 1: Primary Identifiers */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Lab No
                </label>
                <input
                  type="text"
                  placeholder="e.g. LAB-101"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={filters.labNo || ""}
                  onChange={(e) => handleInputChange("labNo", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Mobile No
                </label>
                <input
                  type="text"
                  placeholder="10-digit number"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={filters.mobile || ""}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                />
              </div>
            </div>

            {/* Column 2: Date Parameters */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  From Date
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={filters.fromDate || ""}
                  onChange={(e) => handleInputChange("fromDate", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  To Date
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={filters.toDate || ""}
                  onChange={(e) => handleInputChange("toDate", e.target.value)}
                />
              </div>
            </div>

            {/* Column 3: Patient Information */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Patient Name
                </label>
                <input
                  type="text"
                  placeholder="Search by name"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={filters.patientName || ""}
                  onChange={(e) => handleInputChange("patientName", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Order ID
                </label>
                <input
                  type="text"
                  placeholder="External Order ID"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={filters.orderId || ""}
                  onChange={(e) => handleInputChange("orderId", e.target.value)}
                />
              </div>
            </div>

            {/* Column 4: New Referral Fields */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Panel Name
                </label>
                <input
                  type="text"
                  placeholder="Corporate/TPA"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={filters.panelName || ""}
                  onChange={(e) => handleInputChange("panelName", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Doctor Name
                </label>
                <input
                  type="text"
                  placeholder="Dr. Name"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={filters.doctorName || ""}
                  onChange={(e) => handleInputChange("doctorName", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Status Legend */}
            <div className="flex gap-2 flex-wrap justify-center">
              {Object.entries(statusColors).map(([key, cls]) => (
                <span
                  key={key}
                  className={`${cls} text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-tighter border border-white/20 shadow-sm`}
                >
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
              ))}
            </div>

            {/* Button Group */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleReset}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 font-bold py-2.5 px-5 text-sm transition-colors"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button
                onClick={onSearch}
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 px-8 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                <Search size={16} /> SEARCH RECORDS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchCriteria;