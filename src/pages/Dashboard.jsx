import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navigation from "./Navigation";
import { useAuth } from "../auth/AuthContext";
import { getTodayPatientsCount } from "../api/patientApi"; // Assuming similar APIs exist for stats
import {
  Users,
  Activity,
  Clock,
  PlusCircle,
  CreditCard,
  ClipboardList,
  AlertCircle,
  ArrowUpRight,
  Printer,
  FlaskConical,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    todayCount: 0,
    totalRevenue: "₹0.00",
    pendingReports: 0,
    completedToday: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getTodayPatientsCount();
        setStats((prev) => ({ ...prev, todayCount: res.data.count }));
        // Mocking other stats - replace with actual API calls
        setStats((prev) => ({
          ...prev,
          totalRevenue: "₹42,500",
          pendingReports: 12,
          completedToday: 28,
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header & Live Time */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Good {currentTime.getHours() < 12 ? "Morning" : "Afternoon"},{" "}
                {user?.username || "Admin"}!
              </h2>
              <p className="text-slate-500 font-medium text-sm">
                Here's what's happening at{" "}
                <span className="text-blue-600 font-bold">
                  Accurate Diagnostics
                </span>{" "}
                today.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-200">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                  Live Status
                </p>
                {/* Time Display */}
                <p className="font-mono text-lg font-bold text-slate-700 leading-none">
                  {currentTime.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </p>
                {/* Date Display */}
                <p className="text-[11px] font-bold text-blue-600 mt-0.5">
                  {currentTime.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Registrations"
              value={stats.todayCount}
              icon={<Users />}
              color="blue"
            />
            <StatCard
              title="Pending Samples"
              value={stats.pendingReports}
              icon={<FlaskConical />}
              color="amber"
            />
            <StatCard
              title="Reports Ready"
              value={stats.completedToday}
              icon={<Printer />}
              color="indigo"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Access Menu */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <PlusCircle size={18} className="text-blue-600" /> Fast
                  Actions
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <ActionBtn
                    label="Register Patient"
                    sub="New Entry"
                    path="/add-patient"
                    icon={<Users size={16} />}
                    color="blue"
                  />
                  <ActionBtn
                    label="Billing Details"
                    sub="Financials"
                    path="/billing"
                    icon={<CreditCard size={16} />}
                    color="emerald"
                  />
                  <ActionBtn
                    label="Enter Results"
                    sub="Pathology"
                    path="/lab-entry"
                    icon={<Activity size={16} />}
                    color="amber"
                  />
                </div>
              </div>

              {/* Critical Alerts */}
              <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 relative overflow-hidden">
                <AlertCircle className="absolute -right-4 -top-4 w-24 h-24 text-rose-100 -rotate-12" />
                <h3 className="font-bold text-rose-800 mb-2">
                  Critical Alerts
                </h3>
                <p className="text-xs text-rose-600 font-medium leading-relaxed mb-4">
                  You have 3 reports with critical values that require immediate
                  doctor validation.
                </p>
                <button className="text-xs font-bold bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition">
                  Review Now
                </button>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">
                  Recent Registrations
                </h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 font-bold">
                    <tr>
                      <th className="px-6 py-4 uppercase tracking-wider text-[10px]">
                        Patient Name
                      </th>
                      <th className="px-6 py-4 uppercase tracking-wider text-[10px]">
                        Tests
                      </th>
                      <th className="px-6 py-4 uppercase tracking-wider text-[10px]">
                        Status
                      </th>
                      <th className="px-6 py-4 uppercase tracking-wider text-[10px]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-bold text-slate-700">
                          Patient #{1024 + i}
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">
                          CBC, Lipid, KFT
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                              i % 2 === 0
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {i % 2 === 0 ? "Ready" : "In-Process"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <ArrowUpRight
                            size={16}
                            className="text-slate-300 hover:text-blue-600 cursor-pointer"
                          />
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
}

/* ---------- Components ---------- */

const StatCard = ({ title, value, icon, color }) => {
  const themes = {
    blue: "bg-blue-600 shadow-blue-100",
    emerald: "bg-emerald-600 shadow-emerald-100",
    amber: "bg-amber-500 shadow-amber-100",
    indigo: "bg-indigo-600 shadow-indigo-100",
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all">
      <div
        className={`${themes[color]} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}
      >
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
        {title}
      </p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-black text-slate-800">{value}</h2>
        <span className="text-[10px] font-bold text-emerald-500">+12%</span>
      </div>
    </div>
  );
};

const ActionBtn = ({ label, sub, icon, color, path }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
  };
  return (
    <Link
      to={path}
      className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition group"
    >
      <div className="flex items-center gap-4">
        <div
          className={`${colors[color]} p-3 rounded-xl group-hover:scale-110 transition`}
        >
          {icon}
        </div>
        <div>
          <p className="font-bold text-slate-700 text-sm">{label}</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
            {sub}
          </p>
        </div>
      </div>
      <ArrowUpRight
        size={16}
        className="text-slate-300 group-hover:text-slate-600"
      />
    </Link>
  );
};
