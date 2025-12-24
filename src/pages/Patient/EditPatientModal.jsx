import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updatePatient } from "../../api/patientApi";

const EditPatientModal = ({ patient, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    firstName: "",
    mobile: "",
    age: "",
    gender: "",
    referredBy: "",
  });

  useEffect(() => {
    if (patient) {
      setForm({
        firstName: patient.firstName || "",
        mobile: patient.mobile || "",
        age: patient.age || "",
        gender: patient.gender || "",
        referredBy: patient.referredBy || "",
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updatePatient(patient._id, form);
      alert("Patient updated successfully ✅");
      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to update patient");
    }
  };

  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 border-b">
          <h2 className="font-bold text-lg">Edit Patient</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-2 gap-4">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Patient Name"
            className="border p-2 rounded"
          />

          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Mobile"
            className="border p-2 rounded"
          />

          <input
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            className="border p-2 rounded"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            name="referredBy"
            value={form.referredBy}
            onChange={handleChange}
            placeholder="Doctor"
            className="border p-2 rounded col-span-2"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-700 text-white rounded font-bold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPatientModal;
