import React, { useEffect, useRef, useState, useCallback } from "react";
import { Search, Loader2, Building2, X } from "lucide-react";
import api from "../api/axios"; // Adjust based on your axios path

const LazyPanelSelect = ({ value, onSelect, label = "Select Panel" }) => {
  const [panels, setPanels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
console.log(panels, "..............")
  const dropdownRef = useRef(null);
  const limit = 20;

  console.log(value, "vvvvvvvvvvvvv")
  const fetchPanels = useCallback(async (pageToLoad = 1) => {
    if (loading && pageToLoad > 1) return;

    setLoading(true);
    try {
      const res = await api.get("/panels", {
        params: {
          page: pageToLoad,
          limit: limit,
          search: searchTerm,
        },
      });

      const newData = res.data.data;
      console.log()
      setPanels((prev) => {
        if (pageToLoad === 1) return newData;
        const existingIds = new Set(prev.map((p) => p._id));
        const uniqueNewData = newData.filter((p) => !existingIds.has(p._id));
        return [...prev, ...uniqueNewData];
      });

      setTotalItems(res.data.pagination?.totalItems || res.data.count);
    } catch (err) {
      console.error("Error loading panels", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, loading]);

  useEffect(() => {
    if (!isOpen) return;
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchPanels(1);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isOpen]);

  useEffect(() => {
    if (page > 1) fetchPanels(page);
  }, [page]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 15 && !loading && panels.length < totalItems) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className="relative w-full">
      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          autoComplete="off"
          value={!isOpen && value ? `${value} `: searchTerm}
          placeholder="Search panel..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none pr-10"
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {value || searchTerm ? (
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              setSearchTerm("");
              setPage(1);
              if (isOpen) fetchPanels(1);
            }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
        ) : (
          <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
        )}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full bg-white border rounded mt-1 shadow-2xl max-h-60 overflow-y-auto"
            onScroll={handleScroll}
          >
            {panels.length > 0 ? (
              panels.map((panel) => (
                <div
                  key={panel._id}
                  onClick={() => {
                    onSelect(panel.name);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="p-3 text-sm hover:bg-blue-50 cursor-pointer border-b flex items-center gap-3 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <Building2 size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{panel.name}</span>
                    <span className="text-[10px] text-gray-400">Code: {panel.code || "N/A"}</span>
                  </div>
                </div>
              ))
            ) : (
              !loading && <div className="p-4 text-center text-gray-400 text-sm italic">No panels found</div>
            )}

            {loading && (
              <div className="p-4 flex justify-center items-center gap-2 text-blue-600 text-xs font-bold bg-white w-full border-t">
                <Loader2 className="animate-spin" size={14} />
                {page === 1 ? "Searching..." : "Loading more..."}
              </div>
            )}
            
            {!loading && panels.length > 0 && panels.length >= totalItems && (
              <div className="p-3 text-center text-[10px] text-gray-400 italic bg-gray-50 border-t">
                End of list - {totalItems} panels found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LazyPanelSelect;