import React, { useEffect, useState } from "react";
import Navigation from "../Navigation";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

const DoctorTestAssign = () => {
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);

  const [form, setForm] = useState({
    doctor: "",
    test: "",
    customPrice: "",
  });

  useEffect(() => {
    Promise.all([
      api.get("/doctor"),
      api.get("/lab/tests"),
    ]).then(([d, t]) => {
     setDoctors(d.data.data || []); 
        setTests(t.data.data || t.data || []);
    });
  }, []);

  const submit = async () => {
    if (!form.doctor || !form.test) {
      alert("Doctor & Test required");
      return;
    }

    await api.post("/doctorTests", {
      doctor: form.doctor,
      test: form.test,
      customPrice: form.customPrice
        ? Number(form.customPrice)
        : null,
    });

    alert("Test assigned successfully");
    setForm({ doctor: "", test: "", customPrice: "" });
  };

  return (
    <div>
      <Navigation />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow mt-6">
        <h2 className="text-lg font-bold mb-4">Assign Test to Doctor</h2>

        <div className="grid grid-cols-3 gap-4">
          <select
            value={form.doctor}
            onChange={(e) =>
              setForm({ ...form, doctor: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.title} {d.fullName}
              </option>
            ))}
          </select>

          <select
            value={form.test}
            onChange={(e) =>
              setForm({ ...form, test: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Test</option>
            {tests.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} (₹{t.defaultPrice})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Custom Price (optional)"
            value={form.customPrice}
            onChange={(e) =>
              setForm({ ...form, customPrice: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={submit}
          className="mt-4 bg-blue-700 text-white px-6 py-2 rounded"
        >
          Assign Test
        </button>
      </div>
    </div>
  );
};

export default DoctorTestAssign;
