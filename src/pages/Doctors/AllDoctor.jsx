import { Printer, Eye,X } from "lucide-react";
import Navigation from "../Navigation";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAllDoctors } from "../../api/doctorApi";
import DoctorTestList from "./DoctorTestList"; // Import the component we discussed
import Sidebar from "../Sidebar";

const AllDoctor = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  console.log(doctors);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getAllDoctors({});
        // Access nested data based on your API log: { success: true, data: [...] }
        setDoctors(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const openTestModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Doctors Management
            </h1>
            <button
              onClick={() => navigate("/newDoctor")}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition active:scale-95"
            >
              <Printer size={18} /> Add New Doctor
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-4 text-left">Doctor Name</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Clinic</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Assigned Tests</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : doctors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-500">
                      No doctors found
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr
                      key={doctor._id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-4 font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {doctor.fullName?.[0]}
                          </div>
                          {doctor.title} {doctor.fullName}
                        </div>
                      </td>
                      <td className="p-4 text-center text-gray-600">
                        {doctor.specialization || "-"}
                      </td>
                      <td className="p-4 text-center text-gray-600">
                        {doctor.clinicName || "-"}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            doctor.status === "TAGGED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {doctor.status || "UNTAGGED"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => openTestModal(doctor)}
                          className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-blue-200 transition"
                        >
                          <Eye size={14} /> View Tests
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* --- MODAL FOR ASSIGNED TESTS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-blue-900 p-5 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-bold">Assigned Diagnostic Tests</h2>
                <p className="text-xs text-blue-200 mt-1">
                  Doctor: {selectedDoctor?.title} {selectedDoctor?.fullName} |{" "}
                  {selectedDoctor?.clinicName}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* We pass the doctor's ID to the list component we built earlier */}
              <DoctorTestList doctorId={selectedDoctor?._id} />
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 border-t flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDoctor;
