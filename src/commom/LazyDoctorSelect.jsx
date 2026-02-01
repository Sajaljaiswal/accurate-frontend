import React, { useEffect, useRef, useState, useCallback } from "react";
import { Search, Loader2, User, X } from "lucide-react";
import { getAllDoctors } from "../api/doctorApi";

const LazyDoctorSelect = ({ value, onSelect, label = "Select Doctor" }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const limit = 20;

  const fetchDoctors = useCallback(
    async (pageToLoad = 1) => {
      // Prevent fetching if already loading or if we've reached the end

      if (loading && pageToLoad > 1) return;

      setLoading(true);
      try {
        const res = await getAllDoctors({
          page: pageToLoad,
          limit: limit,
          search: searchTerm,
        });

        const newData = res.data.data;
        setDoctors((prev) => {
          // If it's page 1, we replace the whole list to avoid duplicates
          if (pageToLoad === 1) return newData;

          // If appending, filter out any items that might already exist by ID
          const existingIds = new Set(prev.map((d) => d._id));
          const uniqueNewData = newData.filter((d) => !existingIds.has(d._id));
          return [...prev, ...uniqueNewData];
        });

        setTotalItems(res.data.pagination.totalItems);
      } catch (err) {
        console.error("Error loading doctors", err);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, loading]
  ); // searchTerm is the core dependency

  // 1. Handle Search & Open (Reset list when search changes)
  useEffect(() => {
    if (!isOpen) return;

    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchDoctors(1);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isOpen]); // Removed fetchDoctors from deps to stop re-trigger loops

  // 2. Handle Pagination (Only trigger when page increases)
  useEffect(() => {
    if (page > 1) {
      fetchDoctors(page);
    }
  }, [page]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Trigger fetch when 10px from bottom
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 15;

    if (isAtBottom && !loading && doctors.length < totalItems) {
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
          value={!isOpen && value ? `Dr. ${value.fullName}` : searchTerm}
          placeholder="Search doctor..."
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
              if (isOpen) fetchDoctors(1);
            }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
        ) : (
          <Search
            className="absolute right-3 top-2.5 text-gray-400"
            size={16}
          />
        )}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={dropdownRef}
            className="absolute z-50 w-full bg-white border rounded mt-1 shadow-2xl max-h-60 overflow-y-auto"
            onScroll={handleScroll}
          >
            {doctors.length > 0
              ? doctors.map((doc) => (
                  <div
                    key={doc._id} // ID is now guaranteed unique via the filter logic
                    onClick={() => {
                      onSelect(doc);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className="p-3 text-sm hover:bg-blue-50 cursor-pointer border-b flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Dr. {doc.fullName}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {doc.specialization || "General Practitioner"}
                      </span>
                    </div>
                  </div>
                ))
              : !loading && (
                  <div className="p-4 text-center text-gray-400 text-sm italic">
                    No doctors found
                  </div>
                )}

            {loading && (
              <div className="p-4 flex justify-center items-center gap-2 text-blue-600 text-xs font-bold bg-white w-full border-t">
                <Loader2 className="animate-spin" size={14} />
                {page === 1 ? "Searching..." : "Loading more doctors..."}
              </div>
            )}
            {!loading && doctors.length > 0 && doctors.length >= totalItems && (
              <div className="p-3 text-center text-[10px] text-gray-400 italic bg-gray-50 border-t">
                End of list - {totalItems} doctors found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LazyDoctorSelect;
