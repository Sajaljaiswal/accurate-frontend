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
import api from "../../api/axios";

const LabReports = () => {
  const { id } = useParams(); // Get patient ID from URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeComment, setActiveComment] = useState(null); // { testId, type, value }
  const [isSignedOff, setIsSignedOff] = useState(false);

  const SIGNATURE_IMAGE_URL =
    "data:image/png;base64,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";
  const toggleReportType = (testId) => {
    const updatedTests = patient.tests.map((t) =>
      t.testId === testId
        ? { ...t, reportType: t.reportType === "text" ? "range" : "text" }
        : t
    );
    setPatient({ ...patient, tests: updatedTests });
  };

  const handleReportTypeChange = (testId, type) => {
    const updatedTests = patient.tests.map((t) =>
      t.testId === testId ? { ...t, reportType: type } : t
    );
    setPatient({ ...patient, tests: updatedTests });
  };

  const handleEditorChange = (testId, data) => {
    const updatedTests = patient.tests.map((t) =>
      t.testId === testId ? { ...t, richTextContent: data } : t
    );
    setPatient({ ...patient, tests: updatedTests });
  };

  const openCommentModal = (testId, type, currentValue) => {
    setActiveComment({ testId, type, value: currentValue || "" });
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await api.get(`/patients/${id}`);
        const data = res.data.data;

        const processedTests = data.tests.map((test) => {
          const template = test.testId?.defaultResult;

          if (
            template &&
            (!test.richTextContent || test.richTextContent.trim() === "")
          ) {
            return {
              ...test,
              // Flatten the data back so the rest of your app doesn't break
              testId: test.testId._id,
              reportType: "text",
              richTextContent: template,
            };
          }

          // Ensure testId remains a string for your keys/APIs
          return {
            ...test,
            testId:
              typeof test.testId === "object" ? test.testId._id : test.testId,
            reportType: test.reportType || "range",
          };
        });

        setPatient({ ...data, tests: processedTests });
        if (data.isSignedOff) setIsSignedOff(true);
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

  const handlePrint = async () => {
    if (!patient) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = { top: 40, bottom: 30, left: 15, right: 15 };

    // --- Header & Metadata Setup ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ACCURATE DIAGNOSTIC CENTER", margin.left, 15);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const headerLines = [
      "7/15128/2, Janaura, NH-27, Ayodhya, Uttar Pradesh",
      "Contact Nos : 8009904250",
      "Branch Ayodhya Contact No: 05267315486, +8924962394",
      "Email: accurate@gmail.com",
      "Website: www.accuratediagnostics.co.in",
    ];
    headerLines.forEach((line, index) =>
      doc.text(line, margin.left, 22 + index * 4)
    );

    doc.setFillColor(230, 230, 230);
    doc.rect(15, 42, pageWidth - 30, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Lab Report", 18, 46);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Patient Name : ${patient.title} ${patient.firstName}`, 15, 58);
    doc.text(`Age / Sex : ${patient.age} Y / ${patient.gender}`, 15, 64);
    doc.text(`Referred By : ${patient.referredBy || "Self"}`, 15, 70);
    doc.text(`Reg No : ${patient.registrationNumber}`, 130, 58);
    doc.text(`Lab No : ${patient.labNumber}`, 130, 64);

    const now = new Date();
    doc.text(
      `Reported On : ${now.toLocaleDateString(
        "en-GB"
      )} ${now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`,
      130,
      70
    );

    // --- Prepare HTML Container (Signature removed from here) ---
    const tempContainer = document.createElement("div");
    tempContainer.style.width = "180mm";
    tempContainer.style.fontFamily = "helvetica";

    let fullHtmlContent = `
    <style>
      .test-section { margin-left: 0px; margin-bottom: 25px; page-break-inside: avoid; }
      .test-title { font-weight: bold; font-size: 14px; margin-bottom: 8px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 10pt; }
      table, th, td { border: 1px solid black; }
      th, td { padding: 6px; text-align: left; }
    </style>
  `;

    patient.tests.forEach((test) => {
      if (test.reportType === "text") {
        fullHtmlContent += `<div class="test-section"><div class="test-title">${test.name.toUpperCase()}</div><div>${
          test.richTextContent || "No findings recorded."
        }</div></div>`;
      } else {
        fullHtmlContent += `
        <div class="test-section">
          <div class="test-title">${test.name.toUpperCase()}</div>
          <table>
            <tr style="background-color: #eee;"><th>Result</th><th>Unit</th><th>Reference</th></tr>
            <tr><td>${test.resultValue || "---"}</td><td>${
          test.unit || ""
        }</td><td>${test.referenceRange || ""}</td></tr>
          </table>
        </div>`;
      }
    });

    tempContainer.innerHTML = fullHtmlContent;
    document.body.appendChild(tempContainer);

    // --- Render HTML ---
    await doc.html(tempContainer, {
      x: margin.left,
      y: margin.top,
      width: 180,
      windowWidth: 750,
      autoPaging: "text",
      margin: [margin.top, margin.right, margin.bottom, margin.left],
      callback: function (doc) {
        const totalPages = doc.internal.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);

          // 1. Draw Footer Line
          doc.line(
            margin.left,
            pageHeight - 25,
            pageWidth - margin.right,
            pageHeight - 25
          );

          // 2. Draw Authorised Signatory Text
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.text("Authorised Signatory", pageWidth - 60, pageHeight - 15);

          // 3. ADD SIGNATURE IMAGE (If signed off)
          // Positioned right above the "Authorised Signatory" text
          if (isSignedOff) {
            // Parameters: image, x, y, width, height
            // x: pageWidth - 55 (aligned with text)
            // y: pageHeight - 40 (placed above line)
            doc.addImage(
              SIGNATURE_IMAGE_URL,
              "PNG",
              pageWidth - 55,
              pageHeight - 40,
              35,
              12
            );
          }

          // 4. Draw Page Numbers
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.text(
            `Page ${i} of ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
          );
        }

        document.body.removeChild(tempContainer);
        window.open(doc.output("bloburl"), "_blank");
      },
    });
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
      // 1. Save the patient's specific lab results
      const res = await api.put(`/patients/${id}/results`, {
        tests: patient.tests,
      });

      // 2. Logic to update the Master Template (defaultResult)
      // We loop through the tests currently in the state
      const updateTemplatePromises = patient.tests.map(async (test) => {
        // Check if:
        // - It's a text report
        // - richTextContent has data
        // - The ORIGINAL defaultResult was missing/empty (based on what we fetched)
        if (
          test.reportType === "text" &&
          test.richTextContent &&
          test.richTextContent.trim() !== "" &&
          (!test.defaultResult || test.defaultResult.trim() === "")
        ) {
          try {
            // Update the global test definition so next time it's pre-filled
            // NOTE: Ensure your backend has this route: PUT /tests/:id
            await api.put(`lab/tests/${test.testId}`, {
              defaultResult: test.richTextContent,
            });
            console.log(`Template updated for test: ${test.name}`);
          } catch (templateErr) {
            console.error("Failed to update master template:", templateErr);
          }
        }
      });

      await Promise.all(updateTemplatePromises);

      if (res.data.success) {
        alert("Results saved and templates updated! ✅");
        const updatedTests = patient.tests.map(t => ({
        ...t,
        defaultResult: t.reportType === "text" && t.richTextContent ? t.richTextContent : t.defaultResult
      }));
      setPatient({ ...patient, tests: updatedTests });
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
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setIsSignedOff(!isSignedOff)}
                    className={`text-[11px] px-3 py-1.5 rounded font-bold flex items-center gap-2 transition-all ${
                      isSignedOff
                        ? "bg-emerald-600 text-white shadow-lg"
                        : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                    }`}
                  >
                    <CheckCircle size={14} />
                    {isSignedOff ? "Report Signed Off" : "Click to Sign Off"}
                  </button>
                </div>
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
                    {/* REPORT TYPE TOGGLE */}
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                      <label
                        className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer transition-all ${
                          test.reportType === "range"
                            ? "bg-white shadow-sm text-blue-600 font-bold"
                            : "text-slate-500"
                        }`}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          name={`type-${test.testId}`}
                          checked={test.reportType === "range"}
                          onChange={() =>
                            handleReportTypeChange(test.testId, "range")
                          }
                        />
                        <span className="text-[11px] uppercase tracking-wider">
                          Range Based
                        </span>
                      </label>

                      <label
                        className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer transition-all ${
                          test.reportType === "text"
                            ? "bg-white shadow-sm text-blue-600 font-bold"
                            : "text-slate-500"
                        }`}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          name={`type-${test.testId}`}
                          checked={test.reportType === "text"}
                          onChange={() =>
                            handleReportTypeChange(test.testId, "text")
                          }
                        />
                        <span className="text-[11px] uppercase tracking-wider">
                          Document (Text)
                        </span>
                      </label>
                    </div>
                  </div>

                  {test.reportType === "text" ? (
                    /* TEXT MODE: CKEDITOR */
                    <div className="border border-slate-200 rounded-md overflow-hidden">
                      <CKEditor
                        editor={ClassicEditor}
                       data={test.richTextContent || test.defaultResult || ""}
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
