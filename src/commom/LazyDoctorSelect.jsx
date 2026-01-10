import React, { useEffect, useRef, useState } from "react";
import { Search, Loader2, User } from "lucide-react";
import { getAllDoctors } from "../api/doctorApi";

const LazyDoctorSelect = ({ value, onSelect, label = "Select Doctor" }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  console.log(doctors.fullName, ">>>>>>>>>>>>>>>>>>>>>>>>")
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const limit = 1000;

  const fetchDoctors = async (pageToLoad = 1, reset = false) => {
    setLoading(true);
    try {
      const res = await getAllDoctors({
        page: pageToLoad,
        limit: limit,
        search: searchTerm,
      });

      setDoctors((prev) =>
        reset ? res.data.data : [...prev, ...res.data.data]
      );

      setTotalItems(res.data.pagination.totalItems);
    } catch (err) {
      console.error("Error loading doctors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setPage(1);
      fetchDoctors(1, true);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  useEffect(() => {
    if (page === 1) return;
    fetchDoctors(page);
  }, [page]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 10 &&
      !loading &&
      doctors.length < totalItems
    ) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className="relative w-full">
      <label className="text-xs font-bold text-gray-500 uppercase">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={value ? `Dr. ${value.fullName}` : searchTerm}
          placeholder="Search doctor..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
          onFocus={() => {
            setIsOpen(true);
            if (doctors.length === 0) fetchDoctors(1, true);
          }}
          onChange={(e) => {
           if (value) onSelect(null); 
            setSearchTerm(e.target.value);
          }}
        />
        {value ? (
          <button 
            onClick={() => { onSelect(null); setSearchTerm(""); }}
            className="absolute right-2 top-2.5 text-gray-400 hover:text-red-500"
          >
            ×
          </button>
        ) :  <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />}
       
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full bg-white border rounded mt-1 shadow-xl max-h-60 overflow-y-auto"
          onScroll={handleScroll}
        >
          {doctors.map((doc) => (
            <div
              key={doc._id}
              onClick={() => {
                onSelect(doc);
                setIsOpen(false);
                setSearchTerm("");
              }}
              className="p-3 text-sm hover:bg-blue-50 cursor-pointer border-b flex items-center gap-3"
            >
              <User size={14} className="text-blue-500" />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  Dr. {doc.fullName}
                </span>
                <span className="text-[10px] text-gray-400">
                  {doc.specialization || "General"}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="p-4 flex justify-center items-center gap-2 text-blue-600 text-xs font-bold">
              <Loader2 className="animate-spin" size={14} />
              Loading...
            </div>
          )}

          {!loading && doctors.length >= totalItems && totalItems > 0 && (
            <div className="p-2 text-center text-[10px] text-gray-400 italic">
              End of list
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default LazyDoctorSelect;
