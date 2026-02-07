import React, { useState, useEffect, useMemo } from "react";
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
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Sidebar from "../Sidebar";
import Navigation from "../Navigation";
import api from "../../api/axios";
import { generateLabReportPDF } from "./reportGenerator";
import { updatePatient } from "../../api/patientApi";
import JoditEditor from "jodit-react"; // Import Jodit


const LabReports = () => {
  const { id } = useParams(); // Get patient ID from URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeComment, setActiveComment] = useState(null); // { testId, type, value }
  const [isSignedOff, setIsSignedOff] = useState(false);
  const [expandedTests, setExpandedTests] = useState({}); // Track accordion open/close
  const [selectedTests, setSelectedTests] = useState({}); // Track checkboxes
  const [printedTests, setPrintedTests] = useState({}); // Track color change after print

 const handleEditorChange = (testId, data) => {
    setPatient((prev) => ({
      ...prev,
      tests: prev.tests.map((t) =>
        t.testId === testId ? { ...t, richTextContent: data } : t
      ),
    }));
  };

  const toggleAccordion = (testId) => {
    setExpandedTests((prev) => ({ ...prev, [testId]: !prev[testId] }));
  };

  // Toggle Selection Checkbox
  const toggleSelection = (testId) => {
    setSelectedTests((prev) => ({ ...prev, [testId]: !prev[testId] }));
  };

  const toggleSelectAll = () => {
    const allSelected = patient.tests.every((t) => selectedTests[t.testId]);
    const newState = {};
    patient.tests.forEach((t) => {
      newState[t.testId] = !allSelected;
    });
    setSelectedTests(newState);
  };
  const openCommentModal = (testId, type, currentValue) => {
    setActiveComment({
      testId,
      type,
      value: typeof currentValue === "string" ? currentValue : "",
    });
  };

  const config = useMemo(() => ({
    readonly: false,
    placeholder: "Design your report template here...",
    height: 500,
    toolbarButtonSize: "middle",
  
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_as_html",
    usePopup: false, // Prevents popups from showing
    popup: {
      table: [], // Explicitly clear table popups
      img: [],   // Explicitly clear image popups
      selection: [] // Clear text selection popups
    },
    // 🔥 IMPORTANT: disable cleaner
    cleanHTML: false,
  
    // Allow styling
    allowAttributes: {
      '*': ['style', 'class', 'cellspacing', 'cellpadding', 'border', 'align']
    },
  
    // Ensure formatting tags are preserved
    controls: {
      bold: {
        tags: ['strong', 'b']
      },
      italic: {
        tags: ['em', 'i']
      },
      underline: {
        tags: ['u']
      }
    },
  
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'fullsize'
    ],
  }), []);

  const handleReportTypeChange = (testId, type) => {
    const updatedTests = patient.tests.map((t) =>
      t.testId === testId ? { ...t, reportType: type } : t,
    );
    setPatient({ ...patient, tests: updatedTests });
  };
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await api.get(`/patients/${id}`);
        const data = res.data.data;

        const processedTests = data.tests.map((test) => {
          const masterTemplate = test.testId?.defaultResult || "";
          return {
            ...test,
            price: test.price,
            notes: test.notes || "",
            remarks: test.remarks || "",
            advice: test.advice || "",
            originalMasterTemplate: masterTemplate,
            testId: typeof test.testId === "object" ? test.testId._id : test.testId,
            reportType: test.reportType || (masterTemplate ? "text" : "range"),
            richTextContent: test.richTextContent && test.richTextContent.trim() !== ""
                ? test.richTextContent
                : masterTemplate,
          };
        });

        setPatient({ ...data, tests: processedTests });

        const initialSelect = {};
        const initialExpand = {};
        processedTests.forEach((t, index) => {
          initialSelect[t.testId] = true;
          initialExpand[t.testId] = index === 0;
        });
        setSelectedTests(initialSelect);
        setExpandedTests(initialExpand);
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
    if (!activeComment) return;
    const { testId, type, value } = activeComment;
    const key = type.toLowerCase();
    setPatient((prev) => ({
      ...prev,
      tests: prev.tests.map((t) =>
        t.testId === testId ? { ...t, [key]: value.trim() } : t
      ),
    }));
    setActiveComment(null);
  };

  const handlePrint = async () => {
    const testsToPrint = patient.tests.filter((t) => selectedTests[t.testId]);
    if (testsToPrint.length === 0) {
      alert("Please select at least one test to print.");
      return;
    }
    generateLabReportPDF({ ...patient, tests: testsToPrint }, isSignedOff);
    const updatedTests = patient.tests.map((t) => ({
      ...t,
      isPrinted: selectedTests[t.testId] ? true : t.isPrinted || false,
    }));
    try {
      await updatePatient(id, { tests: updatedTests });
      setPatient((prev) => ({ ...prev, tests: updatedTests }));
      const newlyPrintedMap = { ...printedTests };
      testsToPrint.forEach((t) => { newlyPrintedMap[t.testId] = true; });
      setPrintedTests(newlyPrintedMap);
    } catch (err) {
      console.error("Failed to update printed status:", err);
    }
  };

  const handleValueChange = (testId, newValue) => {
    const updatedTests = patient.tests.map((t) =>
      t.testId === testId ? { ...t, resultValue: newValue } : t
    );
    setPatient({ ...patient, tests: updatedTests });
  };

  const handleSaveResults = async () => {
    if (!patient || !patient.tests) return;
    setSaving(true);
    try {
      const normalizedTests = patient.tests.map((t) => ({
        ...t,
        testId: t.testId,
        name: t.name,
        reportType: t.reportType,
        resultValue: t.resultValue || "",
        richTextContent: t.richTextContent || "",
        unit: t.unit || "",
        referenceRange: t.referenceRange || "",
        defaultResult: t.defaultResult,
        notes: t.notes || "",
        remarks: t.remarks || "",
        advice: t.advice || "",
        status: t.status || "Completed",
      }));

      const res = await updatePatient(id, {
        tests: normalizedTests,
        isSignedOff,
      });

      const updateTemplatePromises = normalizedTests.map(async (test) => {
        if (test.reportType === "text" && test.defaultResult?.trim() === "") {
          try {
            await api.put(`lab/tests/${test.testId}`, {
              defaultResult: test.richTextContent,
            });
          } catch (e) { console.error("Template Save Error", e); }
        }
      });

      await Promise.all(updateTemplatePromises);

      if (res.data.success) {
        alert("Results saved successfully! ✅");
        setPatient((prev) => ({
          ...prev,
          ...res.data.data,
          tests: normalizedTests,
        }));
      }
    } catch (err) {
      console.error("Save Error:", err.response?.data);
      alert(err.response?.data?.message || "Failed to save");
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

  if (!patient) return <div className="p-10 text-center">Patient not found.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                
              <div>
                <h1 className="text-2xl font-semibold text-slate-700">Lab report</h1>
                <div className="flex gap-2 mt-1">
                  <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 font-bold rounded">
                    Reg no. {patient.registrationNumber} | {patient.labNumber}
                  </span>
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
                      <Edit size={12} className="text-slate-400" />
                      {new Date(patient.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Collected on:</span>
                    <div className="flex gap-1 border rounded px-1 text-xs items-center">
                      {new Date(patient.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                      <span className="border-l pl-1">--:--</span>{" "}
                      <Clock size={12} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Received on:</span>
                    <div className="flex gap-1 border rounded px-1 text-xs items-center">
                      {new Date(patient.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
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

            <div className="flex justify-between items-center mb-4 bg-white p-3 rounded border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                  onChange={toggleSelectAll}
                  checked={patient?.tests?.every((t) => selectedTests[t.testId])}
                />
                Select All Tests
              </label>
              <span className="text-xs text-slate-400">
                {Object.values(selectedTests).filter(Boolean).length} of{" "}
                {patient?.tests?.length} selected
              </span>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-12 border-y border-slate-800 text-[11px] font-bold uppercase py-2 mb-4 text-slate-600">
                <div className="col-span-5">TEST</div>
                <div className="col-span-3 text-center">VALUE</div>
                <div className="col-span-2">UNIT</div>
                <div className="col-span-2">REFERENCE</div>
              </div>

              {patient.tests.map((test) => {
                const isExpanded = expandedTests[test.testId];
                const isSelected = selectedTests[test.testId];
                const isPrinted = test.isPrinted || false;

                return (
                  <div
                    key={test.testId}
                    className={`mb-4 overflow-hidden bg-white border rounded-lg shadow-sm transition-all duration-300 ${
                      isPrinted
                        ? "border-emerald-200 bg-emerald-50/30"
                        : "border-slate-200"
                    }`}
                  >
                    {/* --- ACCORDION HEADER --- */}
                    <div
                      className={`flex items-center justify-between p-4 cursor-pointer select-none ${
                        isExpanded ? "bg-slate-50/50" : ""
                      }`}
                      onClick={() => toggleAccordion(test.testId)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-blue-600 cursor-pointer"
                          checked={!!isSelected}
                          onChange={() => toggleSelection(test.testId)}
                          onClick={(e) => e.stopPropagation()} // Stop accordion toggle when checking box
                        />
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-base transition-colors ${
                              isPrinted ? "text-emerald-700" : "text-slate-800"
                            }`}
                          >
                            {test.name}
                          </span>
                          {isPrinted && (
                            <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                              <CheckCircle size={10} /> PRINTED
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{test.reportType === "text" ? "Doc Mode" : "Range Mode"}</span>
                        {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 border-t border-slate-100">
                         <div className="flex justify-start mb-4">
                          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
                            <button
                              onClick={() =>
                                handleReportTypeChange(test.testId, "range")
                              }
                              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                                test.reportType === "range"
                                  ? "bg-white shadow-sm text-blue-600"
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              Range Based
                            </button>

                            <button
                              onClick={() =>
                                handleReportTypeChange(test.testId, "text")
                              }
                              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                                test.reportType === "text"
                                  ? "bg-white shadow-sm text-blue-600"
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              Document (Text)
                            </button>
                          </div>
                        </div> 
                        
                        <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                          {test.reportType === "text" ? (
                            <div className="ck-editor-wrapper border border-slate-200 rounded-md overflow-hidden bg-white min-h-[400px]">
                              <JoditEditor
                              value={test.richTextContent || test.defaultResult || ""}
                              config={config}
                              onBlur={(newContent) => handleEditorChange(test.testId, newContent)}
                            />
                            </div>
                          ) : (
                            <div className="grid grid-cols-12 items-center text-sm gap-6">
                              <div className="col-span-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Result Value</label>
                                <input type="text" className="w-full border border-slate-300 rounded-md p-2 outline-none bg-white font-bold text-blue-900" value={test.resultValue || ""} onChange={(e) => handleValueChange(test.testId, e.target.value)} />
                              </div>
                              <div className="col-span-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Unit</label>
                                <div className="p-2 bg-white border border-slate-200 rounded-md text-slate-600">{test.unit || "N/A"}</div>
                              </div>
                              <div className="col-span-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Ref. Range</label>
                                <div className="p-2 bg-white border border-slate-200 rounded-md text-slate-700 font-bold italic">{test.referenceRange || "N/A"}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3 mt-4">
                          {["Notes", "Remarks", "Advice"].map((item) => {
                            const key = item.toLowerCase();
                            const hasValue = !!test[key];
                            return (
                              <button key={item} onClick={() => openCommentModal(test.testId, item, test[key])} className={`text-[10px] font-bold uppercase flex items-center gap-1 border rounded-full px-3 py-1 transition-all ${hasValue ? "bg-blue-600 border-blue-600 text-white" : "text-slate-500 border-slate-200 hover:border-slate-400"}`}>
                                <Plus size={12} /> {item} {hasValue && "✓"}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end items-center shadow-lg z-50">
            <div className="flex gap-3">
              <button onClick={() => setIsSignedOff(!isSignedOff)} className={`text-[11px] px-3 py-1.5 rounded font-bold flex items-center gap-2 transition-all ${isSignedOff ? "bg-emerald-600 text-white shadow-lg" : "bg-slate-200 text-slate-500 hover:bg-slate-300"}`}>
                <CheckCircle size={14} /> {isSignedOff ? "Report Signed Off" : "Click to Sign Off"}
              </button>
              <button onClick={handlePrint} className="bg-slate-800 text-white px-6 py-2 text-sm font-bold rounded flex items-center gap-2 transition-colors hover:bg-black"><Printer size={16} /> Print PDF</button>
              <button onClick={handleSaveResults} disabled={saving} className="bg-blue-600 text-white px-8 py-2 text-sm font-bold rounded flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-300"><Save size={16} /> {saving ? "Saving..." : "Save only"}</button>
            </div>
          </div>

          <div className="h-24"></div>

          {/* Modal logic omitted for brevity - same as your original */}
          {activeComment && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-700">Add {activeComment.type}</h3>
                        <button onClick={() => setActiveComment(null)}><X size={20} /></button>
                    </div>
                    <textarea autoFocus className="w-full border rounded-md p-3 min-h-[150px] mb-4 outline-none focus:ring-2 focus:ring-blue-500" value={activeComment.value} onChange={(e) => setActiveComment(prev => ({ ...prev, value: e.target.value }))} />
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setActiveComment(null)} className="px-4 py-2">Cancel</button>
                        <button onClick={saveComment} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Done</button>
                    </div>
                </div>
            </div>
          )}

          {/* Global Style for CKEditor height */}
          <style>{`
            .ck-editor__editable_inline {
                min-height: 400px;
            }
            .ck-editor-wrapper {
                width: 100%;
            }
          `}</style>
        </main>
      </div>
    </div>
  );
};

export default LabReports;