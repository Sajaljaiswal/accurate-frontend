import React, { useState, useEffect } from "react";
import { X, Trash2, Plus } from "lucide-react";
import { updatePatient } from "../../api/patientApi";
import { getAllTests } from "../../api/testApi";
import LazySelect from "../../commom/LazySelect";
import { useBilling } from "../Register/useBilling";

const EditPatientModal = ({ patient, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    firstName: "",
    mobile: "",
    age: "",
    gender: "",
    referredBy: "",
  });

  // Test Selection State
  const [selectedTests, setSelectedTests] = useState([]);
  const [dropdownTests, setDropdownTests] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dropPage, setDropPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  // Use your custom hook for live billing updates within the modal
  const calculations = useBilling(selectedTests, 0, "amount", 0);

  useEffect(() => {
    if (patient) {
      setForm({
        firstName: patient.firstName || "",
        mobile: patient.mobile || "",
        age: patient.age || "",
        gender: patient.gender || "",
        referredBy: patient.referredBy || "",
      });
      // Map existing patient tests to the format expected by the table/hook
      const existingTests = patient.tests?.map(t => ({
        _id: t.testId, // Map backend testId back to _id for consistency
        name: t.name,
        defaultPrice: t.price
      })) || [];
      setSelectedTests(existingTests);
    }
    fetchDropdownData(1, true);
  }, [patient]);

  const fetchDropdownData = async (page, isInitial = false) => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const res = await getAllTests(page, 10);
      setDropdownTests(prev => isInitial ? res.data.data : [...prev, ...res.data.data]);
      setTotalRecords(res.data.pagination.totalItems);
      setDropPage(page);
    } finally { setIsFetching(false); }
  };

  const handleAddTest = (testId) => {
    const testObj = dropdownTests.find((t) => t._id === testId);
    if (testObj && !selectedTests.some((t) => t._id === testObj._id)) {
      setSelectedTests([...selectedTests, testObj]);
    }
  };

  const removeTest = (id) => setSelectedTests(selectedTests.filter(t => t._id !== id));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const handleSave = async () => {
  try {
    // 1. Ensure tests match your 'patientTestSchema'
    const formattedTests = selectedTests.map((t) => ({
      testId: t._id || t.testId, // Handle both existing and new tests
      name: t.name,
      price: Number(t.defaultPrice || t.price || 0), // Schema requires 'price'
      status: t.status || "Pending",
      resultValue: t.resultValue || "",
      unit: t.unit || "",
      referenceRange: t.referenceRange || ""
    }));

    // 2. Recalculate Billing
    const currentCashReceived = Number(patient.billing?.cashReceived || 0);
    const currentDiscount = Number(patient.billing?.discountAmount || 0);
    
    // New Gross is from our useBilling hook (calculations.grossTotal)
    const newNetTotal = Math.max(0, calculations.grossTotal - currentDiscount);
    const newDueAmount = Math.max(0, newNetTotal - currentCashReceived);

    // 3. Determine Payment Status (Must be "PAID", "PARTIAL", or "PENDING")
    let newStatus = "PENDING";
    if (newDueAmount <= 0 && newNetTotal > 0) {
      newStatus = "PAID";
    } else if (currentCashReceived > 0) {
      newStatus = "PARTIAL";
    }

    const updatedData = {
      ...form,
      tests: formattedTests, // This overwrites the old array with the new one
      billing: {
        ...patient.billing,
        grossTotal: calculations.grossTotal,
        netAmount: newNetTotal,
        dueAmount: newDueAmount,
        paymentStatus: newStatus, // Strictly uppercase to match your Schema enum
      },
    };

    await updatePatient(patient._id, updatedData);
    alert("Patient and tests updated successfully ✅");
    onSuccess();
    onClose();
    window.location.reload();
  } catch (err) {
    console.error("Update Error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to update patient tests");
  }
};

  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="font-bold text-xl text-gray-800">Edit Patient Profile</h2>
          <button onClick={onClose} className="hover:bg-gray-200 p-1 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Patient Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Mobile Number</label>
              <input name="mobile" value={form.mobile} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Age</label>
              <input name="age" value={form.age} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Referred By (Doctor Name)</label>
              <input name="referredBy" value={form.referredBy} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <hr />

          {/* Test Management Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase block">Manage Tests</label>
            <LazySelect
                tests={dropdownTests} 
                totalItems={totalRecords} 
                loading={isFetching} 
                onLoadMore={() => fetchDropdownData(dropPage + 1)} 
                onSelect={handleAddTest} 
            />

            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Test Name</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedTests.map((t) => (
                    <tr key={t._id}>
                      <td className="px-4 py-2">{t.name}</td>
                      <td className="px-4 py-2 text-right">₹{t.defaultPrice}</td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => removeTest(t._id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right font-bold text-blue-700">
                New Total: ₹{calculations.grossTotal.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:underline">Cancel</button>
          <button onClick={handleSave} className="px-8 py-2 bg-blue-700 text-white rounded-md font-bold hover:bg-blue-800 shadow-lg transition">Update Patient Data</button>
        </div>
      </div>
    </div>
  );
};

export default EditPatientModal;