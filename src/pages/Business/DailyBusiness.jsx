import React, { useState, useEffect, useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  CreditCard,
  Activity,
  CalendarIcon,
} from "lucide-react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import { getDailyBusinessStats } from "../../api/patientApi"; // You'll need this API

const DailyBusiness = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  // Dynamic data from API
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPatients: 0,
    totalTests: 0,
    avgTicket: 0,
    hourlyData: [],
    recentBookings: [],
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!selectedDate) return;

    const fetchBusinessData = async () => {
      setLoading(true);
      try {
        const res = await getDailyBusinessStats(selectedDate || today);
        setStats(res.data);
        console.log("Fetched business data:", res.data);
      } catch (err) {
        console.error("Error fetching business data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [selectedDate]);

  const safeHourlyData = useMemo(() => {
    if (stats.hourlyData?.length) return stats.hourlyData;

    return Array.from({ length: 24 }, (_, h) => ({
      time: `${h}:00`,
      revenue: 0,
      tests: 0,
    }));
  }, [stats.hourlyData]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {loading && (
            <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="text-slate-600 font-bold animate-pulse">
                Loading Business Report...
              </div>
            </div>
          )}

          {/* Header & Fixed Calendar UI */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Daily Business
              </h1>
              <p className="text-slate-500 font-medium">
                Detailed financial and operational insights
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-200">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <CalendarIcon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                  Select Report Date
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="outline-none text-sm font-bold text-slate-700 cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
              icon={<CreditCard className="text-emerald-600" />}
              color="emerald"
            />
            <StatCard
              title="Total Patients"
              value={stats.totalPatients}
              icon={<Users className="text-blue-600" />}
              color="blue"
            />
            <StatCard
              title="Tests Conducted"
              value={stats.totalTests}
              icon={<Activity className="text-indigo-600" />}
              color="indigo"
            />
            <StatCard
              title="Avg. Ticket Size"
              value={`₹${stats.avgTicket}`}
              icon={<TrendingUp className="text-amber-600" />}
              color="amber"
            />
          </div>

          {/* Graphs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Area Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">
                  Revenue Timeline (Hourly)
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  ₹ Data Live
                </span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={safeHourlyData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="time"
                      fontSize={11}
                      tickMargin={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis fontSize={11} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Test Volume Bar Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">
                  Test Volume by Time
                </h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Count Data
                </span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={safeHourlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="time"
                      fontSize={11}
                      tickMargin={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis fontSize={11} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="tests"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      barSize={35}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* ... (Existing table logic, mapped with stats.recentBookings) ... */}
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
      <div className={`p-4 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          {title}
        </p>
        <h2 className="text-2xl font-black text-slate-800 leading-tight">
          {value}
        </h2>
      </div>
    </div>
  );
};

export default DailyBusiness;
