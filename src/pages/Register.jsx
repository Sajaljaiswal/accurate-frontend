import React, { useState, useMemo, useEffect } from "react";
import { getAllPanels } from "../api/panelApi";
import Navigation from "./Navigation";
import { Save, UserPlus, Trash2, RotateCcw, Printer } from "lucide-react";
import { useAuth } from "../auth/AuthContext"; // Import your Auth Context
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { registerPatient } from "../api/patientApi";
// Reusable Input Component
const InputField = ({ label, type = "text", placeholder, value, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
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

// Mock Data for Tests
const TEST_OPTIONS = [
  { id: 1, name: "IRON PROFILE MINI", price: 1200 },
  { id: 2, name: "ALCOHOL SCREEN, BLOOD", price: 850 },
  { id: 3, name: "FULL BODY CHECKUP 51 TEST", price: 5000 },
  { id: 4, name: "CBC (Complete Blood Count)", price: 350 },
];
const Register = () => {
  const [selectedTests, setSelectedTests] = useState([]);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState("amount");
  const [discountReason, setDiscountReason] = useState("");
  const [cashReceived, setCashReceived] = useState(0);

  // 1. Add test to table
  const handleAddTest = (testName) => {
    if (!testName) return;
    const testObj = TEST_OPTIONS.find((t) => t.name === testName);

    // Prevent duplicate adds
    if (testObj && !selectedTests.some((t) => t.id === testObj.id)) {
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
  const [panels, setPanels] = useState([]);
  // 2. Remove test from table
  const removeTest = (id) => {
    setSelectedTests(selectedTests.filter((t) => t.id !== id));
  };

  const { user } = useAuth(); // Get current logged-in user
  // const [form, setform] = useState({

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

  // Calculations
  const calculations = useMemo(() => {
    const grossTotal = selectedTests.reduce((sum, item) => sum + item.price, 0);

    const discountAmt =
      discountType === "percent"
        ? (grossTotal * discountValue) / 100
        : Number(discountValue);

    const netAmount = Math.max(0, grossTotal - discountAmt);

    const dueAmount = cashReceived < netAmount ? netAmount - cashReceived : 0;

    return {
      grossTotal,
      discountAmt,
      netAmount,
      dueAmount,
      count: selectedTests.length,
    };
  }, [selectedTests, discountValue, discountType, cashReceived]);

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

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        tests: selectedTests,
        billing: {
          grossTotal: calculations.grossTotal,
          discountType,
          discountValue,
          discountAmount: calculations.discountAmt,
          netAmount: calculations.netAmount,
          cashReceived,
          dueAmount: calculations.dueAmount,
        },
      };

      const res = await registerPatient(payload);

      alert(
        `Patient Registered Successfully ✅
Lab No: ${res.data.data.labNumber}
Reg No: ${res.data.data.registrationNumber}`
      );

      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handlePrint = () => {
    //   if (!validateForm()) return;

    const { labNo, regNo } = generateSerialNumbers();
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- 1. HEADER (Laboratory Info) ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ACCURATE DIAGNOSTIC CENTER", pageWidth / 2 + 30, 15, {
      align: "center",
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
      doc.text(line, pageWidth / 2 + 30, 20 + index * 4, { align: "left" });
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
    doc.text(
      `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      rightValX,
      64
    );

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
      new Date().toLocaleDateString(), // Delivery Date
      t.price.toFixed(2),
    ]);

    autoTable(doc, {
      startY: 82,
      head: [
        [
          "Sr.No",
          "Department",
          "Test Name",
          "Token No",
          "Delivery Date",
          "Test Rate",
        ],
      ],
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
    doc.text(`${calculations.netAmount.toFixed(2)}`, 193, finalY + 18, {
      align: "right",
    });

    doc.text(`Due Amount:`, 137, finalY + 23);
    doc.text(`0.00`, 193, finalY + 23, { align: "right" });

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

    // Save PDF
    doc.save(`Bill_${labNo}.pdf`);
  };
  return (
    <div>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-700">
        <Navigation />

        <main className="p-6 max-w-7xl mx-auto">
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
                  options={["Doctor A", "Doctor B", "Doctor C"]}
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
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <InputField
                  label="First Name"
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
                        value=""
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-teal-500 outline-none bg-white"
                      >
                        <option value="">-- Search & Add Test --</option>
                        {TEST_OPTIONS.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name} (₹{t.price})
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
                            <tr key={test.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 font-medium">
                                {test.name}
                              </td>
                              <td className="px-4 py-2 text-right">
                                ₹{test.price.toFixed(2)}
                              </td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  onClick={() => removeTest(test.id)}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  {/* Discount Inputs */}
                  <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                    <h4 className="font-bold text-xs text-gray-500 uppercase">
                      Discount Settings
                    </h4>
                    <div className="flex gap-2">
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="border rounded px-2 py-1 text-sm bg-white outline-none"
                      >
                        <option value="amount">Amount (₹)</option>
                        <option value="percent">Percent (%)</option>
                      </select>
                      <input
                        type="number"
                        value={discountValue}
                        onChange={(e) =>
                          setDiscountValue(Number(e.target.value))
                        }
                        className="border rounded px-3 py-1 text-sm w-full outline-none"
                        placeholder="Enter value"
                      />
                      <select
                        value={discountReason}
                        onChange={(e) => setDiscountReason(e.target.value)}
                        className="border rounded px-2 py-1 text-sm bg-white outline-none"
                      >
                        <option value="staff">Staff reference</option>
                        <option value="sample">Sample</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                    <h4 className="font-bold text-xs text-gray-500 uppercase">
                      Discount Settings
                    </h4>
                    <div className="flex gap-2">
                      <div className="col-span-3 bg-white p-4 rounded-lg border mt-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Cash Collected (₹)
                        </label>
                        <input
                          type="number"
                          value={cashReceived}
                          onChange={(e) =>
                            setCashReceived(Number(e.target.value))
                          }
                          className="w-full border rounded px-3 py-2 text-sm outline-none"
                          placeholder="Enter cash amount"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Final Calculations Show */}
                  <div className="md:col-span-2 grid grid-cols-3 gap-4 bg-teal-50 p-4 rounded-lg border border-teal-100">
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        Gross Total
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        ₹{calculations.grossTotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-red-500 uppercase">
                        Discount (-)
                      </p>
                      <p className="text-xl font-bold text-red-600">
                        ₹{calculations.discountAmt.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center bg-red-100 text-red-700 p-2 rounded">
                      <p className="text-xs font-bold uppercase">Due Amount</p>
                      <p className="text-xl font-extrabold">
                        ₹{calculations.dueAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center bg-teal-600 text-white p-2 rounded shadow-md">
                      <p className="text-xs font-bold uppercase opacity-80">
                        Net Payable
                      </p>
                      <p className="text-xl font-extrabold font-mono">
                        ₹{calculations.netAmount.toFixed(2)}
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

        <footer className="bg-blue-900 text-white text-xs py-3 text-center">
          © 2026 Accurate Diagnostic Center. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Register;
