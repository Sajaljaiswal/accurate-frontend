import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navigation from "./Navigation";
import { useAuth } from "../auth/AuthContext";
import { getTodayPatientsCount } from "../api/patientApi";
import { Users, Activity, Clock, PlusCircle } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayCount, setTodayCount] = useState(0);
  const [todayTests, setTodayTests] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

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
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">

          {/* Welcome */}
          <div className="mb-10">
            <h2 className="text-3xl font-light text-slate-600">
              Welcome,
              <span className="ml-2 font-bold text-blue-700">
                {user?.username || "Admin"}
              </span>
            </h2>
            <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
              Accurate Diagnostic Center · Admin Dashboard
            </p>
          </div>

          {/* Live Time Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Date
              </p>
              <p className="text-lg font-bold text-slate-700">
                {formatDate(currentTime)}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-xl">
              <Clock className="text-blue-600" />
              <span className="font-mono text-xl font-bold text-blue-700">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <StatCard
              title="Registered Today"
              value={todayCount}
              icon={<Users />}
              color="blue"
            />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-slate-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <QuickAction label="New Registration" />
                <QuickAction label="View Daily Business" />
                <QuickAction label="Manage Tests" />
                <QuickAction label="Reports & Analytics" />
              </div>
            </div>

            {/* Notice Board */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-1 bg-teal-500" />
              <h3 className="font-bold text-slate-800 mb-4">
                Notice Board
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                System updates, lab announcements, and internal
                communications will appear here.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
      <div className={`p-4 rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          {title}
        </p>
        <p className="text-3xl font-black text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
};

const QuickAction = ({ label }) => (
  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition">
    <PlusCircle className="text-blue-600" size={18} />
    {label}
  </button>
);
