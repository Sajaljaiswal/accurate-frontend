import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";

const LazySelect = ({ tests, totalItems, onLoadMore, onSelect, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter local tests based on search (Optional: if searching is server-side, call API instead)
  const filteredTests = tests.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Trigger onLoadMore when user is 10px from the bottom
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      if (!loading && tests.length < totalItems) {
        onLoadMore();
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 relative w-full">
      <label className="text-xs font-bold text-gray-500 uppercase">Search & Add Test</label>
      
      <div className="relative">
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-teal-500 outline-none bg-white"
          placeholder="Type test name (e.g., MRI, CBC)..."
          value={searchTerm}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
      </div>

      {isOpen && (
        <div 
          className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded mt-1 shadow-xl z-50 max-h-60 overflow-y-auto"
          onScroll={handleScroll}
          ref={dropdownRef}
        >
          {filteredTests.map((t) => (
            <div
              key={t._id}
              onClick={() => {
                onSelect(t._id);
                setIsOpen(false);
                setSearchTerm("");
              }}
              className="p-3 text-sm hover:bg-teal-50 cursor-pointer border-b last:border-0 flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800">{t.name}</span>
                <span className="text-[10px] text-gray-400 uppercase">{t.category?.name}</span>
              </div>
              <span className="text-teal-600 font-bold">₹{t.defaultPrice}</span>
            </div>
          ))}

          {loading && (
            <div className="p-4 flex justify-center items-center gap-2 text-blue-600 text-xs font-bold">
              <Loader2 className="animate-spin" size={14} /> Loading more...
            </div>
          )}

          {!loading && tests.length >= totalItems && totalItems > 0 && (
            <div className="p-2 text-center text-[10px] text-gray-400 italic">
              End of list
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default LazySelect;