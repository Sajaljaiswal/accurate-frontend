import React, { useState, useMemo, useEffect } from "react";
import { getAllPanels } from "../api/panelApi";
import Navigation from "./Navigation";
import { Save, UserPlus, Trash2, RotateCcw, Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { registerPatient } from "../api/patientApi";
import { getAllDoctors } from "../api/doctorApi";
import { getAllTests } from "../api/testApi";
import Sidebar from "./Sidebar";
import LazySelect from "../commom/LazySelect";
import { InputField, SelectField } from "../commom/FormComponents";
import { useBilling } from "./Register/useBilling";
import { printReceipt } from "./Register/RegisterUtils";

const Register = () => {
  const [selectedTests, setSelectedTests] = useState([]);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState("amount");
  const [discountReason, setDiscountReason] = useState("staff");
  const [cashReceived, setCashReceived] = useState(0);
  const [panels, setPanels] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);
  const [dropdownTests, setDropdownTests] = useState([]); // Tests currently in dropdown
  const [totalRecords, setTotalRecords] = useState(0); // Total tests in DB
  const [dropPage, setDropPage] = useState(1); // Current page for dropdown
  const [isFetching, setIsFetching] = useState(false); // Loading state for dropdown
  const [searchQuery, setSearchQuery] = useState("");

  // Add this inside your Register component
const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user")); // Or wherever you store auth data
  if (user) {
    setCurrentUser(user);
  }
}, []);

  useEffect(() => {
    fetchDropdownData(1, true);
  }, []);

  const fetchDropdownData = async (page, isInitial = false, search = "") => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const res = await getAllTests(page, 10, search);

      const newTests = res.data.data || [];
      const pagination = res.data.pagination;

      if (isInitial || page === 1) {
        setDropdownTests(newTests);
      } else {
        setDropdownTests((prev) => [...prev, ...newTests]);
      }

      setTotalRecords(pagination.totalItems);
      setDropPage(page);
      setSearchQuery(search); // Keep track of current search
    } catch (err) {
      console.error("Failed to fetch dropdown tests:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSearchTests = (term) => {
    fetchDropdownData(1, true, term);
  };

  const loadMoreTests = () => {
    if (dropdownTests.length < totalRecords) {
      fetchDropdownData(dropPage + 1, false, searchQuery);
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await getAllTests();
        setTests(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTests();
  }, []);

  const handleAddTest = (testId) => {
    if (!testId) return;
    const testObj = dropdownTests.find((t) => t._id === testId);
    if (testObj && !selectedTests.some((t) => t._id === testObj._id)) {
      setSelectedTests([...selectedTests, testObj]);
    } else if (!testObj) {
      console.warn("Test not found in the currently loaded dropdown list");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [pRes, dRes] = await Promise.all([getAllPanels(), getAllDoctors()]);
      setPanels(pRes.data.data);
      setDoctors(dRes.data.data);
    };
    fetchData();
  }, []);

  const removeTest = (id) => {
    setSelectedTests(selectedTests.filter((t) => t._id !== id));
  };

  const [form, setForm] = useState({
    panel: "",
    referredBy: "",
    title: "",
    firstName: "",
    age: "",
    dateOfBirth: "",
    mobile: "",
    email: "",
    gender: "",
    address: {
      pincode: "",
      city: "",
      state: "",
      country: "India",
    },
    vitals: {
      weight: "",
      height: "",
      bloodGroup: null,
    },
  });

  // Handle Input Changes
  const handleChange = (path, value) => {
    setForm((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;

      keys.slice(0, -1).forEach((k) => {
        obj[k] = { ...obj[k] };
        obj = obj[k];
      });

      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const calculations = useBilling(
    selectedTests,
    discountValue,
    discountType,
    cashReceived
  );

  const handleSave = async () => {
    try {
      // Logic for Payment Status
      let paymentStatus = "UNPAID";
      if (calculations.dueAmount <= 0 && calculations.netAmount > 0) {
        paymentStatus = "PAID";
      } else if (cashReceived > 0 && calculations.dueAmount > 0) {
        paymentStatus = "PARTIAL";
      }

      const payload = {
        ...form,
        // FIX: Sending the whole test object so Mongoose can "embed" it
        tests: selectedTests.map((t) => ({
          testId: t._id,
          name: t.name,
          price: t.defaultPrice,
        })),
        billing: {
          grossTotal: calculations.grossTotal,
          discountType,
          discountReason,
          discountValue: Number(discountValue),
          discountAmount: calculations.discountAmt,
          netAmount: calculations.netAmount,
          cashReceived: Number(cashReceived),
          dueAmount: calculations.dueAmount,
          paymentStatus: paymentStatus, // Ensure this matches your backend enum (PAID, UNPAID, PARTIAL)
        },
          createdBy: currentUser?._id || null,

      };
      console.log("okokok");

      const res = await registerPatient(payload);

      alert(
        `Patient Registered Successfully ✅\nLab No: ${res.data.data.labNumber}`
      );
      // window.location.reload();
    } catch (err) {
      console.error("Save Error:", err.response?.data);
      alert(err.response?.data?.message || "Validation failed. Check console.");
    }
  };

  const handlePrint = () => {
    printReceipt(form, selectedTests, calculations);
    window.location.reload();
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {/* --- Main Form Card --- */}
          <div className="bg-white rounded-lg shadow-xl border-t-4 border-teal-500 overflow-hidden">
            {/* Form Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <UserPlus size={20} className="text-teal-600" /> Patient
                Demographic
              </h2>
            </div>

            <form className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-blue-50/50 p-4 rounded-lg">
                <SelectField
                  label="Panel"
                  options={panels.map((panel) => ({
                    label: panel.name,
                    value: panel.name,
                  }))}
                  value={form.panel}
                  onChange={(e) => handleChange("panel", e.target.value)}
                />

                <SelectField
                  label="Reffered By"
                  options={doctors.map((doc) => ({
                    label: doc.fullName,
                    value: doc.fullName,
                  }))}
                  value={form.referredBy}
                  onChange={(e) => handleChange("referredBy", e.target.value)}
                />
              </div>
              {/* Section 1: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="grid grid-cols-2 gap-2">
                  <SelectField
                    label="Title"
                    options={["Mr.", "Mrs.", "Miss.", "Dr.", "Ms.", "C/O"]}
                    value={form.title}
                    onChange={(e) => {
                      const selectedTitle = e.target.value;
                      let autoGender = form.gender; 

                      if (selectedTitle === "Mr.") {
                        autoGender = "Male";
                      } else if (
                        ["Mrs.", "Miss.", "Ms."].includes(selectedTitle)
                      ) {
                        autoGender = "Female";
                      }
                      setForm({
                        ...form,
                        title: selectedTitle,
                        gender: autoGender,
                      });
                    }}
                  />
                </div>
                <InputField
                  label="Name"
                  placeholder="Harsh"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />

                <InputField
                  label="Age (Years)"
                  value={form.age}
                  type={"number"}
                  onChange={(e) => handleChange("age", e.target.value)}
                />

                <InputField
                  label="Date of Birth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                />

                <InputField
                  label="Mobile No."
                  placeholder="987346665"
                  value={form.mobile}
                  maxLength={10}
                  type={"number"}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />

                <InputField
                  label="Email ID"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />

                <SelectField
                  label="Gender"
                  options={["Male", "Female", "Other"]}
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                />
              </div>

              {/* Section 2: Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-blue-50/50 p-4 rounded-lg">
                <InputField
                  label="Pincode"
                  value={form.address.pincode}
                  onChange={(e) =>
                    handleChange("address.pincode", e.target.value)
                  }
                />

                <InputField
                  label="City"
                  value={form.address.city}
                  onChange={(e) => handleChange("address.city", e.target.value)}
                />

                <InputField
                  label="State"
                  value={form.address.state}
                  onChange={(e) =>
                    handleChange("address.state", e.target.value)
                  }
                />

                <InputField
                  label="Country"
                  value={form.address.country}
                  onChange={(e) =>
                    handleChange("address.country", e.target.value)
                  }
                />
              </div>

              {/* Section 3: Vitals & Clinical Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <InputField
                  label="Weight (kg)"
                  value={form.vitals.weight}
                  onChange={(e) =>
                    handleChange("vitals.weight", e.target.value)
                  }
                />

                <InputField
                  label="Height (cm)"
                  value={form.vitals.height}
                  onChange={(e) =>
                    handleChange("vitals.height", e.target.value)
                  }
                />

                <SelectField
                  label="Blood Group"
                  options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
                  value={form.vitals.bloodGroup}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      vitals: { ...form.vitals, bloodGroup: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="flex flex-col gap-1 w-full">
                      <LazySelect
                        tests={dropdownTests}
                        totalItems={totalRecords}
                        loading={isFetching}
                        onLoadMore={loadMoreTests}
                        onSelect={handleAddTest}
                        onSearch={handleSearchTests}
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-blue-800">
                        Total Tests Added: {calculations.count}
                      </span>
                    </div>
                  </div>

                  {/* Test Table */}
                  <div className="mt-4 overflow-hidden border rounded-lg bg-white">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-800 text-white uppercase text-xs">
                        <tr>
                          <th className="px-4 py-2">Item Name</th>
                          <th className="px-4 py-2 text-right">Price (₹)</th>
                          <th className="px-4 py-2 text-center w-20">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedTests.length === 0 ? (
                          <tr>
                            <td
                              colSpan="3"
                              className="px-4 py-8 text-center text-gray-400 italic"
                            >
                              No tests selected
                            </td>
                          </tr>
                        ) : (
                          selectedTests.map((test) => (
                            <tr key={test._id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 font-medium">
                                {test.name}
                              </td>
                              <td className="px-4 py-2 text-right">
                                ₹{(test.defaultPrice ?? 0).toFixed(2)}
                              </td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeTest(test._id)}
                                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Billing Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-start">
                  {/* 1. Discount Settings */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 h-full">
                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider">
                      Discount Settings
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {/* Discount Type */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-700">
                          Discount Type
                        </label>
                        <select
                          value={discountType}
                          onChange={(e) => setDiscountType(e.target.value)}
                          className="border rounded-lg px-2 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="percent">Percent (%)</option>
                          <option value="amount">Amount (₹)</option>
                        </select>
                      </div>

                      {/* Discount Value */}
                      <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                        <label className="text-xs font-medium text-gray-700">
                          Value
                        </label>
                        <input
                          type="number"
                          value={discountValue}
                          onChange={(e) =>
                            setDiscountValue(Number(e.target.value))
                          }
                          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Enter Value"
                        />
                      </div>

                      {/* Discount Reason */}
                      <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                        <label className="text-xs font-medium text-gray-700">
                          Reason
                        </label>
                        <select
                          value={discountReason}
                          onChange={(e) => setDiscountReason(e.target.value)}
                          className="border rounded-lg px-2 py-2 text-sm bg-white outline-none w-full"
                        >
                          <option value="staff">Staff reference</option>
                          <option value="sample">Sample</option>
                        </select>
                      </div>

                      {/* Approved By */}
                      <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                        <label className="text-xs font-medium text-gray-700">
                          Approved By
                        </label>
                        <select
                          value={discountReason} // Changed from discountReason to avoid state duplication
                          // onChange={(e) => setApprovedBy(e.target.value)}
                          className="border rounded-lg px-2 py-2 text-sm bg-white outline-none w-full"
                        >
                          <option value="manager">Manager</option>
                          <option value="director">Director</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. Payment Settings */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 h-full">
                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider">
                      Payment Details
                    </h4>
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">
                        Cash Collected (₹)
                      </label>
                      <input
                        type="number"
                        value={cashReceived}
                        onChange={(e) =>
                          setCashReceived(Number(e.target.value))
                        }
                        className="w-full text-lg font-semibold outline-none text-gray-700"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* 3. Summary Card */}
                  <div className="bg-teal-50 p-5 rounded-xl border border-teal-100 shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">
                          Gross Total
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                         ₹{(calculations?.grossTotal ?? 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-red-500 uppercase">
                          Discount (-)
                        </p>
                        <p className="text-lg font-bold text-red-600">
                         ₹{(calculations?.discountAmount ?? 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-teal-200">
                      <span className="text-xs font-bold text-teal-700 uppercase">
                        Net Payable
                      </span>
                      <span className="text-xl font-black text-teal-700">
                        ₹{(calculations?.netAmount ?? 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="bg-red-500 text-white p-3 rounded-lg flex justify-between items-center shadow-md">
                      <p className="text-xs font-bold uppercase">Due Amount</p>
                      <p className="text-xl font-black">
                        ₹{(calculations?.dueAmount ?? 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-600 transition active:scale-95"
                >
                  <RotateCcw size={18} /> RESET
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition active:scale-95"
                >
                  <Printer size={18} /> PRINT RECEIPT
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-blue-700 text-white px-10 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-800 transition active:scale-95"
                >
                  <Save size={18} /> SAVE IN DATABASE
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;
