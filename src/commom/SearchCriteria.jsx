import React from "react";
import { Filter, Search, ChevronDown, ChevronRight } from "lucide-react";

const SearchCriteria = ({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  statusColors,
  onSearch,
}) => {
  return (
    <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      {/* Header */}
      <div
        className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2 cursor-pointer select-none"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        <Filter size={18} className="text-blue-600" />
        <h2 className="font-bold text-slate-700">Search Criteria</h2>
      </div>

      {/* Body */}
      {showFilters && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Lab No
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                  value={filters.labNo}
                  onChange={(e) =>
                    setFilters({ ...filters, labNo: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Mobile No
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                  value={filters.mobile}
                  onChange={(e) =>
                    setFilters({ ...filters, mobile: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  From Date
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                  value={filters.fromDate}
                  onChange={(e) =>
                    setFilters({ ...filters, fromDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  To Date
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                  value={filters.toDate}
                  onChange={(e) =>
                    setFilters({ ...filters, toDate: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Patient Name
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                  value={filters.patientName}
                  onChange={(e) =>
                    setFilters({ ...filters, patientName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Order ID
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                  value={filters.orderId}
                  onChange={(e) =>
                    setFilters({ ...filters, orderId: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t flex justify-between items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              {Object.entries(statusColors).map(([key, cls]) => (
                <span
                  key={key}
                  className={`${cls} text-[10px] font-bold px-2 py-1 rounded uppercase`}
                >
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
              ))}
            </div>

            <button
              onClick={onSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded text-sm flex items-center gap-2"
            >
              <Search size={14} /> Search Records
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchCriteria;
