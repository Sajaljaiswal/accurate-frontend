import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Users, CreditCard, Activity, CalendarIcon } from "lucide-react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import { getTodayPatientsCount } from "../../api/patientApi";

// Mock data based on your rate list categories
const summaryData = [
  { name: "09:00", revenue: 4500, tests: 12 },
  { name: "12:00", revenue: 15000, tests: 25 },
  { name: "15:00", revenue: 28000, tests: 40 },
  { name: "18:00", revenue: 35000, tests: 55 },
];

const DailyBusiness = () => {

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 2. Fetch data based on selected date
  useEffect(() => {
    const fetchBusinessData = async () => {
      setLoading(true);
      try {
        // Assuming your API can take a date query parameter
        // If your API only supports "today", you'll need to update the backend 
        // to accept: getTodayPatientsCount(selectedDate)
        const res = await getTodayPatientsCount(selectedDate);
        setPatientCount(res.data.count);
        
        // You would also fetch your Revenue and Test data here based on selectedDate
      } catch (err) {
        console.error("Error fetching business data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [selectedDate]);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Daily Business Overview</h1>
            <p className="text-sm text-gray-500">Monitoring performance for {selectedDate}</p>
            {/* <div className="text-sm font-medium text-blue-900 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div> */}
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
              <CalendarIcon size={18} className="text-gray-400 ml-2" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="outline-none text-sm font-semibold text-blue-900 cursor-pointer p-1"
              />
            </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Revenue" value="₹45,200" icon={<CreditCard className="text-teal-600" />} trend="+12%" />
<StatCard 
              title="Total Patients" 
              value={loading ? "..." : patientCount} 
              icon={<Users className="text-blue-600" />} 
              trend="Real-time" 
            />
 <StatCard title="Tests Conducted" value="112" icon={<Activity className="text-purple-600" />} trend="+18%" />
            <StatCard title="Avg. Ticket" value="₹403" icon={<TrendingUp className="text-orange-600" />} trend="-2%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Graph */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-4">Revenue Trend (Today)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summaryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Test Volume Graph */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-4">Test Count by Hour</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summaryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="tests" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-700">Recent Test Bookings</h3>
              <button className="text-sm text-blue-700 font-semibold hover:underline">View All</button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-white text-gray-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4 text-left">Time</th>
                  <th className="p-4 text-left">Test Name</th>
                  <th className="p-4 text-center">Category</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <TableRow time="04:30 PM" test="MRI Whole Body" cat="MRI" price="15,000" status="Paid" />
                <TableRow time="03:15 PM" test="Lipid Profile" cat="Biochemistry" price="600" status="Pending" />
                <TableRow time="01:20 PM" test="CECT Head" cat="CT Scan" price="2,700" status="Paid" />
                <TableRow time="11:45 AM" test="TMT" cat="Cardiology" price="1,200" status="Paid" />
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <h2 className="text-2xl font-black text-slate-800 mt-1">{value}</h2>
      <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {trend} from yesterday
      </span>
    </div>
    <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
  </div>
);

const TableRow = ({ time, test, cat, price, status }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="p-4 text-gray-500 font-medium">{time}</td>
    <td className="p-4 font-bold text-blue-900">{test}</td>
    <td className="p-4 text-center"><span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600">{cat}</span></td>
    <td className="p-4 text-right font-black text-gray-700">₹{price}</td>
    <td className="p-4 text-center">
      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {status}
      </span>
    </td>
  </tr>
);

export default DailyBusiness;