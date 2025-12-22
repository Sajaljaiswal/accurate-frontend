import { Printer } from "lucide-react";
import Navigation from "../Navigation";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAllPanels } from "../../api/panelApi";
import { Building, Phone, Mail, Globe, ShieldCheck } from "lucide-react";

const AllPanel = () => {
  const navigate = useNavigate();

  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanels = async () => {
      try {
        const res = await getAllPanels();
        setPanels(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPanels();
  }, []);
  return (
    <div>
      <Navigation />

      <div className="p-6 border-t flex justify-start gap-4">
        <button
          type="button"
          onClick={()=> navigate("allPanel")}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition active:scale-95"
        >
          <Printer size={18} /> All Panel
        </button>
        <button
          type="button"
          onClick={() => navigate("/allDoctor")}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition active:scale-95"
        >
          <Printer size={18} /> All Doctors
        </button>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex"> 
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Hospital / Clinic Panel List
        </h1>
         <button
          type="button"
          onClick={() => navigate("/newPanel")}
          className="flex ml-16 items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition active:scale-95"
        >
          <Printer size={18} /> Add Panel
        </button>
        </div>

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-3 text-left">Hospital Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Email</th>
                <th className="p-3">Website</th>
                <th className="p-3">Credit Limit</th>
                <th className="p-3">Payment Cycle</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center">
                    Loading panels...
                  </td>
                </tr>
              ) : panels.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    No panels found
                  </td>
                </tr>
              ) : (
                panels.map((panel) => (
                  <tr key={panel._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold flex items-center gap-2">
                      <Building size={16} />
                      {panel.name}
                    </td>
                    <td className="p-3 text-center">
                      {panel.organizationType || "-"}
                    </td>
                    <td className="p-3 text-center flex items-center justify-center gap-1">
                      <Phone size={14} />
                      {panel.contact?.mobile}
                    </td>
                    <td className="p-3 text-center">
                      {panel.contact?.email || "-"}
                    </td>
                    <td className="p-3 text-center">
                      {panel.contact?.website || "-"}
                    </td>
                    <td className="p-3 text-center font-bold">
                      ₹{panel.billing?.creditLimit || 0}
                    </td>
                    <td className="p-3 text-center">
                      {panel.billing?.paymentCycle}
                    </td>
                    <td className="p-3 text-center">
                      {panel.isActive ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1">
                          <ShieldCheck size={12} /> ACTIVE
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                          INACTIVE
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="bg-blue-900 text-white text-xs py-3 text-center">
        © 2026 Accurate Diagnostic Center. All rights reserved.
      </footer>
    </div>
  );
};

export default AllPanel;
