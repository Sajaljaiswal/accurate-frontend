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

// Reusable Input Component
const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  maxLength,
}) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
    />
  </div>
);

const SelectField = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "-- Select --",
}) => {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
      >
        <option value="">{placeholder}</option>

        {options.map((opt, index) => {
          // ✅ If API object
          if (typeof opt === "object") {
            return (
              <option key={opt._id || index} value={opt._id}>
                {opt.name || opt.label}
              </option>
            );
          }

          // ✅ If default string
          return (
            <option key={index} value={opt}>
              {opt}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const Register = () => {
  const [selectedTests, setSelectedTests] = useState([]);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState("amount");
  const [discountReason, setDiscountReason] = useState("");
  const [cashReceived, setCashReceived] = useState(0);
  const [panels, setPanels] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);

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

    // Find the test in the API-fetched tests array
    const testObj = tests.find((t) => t._id === testId);

    // Prevent duplicate adds based on MongoDB _id
    if (testObj && !selectedTests.some((t) => t._id === testObj._id)) {
      setSelectedTests([...selectedTests, testObj]);
    }
  };

  useEffect(() => {
    const fetchPanels = async () => {
      try {
        const res = await getAllPanels();
        setPanels(res.data.data);
      } catch (err) {
        console.error("Failed to fetch panels", err);
      }
    };

    fetchPanels();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getAllDoctors();
        setDoctors(res.data.data);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };
    fetchDoctors();
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
      bloodGroup: "",
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

  // Generate Serial Numbers (Note: In production, do this on Backend)
  const generateSerialNumbers = () => {
    const labNo = "LAB" + Date.now().toString().slice(-9); // 12 digits total
    const regNo = Math.floor(10000 + Math.random() * 90000).toString(); // 5 digits
    return { labNo, regNo };
  };

  // Validation
  //   const validateForm = () => {
  //     if (!form.firstName || !form.mobile) {
  //       alert("Please fill required fields (Name, Mobile) and add at least one test.");
  //       return true;
  //     }
  //     return true;
  //   };
  // 1. FIXED CALCULATIONS: Ensure Number conversion to avoid NaN
  const calculations = useMemo(() => {
    // Ensure we are summing a number
    const grossTotal = selectedTests.reduce(
      (sum, item) => sum + (Number(item.defaultPrice) || 0),
      0
    );

    const discountVal = Number(discountValue) || 0;
    const cashRec = Number(cashReceived) || 0;

    const discountAmt =
      discountType === "percent"
        ? (grossTotal * discountVal) / 100
        : discountVal;

    const netAmount = Math.max(0, grossTotal - discountAmt);
    const dueAmount = cashRec < netAmount ? netAmount - cashRec : 0;

    return {
      grossTotal,
      discountAmt,
      netAmount,
      dueAmount,
      cashRec,
      count: selectedTests.length,
    };
  }, [selectedTests, discountValue, discountType, cashReceived]);

  // 2. FIXED SAVE LOGIC: Sending objects instead of just string IDs
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
          discountValue: Number(discountValue),
          discountAmount: calculations.discountAmt,
          netAmount: calculations.netAmount,
          cashReceived: Number(cashReceived),
          dueAmount: calculations.dueAmount,
          paymentStatus: paymentStatus, // Ensure this matches your backend enum (PAID, UNPAID, PARTIAL)
        },
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
    //   if (!validateForm()) return;

    const { labNo, regNo } = generateSerialNumbers();
    const doc = new jsPDF();
    const leftX = 15; // left page margin
    const now = new Date();

    const formattedDate = now.toLocaleDateString("en-GB"); // DD/MM/YYYY
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- 1. HEADER (Laboratory Info) ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ACCURATE DIAGNOSTIC CENTER", leftX, 15, {
      align: "left",
    });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const headerLines = [
      "7/15128/2, Janaura, NH-27, Ayodhya, Uttar Pradesh",
      "Contact Nos : 8009904250",
      "Branch Ayodhya Contact No: 05267315486, +8924962394",
      "Email: accurate@gmail.com",
      "Website: www.accuratediagnostics.co.in",
    ];
    headerLines.forEach((line, index) => {
      doc.text(line, leftX, 20 + index * 4, { align: "left" });
    });

    // --- 2. TITLE BAR ---
    doc.setFillColor(230, 230, 230);
    doc.rect(15, 42, pageWidth - 30, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Bill / Money Receipt", pageWidth / 2, 46, { align: "left" });

    // --- 3. PATIENT METADATA (Two Columns) ---
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    // Left Column
    doc.text(`Patient Name :`, 15, 58);
    doc.setFont("helvetica", "bold");
    doc.text(`${form.firstName}`, 45, 58);
    doc.setFont("helvetica", "normal");

    doc.text(`Age :`, 15, 64);
    doc.text(`${form.age} Y`, 45, 64);
    doc.text(`Sex :`, 70, 64);
    doc.text(`${form.gender}`, 90, 64);

    doc.text(`Referred By :`, 15, 70);
    doc.text(`${form.referredBy}`, 45, 70);

    doc.text(`Contact No. :`, 15, 76);
    doc.text(`${form.mobile}`, 45, 76);

    // Right Column
    const rightColX = 130;
    const rightValX = 160;
    doc.text(`Bill No :`, rightColX, 58);
    doc.text(`25-26/${regNo}`, rightValX, 58); // Serialized Bill No

    doc.text(`Reg. Date :`, rightColX, 64);
    doc.text(`${formattedDate} ${formattedTime}`, rightValX, 64);

    doc.text(`Patient ID :`, rightColX, 70);
    doc.text(`157098`, rightValX, 70); // Static or from user context

    doc.text(`Lab No. :`, rightColX, 76);
    doc.setFont("helvetica", "bold");
    doc.text(`${labNo}`, rightValX, 76);

    // --- 4. INVESTIGATION TABLE ---
    const tableData = selectedTests.map((t, index) => [
      index + 1,
      "DIAGNOSTICS", // Department
      t.name,
      "-", // Token No
      (t.defaultPrice || t.price || 0).toFixed(2),
    ]);

    autoTable(doc, {
      startY: 82,
      head: [["Sr.No", "Department", "Test Name", "Token No", "Test Rate"]],
      body: tableData,
      theme: "plain",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      columnStyles: {
        5: { halign: "right" },
      },
      margin: { left: 15, right: 15 },
    });

    // --- 5. BILLING SUMMARY ---
    let finalY = doc.lastAutoTable.finalY + 2;
    doc.setFontSize(8);
    doc.text(`Gross Amount :`, 160, finalY, { align: "right" });
    doc.text(`${calculations.grossTotal.toFixed(2)}`, 195, finalY, {
      align: "right",
    });

    finalY += 15;
    // Box for totals
    doc.rect(135, finalY, 60, 25);
    doc.text(`Discount Amount:`, 137, finalY + 5);
    doc.text(`${calculations.discountAmt.toFixed(2)}`, 193, finalY + 5, {
      align: "right",
    });

    doc.line(135, finalY + 8, 195, finalY + 8);

    doc.setFont("helvetica", "bold");
    doc.text(`Net Amount:`, 137, finalY + 13);
    doc.text(`${calculations.netAmount.toFixed(2)}`, 193, finalY + 13, {
      align: "right",
    });

    doc.setFont("helvetica", "normal");
    doc.text(`Paid Amount:`, 137, finalY + 18);
    doc.text(`${calculations.cashRec.toFixed(2)}`, 193, finalY + 18, {
      align: "right",
    });

    doc.text(`Due Amount:`, 137, finalY + 23);
    doc.text(`${calculations.dueAmount.toFixed(2)}`, 193, finalY + 23, {
      align: "right",
    });

    // --- 6. FOOTER & SIGNATURE ---
    const footerY = 270;
    doc.setFontSize(8);
    doc.text("Auth. Signatory", pageWidth - 45, footerY - 5);
    doc.line(15, footerY, pageWidth - 15, footerY);

    doc.setFontSize(7);
    const note =
      "This report is for diagnostic use only and is not valid for medico legal use...";
    doc.text(note, 15, footerY + 5);

    doc.setFont("helvetica", "bold");
    doc.text("NOTE", 15, footerY + 12);
    doc.setFont("helvetica", "normal");
    doc.text(
      "* KINDLY DON'T ASK FOR THE REPORT WITHOUT SLIP.",
      15,
      footerY + 16
    );

    // --- PRINT PREVIEW INSTEAD OF DOWNLOAD ---
    doc.autoPrint();
    const pdfBlob = doc.output("bloburl");
    window.open(pdfBlob);
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
                    value: panel._id,
                  }))}
                  value={form.panel}
                  onChange={(e) => handleChange("panel", e.target.value)}
                />

                <SelectField
                  label="Reffered By"
                  options={doctors.map((doc) => ({
                    label: doc.fullName,
                    value: doc._id,
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
                      let autoGender = form.gender; // Default to current gender

                      // Logic to determine gender based on title
                      if (selectedTitle === "Mr.") {
                        autoGender = "Male";
                      } else if (
                        ["Mrs.", "Miss.", "Ms."].includes(selectedTitle)
                      ) {
                        autoGender = "Female";
                      }

                      // Update both title and gender in one state update
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
                  options={["A+", "B+", "O+", "AB+"]}
                  value={form.vitals.bloodGroup}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      vitals: { ...form.vitals, bloodGroup: e.target.value },
                    })
                  }
                />
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-blue-50/50 p-4 rounded-lg">
                <SelectField
                  label="Tests"
                  options={["Test A", "Test B", "Test C"]}
                />
               table
              </div> */}

              <div className="space-y-4">
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Select Test
                      </label>
                      <select
                        onChange={(e) => handleAddTest(e.target.value)}
                        defaultValue=""
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-teal-500 outline-none bg-white"
                      >
                        <option value="">-- Search & Add Test --</option>
                        {tests.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name} (₹{t.defaultPrice || t.price || 0})
                          </option>
                        ))}
                      </select>
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
                                ₹{(test.defaultPrice || 0).toFixed(2)}
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
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="border rounded-lg px-2 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="percent">Percent (%)</option>
                        <option value="amount">Amount (₹)</option>
                      </select>
                      <input
                        type="number"
                        value={discountValue}
                        onChange={(e) =>
                          setDiscountValue(Number(e.target.value))
                        }
                        className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[80px] outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter Value"
                      />
                      <select
                        value={discountReason}
                        onChange={(e) => setDiscountReason(e.target.value)}
                        className="border rounded-lg px-2 py-2 text-sm bg-white outline-none w-full"
                      >
                        <option value="staff">Staff reference</option>
                        <option value="sample">Sample</option>
                      </select>
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
                          ₹{calculations.grossTotal.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-red-500 uppercase">
                          Discount (-)
                        </p>
                        <p className="text-lg font-bold text-red-600">
                          ₹{calculations.discountAmt.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-teal-200">
                      <span className="text-xs font-bold text-teal-700 uppercase">
                        Net Payable
                      </span>
                      <span className="text-xl font-black text-teal-700">
                        ₹{calculations.netAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="bg-red-500 text-white p-3 rounded-lg flex justify-between items-center shadow-md">
                      <p className="text-xs font-bold uppercase">Due Amount</p>
                      <p className="text-xl font-black">
                        ₹{calculations.dueAmount.toFixed(2)}
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
