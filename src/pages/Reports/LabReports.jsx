import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Printer,
  Edit,
  Save,
  CheckCircle,
  Clock,
  Calendar,
  Plus,
  Loader2,
  X,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import Sidebar from "../Sidebar";
import Navigation from "../Navigation";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const LabReports = () => {
  const { id } = useParams(); // Get patient ID from URL
  console.log("LabReports component loaded with ID:", id);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeComment, setActiveComment] = useState(null); // { testId, type, value }

  const toggleReportType = (testId) => {
    const updatedTests = patient.tests.map((t) =>
      t.testId === testId
        ? { ...t, reportType: t.reportType === "text" ? "range" : "text" }
        : t
    );
    setPatient({ ...patient, tests: updatedTests });
  };

  const handleEditorChange = (testId, data) => {
    const updatedTests = patient.tests.map((t) =>
      t.testId === testId ? { ...t, richTextContent: data } : t
    );
    setPatient({ ...patient, tests: updatedTests });
  };
  // 1. Function to open the comment modal
  const openCommentModal = (testId, type, currentValue) => {
    setActiveComment({ testId, type, value: currentValue || "" });
  };

  // Fetch Patient Data on Load
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/patients/${id}`);
        setPatient(res.data.data);
        console.log("Fetched patient data:", res.data.data);
      } catch (err) {
        console.error("Error fetching patient:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [id]);

  const saveComment = () => {
    const { testId, type, value } = activeComment;
    const key = type.toLowerCase();

    const updatedTests = patient.tests.map((t) =>
      t.testId === testId ? { ...t, [key]: value } : t
    );

    setPatient({ ...patient, tests: updatedTests });
    setActiveComment(null);
  };

  const handlePrint = () => {
    if (!patient) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // ===== HEADER =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ACCURATE DIAGNOSTIC CENTER", 15, 15);

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
      doc.text(line, 15, 22 + index * 4);
    });

    // ===== TITLE BAR =====
    doc.setFillColor(230, 230, 230);
    doc.rect(15, 42, pageWidth - 30, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Lab Report", 18, 46);

    // ===== PATIENT INFO =====
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text(`Patient Name : ${patient.title} ${patient.firstName}`, 15, 58);
    doc.text(`Age / Sex : ${patient.age} Y / ${patient.gender}`, 15, 64);
    doc.text(`Referred By : ${patient.referredBy || "Self"}`, 15, 70);
    doc.text(`Reg No : ${patient.registrationNumber}`, 130, 58);
    doc.text(`Lab No : ${patient.labNumber}`, 130, 64);

    const now = new Date();
    const date = now.toLocaleDateString("en-GB");
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    doc.text(`Reported On : ${date} ${time}`, 130, 70);

    const tableData = [];

    patient.tests.forEach((test, i) => {
      if (test.reportType === "text") {
        // For Text reports, we might need a separate page or a large block
        // Clean HTML tags for simple PDF printing or use a specialized library
        const cleanText = test.richTextContent?.replace(/<[^>]*>?/gm, "") || "";
        doc.text(
          `${test.name}: ${cleanText}`,
          15,
          doc.lastAutoTable?.finalY + 10 || 80
        );
      } else {
        // Main Test Row
        tableData.push([
          i + 1,
          test.name,
          test.resultValue || "---",
          test.unit,
          test.referenceRange,
        ]);

        // Add conditional rows for Notes/Remarks/Advice
        if (test.notes)
          tableData.push([
            {
              content: `Note: ${test.notes}`,
              colSpan: 5,
              styles: { fontStyle: "italic", textColor: [100, 100, 100] },
            },
          ]);
        if (test.remarks)
          tableData.push([
            {
              content: `Remark: ${test.remarks}`,
              colSpan: 5,
              styles: { fontStyle: "italic", textColor: [100, 100, 100] },
            },
          ]);
        if (test.advice)
          tableData.push([
            {
              content: `Advice: ${test.advice}`,
              colSpan: 5,
              styles: { fontStyle: "italic", textColor: [100, 100, 100] },
            },
          ]);
      }
    });

    autoTable(doc, {
      startY: 80,
      head: [["#", "Test Name", "Result", "Unit", "Reference"]],
      body: tableData,
      theme: "plain", // Use plain to better show secondary rows
      styles: { fontSize: 8 },
      headStyles: { fillColor: [220, 220, 220] },
      margin: { left: 15, right: 15 },
      didParseCell: function (data) {
        // Add border for main test rows only
        if (typeof data.row.raw[0] === "number") {
          data.cell.styles.borderBottom = 0.1;
        }
      },
    });

    // ===== FOOTER =====
    const footerY = doc.lastAutoTable.finalY + 20;
    doc.line(15, footerY, pageWidth - 15, footerY);
    doc.setFontSize(8);
    doc.text("Authorised Signatory", pageWidth - 60, footerY + 8);

    // ===== PRINT PREVIEW (NO DOWNLOAD) =====
    doc.autoPrint();
    window.open(doc.output("bloburl"));
  };

  const handleValueChange = (testId, newValue) => {
    const updatedTests = patient.tests.map((t) =>
      t.testId === testId ? { ...t, resultValue: newValue } : t
    );
    setPatient({ ...patient, tests: updatedTests });
  };

  // Update this function in your LabReports.jsx
  const handleSaveResults = async () => {
    if (!patient || !patient.tests) return;

    setSaving(true);
    try {
      // Check console to see if IDs are correct
      console.log("Sending tests to save:", patient.tests);

      const res = await axios.put(
        `http://localhost:5000/api/patients/${id}/results`,
        {
          tests: patient.tests, // Send the updated tests array
        }
      );

      if (res.data.success) {
        alert("Results saved successfully! ✅");
      }
    } catch (err) {
      console.error("Save Error Details:", err.response?.data);
      alert(err.response?.data?.message || "Failed to save results");
    } finally {
      setSaving(false);
    }
  };
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  if (!patient)
    return <div className="p-10 text-center">Patient not found.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="p-8">
            {/* Top Header Bar */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-slate-700">
                  Lab report
                </h1>
                <div className="flex gap-2 mt-1">
                  <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 font-bold rounded">
                    Reg no. {patient.registrationNumber} | {patient.labNumber}
                  </span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex gap-2 mb-4">
                <span className="bg-emerald-500 text-white text-[11px] px-2 py-1 rounded font-medium flex items-center gap-1">
                  <CheckCircle size={12} /> Signed off
                </span>
                <span className="bg-emerald-500 text-white text-[11px] px-2 py-1 rounded font-medium">
                  Report ready sms sent
                </span>
              </div>
            </div>

            {/* Patient Info Card */}
            <div className="border border-slate-300 rounded overflow-hidden mb-4">
              <div className="grid grid-cols-2 text-sm divide-x divide-slate-200">
                <div className="p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient Name:</span>
                    <span className="font-medium">
                      {patient.title} {patient.firstName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Age / Sex:</span>
                    <span className="font-medium">
                      {patient.age} YRS / {patient.gender}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Referred By:</span>
                    <span className="font-medium">
                      {patient.referredBy || "Self"}
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Registered on:</span>
                    <span className="font-medium flex items-center gap-2">
                      <Edit size={12} className="text-slate-400" /> 27/12/2025
                      11:40 AM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Collected on:</span>
                    <div className="flex gap-1 border rounded px-1 text-xs items-center">
                      <span>27-12-2025</span> <Calendar size={12} />{" "}
                      <span className="border-l pl-1">--:--</span>{" "}
                      <Clock size={12} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Received on:</span>
                    <div className="flex gap-1 border rounded px-1 text-xs items-center">
                      <span>27-12-2025</span> <Calendar size={12} />{" "}
                      <span className="border-l pl-1">--:--</span>{" "}
                      <Clock size={12} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Reported on:</span>
                    <div className="flex gap-1 border rounded px-1 text-xs items-center bg-slate-50">
                      <span>{new Date().toLocaleDateString()}</span>{" "}
                      <Calendar size={12} />
                      <span className="border-l pl-1">
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>{" "}
                      <Clock size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Test Results Table */}
            <div className="mb-6">
              <div className="grid grid-cols-12 border-y border-slate-800 text-[11px] font-bold uppercase py-2 mb-4">
                <div className="col-span-5">TEST</div>
                <div className="col-span-3 text-center">VALUE</div>
                <div className="col-span-2">UNIT</div>
                <div className="col-span-2">REFERENCE</div>
              </div>

              {patient.tests.map((test) => (
                <div
                  key={test.testId}
                  className="mb-10 p-4 bg-white border rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Edit size={14} className="text-slate-400" />
                      <span className="font-bold text-blue-900">
                        {test.name}
                      </span>
                    </div>

                    {/* REPORT TYPE TOGGLE */}
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                      <label className="text-[10px] font-bold uppercase text-slate-500">
                        Range
                      </label>
                      <input
                        type="checkbox"
                        className="toggle-checkbox" // Style this as a switch in CSS
                        checked={test.reportType === "text"}
                        onChange={() => toggleReportType(test.testId)}
                      />
                      <label className="text-[10px] font-bold uppercase text-slate-500">
                        Text/Doc
                      </label>
                    </div>
                  </div>

                  {test.reportType === "text" ? (
                    /* TEXT MODE: CKEDITOR */
                    <div className="border border-slate-200 rounded-md overflow-hidden">
                      <CKEditor
                        editor={ClassicEditor}
                        data={test.richTextContent || ""} // Loads data if exists, else empty
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          handleEditorChange(test.testId, data);
                        }}
                      />
                    </div>
                  ) : (
                    /* RANGE MODE: Standard Value/Unit/Ref */
                    <div className="grid grid-cols-12 items-center text-sm gap-4">
                      <div className="col-span-4">
                        <label className="text-[10px] text-gray-400 block">
                          Result Value
                        </label>
                        <input
                          type="text"
                          className="w-full border border-slate-300 rounded p-1.5 focus:ring-1 focus:ring-blue-400 outline-none"
                          value={test.resultValue || ""}
                          onChange={(e) =>
                            handleValueChange(test.testId, e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="text-[10px] text-gray-400 block">
                          Unit
                        </label>
                        <span className="font-medium text-slate-600">
                          {test.unit || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-4">
                        <label className="text-[10px] text-gray-400 block">
                          Reference Range
                        </label>
                        <span className="font-bold text-slate-700">
                          {test.referenceRange || "N/A"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions per test */}
                  <div className="flex gap-4 ml-6 mt-4">
                    {["Notes", "Remarks", "Advice"].map((item) => {
                      const key = item.toLowerCase();
                      const hasValue = !!test[key]; // Check if this test already has this field

                      return (
                        <button
                          key={item}
                          onClick={() =>
                            openCommentModal(test.testId, item, test[key])
                          }
                          className={`text-[11px] flex items-center gap-1 border rounded-full px-2 py-0.5 transition-all ${
                            hasValue
                              ? "bg-blue-50 border-blue-300 text-blue-700 font-bold"
                              : "text-slate-500 border-slate-200"
                          }`}
                        >
                          <Plus size={12} /> {item} {hasValue && "✓"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Sticky Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end items-center shadow-lg">
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="bg-slate-800 text-white px-6 py-2 text-sm font-bold rounded flex items-center gap-2 disabled:opacity-50"
              >
                <Printer size={16} /> Print PDF
              </button>

              <button
                onClick={handleSaveResults}
                disabled={saving}
                className="bg-blue-600 text-white px-8 py-2 text-sm font-bold rounded flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-300"
              >
                <Save size={16} /> {saving ? "Saving..." : "Save only"}
              </button>
            </div>
          </div>
          <div className="h-24 print:hidden"></div>

          {/* Comment Modal */}
          {activeComment && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-bold text-slate-700 capitalize">
                    Add {activeComment.type} for Test
                  </h3>
                  <button onClick={() => setActiveComment(null)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <textarea
                    autoFocus
                    className="w-full border border-slate-300 rounded-md p-3 min-h-[150px] outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${activeComment.type} here...`}
                    value={activeComment.value}
                    onChange={(e) =>
                      setActiveComment({
                        ...activeComment,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="p-4 border-t flex justify-end gap-3">
                  <button
                    onClick={() => setActiveComment(null)}
                    className="px-4 py-2 text-slate-600 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveComment}
                    className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LabReports;
