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
  Download,
} from "lucide-react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import { getDailyBusinessStats } from "../../api/patientApi"; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getTodayLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

const getYesterdayLocal = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

const getLast7DaysRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);

  start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
  end.setMinutes(end.getMinutes() - end.getTimezoneOffset());

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

const getThisMonthRange = () => {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
  end.setMinutes(end.getMinutes() - end.getTimezoneOffset());

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

const DailyBusiness = () => {
  const [startDate, setStartDate] = useState(getTodayLocal());
  const [endDate, setEndDate] = useState(getTodayLocal());

  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPatients: 0,
    totalTests: 0,
    avgTicket: 0,
    hourlyData: [],
    recentBookings: [],
    paymentSplit: [],
    panelWise: [],
  });

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchBusinessData = async () => {
      setLoading(true);
      try {
        const res = await getDailyBusinessStats({ startDate, endDate });
        setStats(res.data);
        console.log("Fetched business data:", res.data);
      } catch (err) {
        console.error("Error fetching business data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [startDate, endDate]);

  const safeHourlyData = useMemo(() => {
    if (stats.hourlyData?.length) return stats.hourlyData;

    return Array.from({ length: 24 }, (_, h) => ({
      time: `${h}:00`,
      revenue: 0,
      tests: 0,
    }));
  }, [stats.hourlyData]);

  const applyPreset = (type) => {
    if (type === "today") {
      const today = getTodayLocal();
      setStartDate(today);
      setEndDate(today);
    }

    if (type === "yesterday") {
      const yesterday = getYesterdayLocal();
      setStartDate(yesterday);
      setEndDate(yesterday);
    }

    if (type === "last7") {
      const range = getLast7DaysRange();
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }

    if (type === "month") {
      const range = getThisMonthRange();
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }
  };
const downloadReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header (Based on your Accurate Diagnostic Center Image)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("ACCURATE DIAGNOSTIC CENTER", 14, 22);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("7/15128/2, Janaura, NH-27, Ayodhya, Uttar Pradesh", 14, 28);
    doc.text("Contact Nos : 8009904250", 14, 33);
    doc.text("Email: accurate@gmail.com", 14, 38);

    // 2. Report Title
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 45, pageWidth - 28, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text(`BUSINESS SUMMARY REPORT (${startDate} to ${endDate})`, 18, 50);

    // 3. Stats Summary
    autoTable(doc, {
      startY: 58,
      head: [['Metric', 'Value']],
      body: [
        ['Total Revenue', `INR ${stats.totalRevenue.toLocaleString()}`],
        ['Total Patients', stats.totalPatients.toString()],
        ['Total Tests Conducted', stats.totalTests.toString()],
        ['Average Ticket Size', `INR ${stats.avgTicket}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [51, 65, 85] }
    });

    // 5. Footer (Based on account report image)
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(`Report Generated on: ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.getHeight() - 10);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10);
    }

     doc.autoPrint();
  const pdfBlob = doc.output("bloburl");
  window.open(pdfBlob);
    // doc.save(`Business_Report_${startDate}_to_${endDate}.pdf`);
  };

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

            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { label: "Today", key: "today" },
                  { label: "Yesterday", key: "yesterday" },
                  { label: "Last 7 Days", key: "last7" },
                  { label: "This Month", key: "month" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => applyPreset(item.key)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-200">
                <button
                onClick={downloadReport}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-200"
              >
                <Download size={18} />
                Download PDF Report
              </button>
                <div className="flex items-center gap-2">
                  <CalendarIcon size={18} className="text-blue-600" />
                  <input
                    type="date"
                    value={startDate}
                    max={endDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="outline-none text-sm font-bold text-slate-700 cursor-pointer"
                  />
                </div>

                <span className="text-slate-400 font-bold">to</span>

                <div className="flex items-center gap-2">
                  <CalendarIcon size={18} className="text-blue-600" />
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="outline-none text-sm font-bold text-slate-700 cursor-pointer"
                  />
                </div>
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

          {/* Panel-wise Revenue */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Panel-wise Revenue</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-3 text-left">Panel</th>
                    <th className="px-6 py-3 text-right">Patients</th>
                    <th className="px-6 py-3 text-right">Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.panelWise?.map((p) => (
                    <tr
                      key={p._id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-3 font-medium">
                        {p._id || "SELF"}
                      </td>
                      <td className="px-6 py-3 text-right">{p.patients}</td>
                      <td className="px-6 py-3 text-right font-bold text-emerald-600">
                        ₹{p.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
