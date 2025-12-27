import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navigation from "./Navigation";
import { useAuth } from "../auth/AuthContext";
import { getTodayPatientsCount } from "../api/patientApi";

export default function Admin() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: 'short', year: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true,
    }).format(date).replace(/, /g, ' ').replace(/ /g, '-').replace(/-(\d{2}:)/, ' $1').toUpperCase();
  };

  useEffect(() => {
    const fetchTodayPatients = async () => {
      try {
        const res = await getTodayPatientsCount();
        setTodayCount(res.data.count);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTodayPatients();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* 1. Sidebar is fixed on the left */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Navbar inside the content area */}
        <Navigation />

        <main className="p-8">
          {/* Welcome Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl text-gray-500 font-light">
              Welcome <span className="text-red-600 font-bold">{user?.username || "Admin"}</span>
            </h2>
            <div className="flex flex-col items-center mt-2">
              <div className="h-0.5 w-16 bg-blue-600 mb-2"></div>
              <p className="text-blue-600 text-xs font-black tracking-[0.2em] uppercase">
                Accurate Diagnostic Center
              </p>
            </div>
          </div>

          {/* Cards Container */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* User Credentials Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 py-4">
                <h3 className="text-center text-sm font-bold uppercase tracking-wider text-gray-600">
                  User Credentials & Status
                </h3>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-400 text-sm">Your Designation:</span>
                  <span className="font-bold text-blue-900">{user?.role || "IDDose Admin"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-400 text-sm">Current Login Time:</span>
                  <span className="text-gray-700 font-mono font-bold bg-gray-100 px-2 py-1 rounded text-xs">
                    {formatDateTime(currentTime)}
                  </span>
                </div>
                {/* <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-400 text-sm">Last Logged Out at:</span>
                  <span className="text-gray-700 font-medium">{user?.lastLogout || "Not Available"}</span>
                </div> */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 text-sm">Total Registered Today:</span>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {todayCount}
                  </div>
                </div>
              </div>
            </div>

            {/* News/Announcements Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-teal-500"></div>
              <p className="italic text-gray-400 leading-relaxed">
                <span className="font-bold text-teal-600 not-italic block mb-2">NOTICE BOARD</span>
                ACCURATE DIAGNOSTIC CENTER <br /> 
                News and announcements will appear here automatically.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}