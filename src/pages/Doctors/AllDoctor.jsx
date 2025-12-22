import { Printer } from "lucide-react";
import Navigation from "../Navigation";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAllDoctors } from "../../api/doctorApi";
import { User, Phone, Mail, ShieldCheck } from "lucide-react";

const AllDoctor = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getAllDoctors();
        setDoctors(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <Navigation />

      {/* Top Buttons */}
      <div className="p-6 border-t flex justify-start gap-4">
        <button
          type="button"
          onClick={() => navigate("/allPanel")}
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

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Doctors List
          </h1>

          <button
            type="button"
            onClick={() => navigate("/newDoctor")}
            className="flex ml-16 items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition active:scale-95"
          >
            <Printer size={18} /> Add Doctor
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-3 text-left">Doctor Name</th>
                <th className="p-3">Specialization</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Email</th>
                <th className="p-3">Clinic</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center">
                    Loading doctors...
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No doctors found
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr
                    key={doctor._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-semibold flex items-center gap-2">
                      <User size={16} />
                      {doctor.title} {doctor.fullName}
                    </td>

                    <td className="p-3 text-center">
                      {doctor.specialization || "-"}
                    </td>

                    <td className="p-3 text-center flex items-center justify-center gap-1">
                      <Phone size={14} />
                      {doctor.mobile || "-"}
                    </td>

                    <td className="p-3 text-center">
                      {doctor.email || "-"}
                    </td>

                    <td className="p-3 text-center">
                      {doctor.clinicName || "-"}
                    </td>

                    <td className="p-3 text-center">
                      {doctor.status === "TAGGED" ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1">
                          <ShieldCheck size={12} /> TAGGED
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                          UNTAGGED
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

export default AllDoctor;
