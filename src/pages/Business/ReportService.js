// src/utils/reportService.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateDetailedBusinessReport = (stats, startDate, endDate) => {
  const doc = new jsPDF("l", "mm", "a4"); // Landscape for wide table
  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header (Accurate Diagnostic Center Identity)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("ACCURATE DIAGNOSTIC CENTER", 14, 15);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("7/15128/2, Janaura, NH-27, Ayodhya, Uttar Pradesh", 14, 21);
  doc.text("Contact Nos : 8009904250 | Email: accurate@gmail.com", 14, 26);

  // 2. Report Title & Period
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Center Collection (Account) Report", pageWidth / 2, 35, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Period From: ${startDate} To: ${endDate}`, pageWidth / 2, 41, { align: "center" });

  // 3. Detailed Transaction Table
 // 3. Detailed Transaction Table
const tableRows = stats.fullPatientList.map((b, index) => {
  const displayId = b.labNo || b._id?.slice(-6).toUpperCase() || b.id?.slice(-6).toUpperCase() || "N/A";

  return [
    index + 1,
    displayId,
    b.firstName || "N/A",
    b.referredBy || "Self",
    b.panel || "SELF",
    (b.billing.grossTotal || 0).toFixed(2),
    (b.billing.discountValue || 0).toFixed(2),
    (b.billing.netAmount || 0).toFixed(2),
    (b.billing.cashReceived || 0).toFixed(2),
    (b.balAmt || 0).toFixed(2),
  ];
});
  autoTable(doc, {
    startY: 48,
    head: [['S No', 'LabNo', 'PatientName', 'DoctorName', 'PanelName', 'Gross Amt', 'Dis Amt', 'NetAmt', 'AmtCash', 'BalAmt']],
    body: tableRows,
    theme: 'plain',
    styles: { fontSize: 7, cellPadding: 1 },
    headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [0, 0, 0], 
        fontStyle: 'bold', 
        lineWidth: 0.1, 
        lineColor: [200, 200, 200] 
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 25 },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'right' },
      10: { halign: 'right' },
      11: { halign: 'right' },
      12: { halign: 'right' },
    }
  });

  // 4. Grand Totals (Summary Footer)
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setLineWidth(0.5);
  doc.line(14, finalY, pageWidth - 14, finalY);
  
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total Amount :", 100, finalY + 7);
  doc.text(`INR ${stats.totalRevenue.toLocaleString()}`, pageWidth - 45, finalY + 7, { align: "right" });

  // 5. Page Info
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Printed On: ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.getHeight() - 10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10);
  }

  const pdfBlob = doc.output("bloburl");
  window.open(pdfBlob);
};