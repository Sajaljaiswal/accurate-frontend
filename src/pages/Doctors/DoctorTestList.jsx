import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

const DoctorTestList = ({ doctorId }) => {
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await api.get(`/doctorTests/doctor/${doctorId}`);
    console.log(res.data, ">>>>>>>>>>>>");
    setItems(res.data);
  };

  useEffect(() => {
    if (doctorId) load();
  }, []);
  load();
  const toggleStatus = async (id) => {
    await api.patch(`/doctorTests/${id}/toggle`);
    load();
  };

  return (
    <table className="w-full text-sm mt-4 border">
      <thead className="bg-gray-200">
        <tr>
          <th>Test</th>
          <th>Default Price</th>
          <th>Custom Price</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {items.map((i) => (
          <tr key={i._id} className="border-b">
            <td>{i.test.name}</td>
            <td>₹{i.test.price}</td>
            <td>
              {i.customPrice !== null ? `₹${i.customPrice}` : "-"}
            </td>
            <td>
              {i.isActive ? "ACTIVE" : "INACTIVE"}
            </td>
            <td>
              <button
                onClick={() => toggleStatus(i._id)}
                className="text-blue-700"
              >
                {i.isActive ? "Disable" : "Enable"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DoctorTestList;
