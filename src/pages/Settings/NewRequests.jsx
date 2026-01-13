import React, { useEffect, useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import api from "../../api/axios";

const NewRequests = () => {
  const [requests, setRequests] = useState([]);

  // 1. Improved Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // 2. Updated Status Change Logic (Database Sync)
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optimistic Update
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
      );

      // Backend Sync - Assumes you have a PATCH route: /home-collections/:id
      await api.patch(`/home-collections/${id}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      fetchRequests(); // Revert on error
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Called": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Picked Up": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Cancelled": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get("/home-collections");
      setRequests(res.data.data);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-black text-slate-800">New Requests</h1>
                  <p className="text-slate-500">Manage incoming home collection requests.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                  <p className="text-2xl font-black text-indigo-600">{requests.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Customer</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Contact & Address</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Scheduled Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {requests.map((request) => (
                      <tr key={request._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <User size={18} />
                            </div>
                            <span className="font-bold text-slate-700">{request.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone size={14} className="text-slate-400" />
                              {request.phone}
                            </div>
                            {/* 3. Address with Google Maps Link */}
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(request.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-indigo-600 hover:underline group"
                            >
                              <MapPin size={14} className="text-slate-400 group-hover:text-indigo-600" />
                              {request.address}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <CalendarIcon size={16} className="text-indigo-400" />
                            {/* 4. Formatted Date */}
                            {formatDate(request.date)}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="relative group mx-auto w-fit">
                            {/* 5. Status Dropdown */}
                            <select
                              value={request.status}
                              onChange={(e) => handleStatusChange(request._id, e.target.value)}
                              className={`appearance-none pl-4 pr-10 py-2 rounded-xl text-xs font-bold border cursor-pointer outline-none transition-all shadow-sm ${getStatusStyles(
                                request.status
                              )}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Called">Called</option>
                              <option value="Picked Up">Picked Up</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <ChevronDown
                              size={14}
                              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewRequests;