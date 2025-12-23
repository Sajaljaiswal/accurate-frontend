import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import { useAuth } from "../auth/AuthContext"; // Import the custom hook
import { getTodayPatientsCount } from "../api/patientApi";

export default function Admin() {
  const { user } = useAuth(); // Destructure user directly
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-700">
      <Navigation />
      <main className="flex-grow px-8 flex flex-col items-center">
        <div className="text-center my-8">
          <h2 className="text-2xl text-gray-500 font-light">
            Welcome <span className="text-red-600 font-bold">{user?.username || "Admin"}</span>
          </h2>
          <p className="text-blue-600 text-sm font-bold mt-1 tracking-widest">— WELCOME TO ACCURATE DIAGNOSTIC CENTER —</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-blue-500 p-8">
            <h3 className="text-center text-lg font-semibold border-b pb-4 mb-4 text-gray-600">User Credentials & Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Your Designation:</span>
                <span className="font-bold text-blue-800">{user?.role || "IDDose Admin"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Login Time:</span>
                <span className="text-gray-700 font-mono font-bold">{formatDateTime(currentTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Logged Out at:</span>
                <span className="text-gray-700">{user?.lastLogout || "Not Available"}</span>
              </div>
               <div className="flex justify-between">
                <span className="text-gray-500">Total Register Today</span>
                <span className="text-gray-500">{todayCount}</span>

              </div>
            </div>
          </div>
          
          {/* News Card */}
          <div className="bg-white rounded-xl shadow-lg border-r-4 border-teal-500 p-8 flex flex-col justify-center italic text-gray-400 text-center">
            ACCURATE DIAGNOSTIC CENTER <br /> News/Announcements will appear here.
          </div>
        </div>
      </main>
    </div>
  );
}