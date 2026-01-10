import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  MoreVertical,
  Trash2,
  User,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
} from "lucide-react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";

const NewRequests = () => {
  // Mock data - in a real app, fetch this from your database
  const [requests, setRequests] = useState([
    {
      id: 1,
      fullName: "John Doe",
      phone: "98765 43210",
      address: "123 Indigo Street, New York",
      date: "2024-05-20",
      status: "Pending",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      phone: "91234 56789",
      address: "456 Emerald Ave, London",
      date: "2024-05-22",
      status: "Completed",
    },
  ]);

  const toggleStatus = (id) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          const nextStatus =
            req.status === "Pending"
              ? "Processing"
              : req.status === "Processing"
              ? "Completed"
              : "Pending";
          return { ...req, status: nextStatus };
        }
        return req;
      })
    );
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Processing":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

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
                  <h1 className="text-3xl font-black text-slate-800">
                    New Requests
                  </h1>
                  <p className="text-slate-500">
                    Manage incoming service requests from the landing page.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Total Requests
                  </span>
                  <p className="text-2xl font-black text-indigo-600">
                    {requests.length}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                        Contact & Address
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                        Scheduled Date
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {requests.map((request) => (
                      <tr
                        key={request.id}
                        className="hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <User size={18} />
                            </div>
                            <span className="font-bold text-slate-700">
                              {request.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone size={14} className="text-slate-400" />
                              {request.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <MapPin size={14} className="text-slate-400" />
                              {request.address}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <CalendarIcon
                              size={16}
                              className="text-indigo-400"
                            />
                            {request.date}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => toggleStatus(request.id)}
                            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-2 mx-auto"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {requests.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-slate-400 font-medium">
                      No new requests found.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewRequests;
