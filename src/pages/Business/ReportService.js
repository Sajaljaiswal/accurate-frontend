// src/utils/reportService.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateDetailedBusinessReport = (stats, startDate, endDate) => {
  const doc = new jsPDF("l", "mm", "a4"); 
  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header Logic
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("ACCURATE DIAGNOSTIC CENTER", 14, 15);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("7/15128/2, Janaura, NH-27, Ayodhya, Uttar Pradesh", 14, 21);
  doc.text("Contact Nos : 8009904250 | Email: accurate@gmail.com", 14, 26);

  // 2. Title Logic
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Center Collection (Account) Report", pageWidth / 2, 35, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Period From: ${startDate} To: ${endDate}`, pageWidth / 2, 41, { align: "center" });

  // --- TOTALS CALCULATION ---
  let totalGross = 0;
  let totalDiscount = 0;
  let totalNet = 0;
  let totalCash = 0;
  let totalBalance = 0;

  // 3. Detailed Transaction Table Mapping
  const tableRows = stats.fullPatientList.map((b, index) => {
    const displayId = b.labNo || b._id?.slice(-6).toUpperCase() || b.id?.slice(-6).toUpperCase() || "N/A";
    
    // Convert to numbers safely for calculation
    const gross = b.billing?.grossTotal || 0;
    const disc = b.billing?.discountValue || 0;
    const net = b.billing?.netAmount || 0;
    const cash = b.billing?.cashReceived || 0;
    const bal = b.balAmt || 0;

    // Accumulate totals
    totalGross += gross;
    totalDiscount += disc;
    totalNet += net;
    totalCash += cash;
    totalBalance += bal;

    return [
      index + 1,
      displayId,
      b.firstName || "N/A",
      b.referredBy || "Self",
      b.panel || "SELF",
      gross.toFixed(2),
      disc.toFixed(2),
      net.toFixed(2),
      cash.toFixed(2),
      bal.toFixed(2),
    ];
  });

  // Add the Summary Total Row to the end of the table rows
  tableRows.push([
    { content: 'TOTALS', colSpan: 5, styles: { fontStyle: 'bold', halign: 'right', fillColor: [240, 240, 240] } },
    { content: totalGross.toFixed(2), styles: { fontStyle: 'bold', halign: 'right', fillColor: [240, 240, 240] } },
    { content: totalDiscount.toFixed(2), styles: { fontStyle: 'bold', halign: 'right', fillColor: [240, 240, 240] } },
    { content: totalNet.toFixed(2), styles: { fontStyle: 'bold', halign: 'right', fillColor: [240, 240, 240] } },
    { content: totalCash.toFixed(2), styles: { fontStyle: 'bold', halign: 'right', fillColor: [240, 240, 240] } },
    { content: totalBalance.toFixed(2), styles: { fontStyle: 'bold', halign: 'right', fillColor: [240, 240, 240] } },
  ]);

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
    }
  });

  // 4. Grand Totals (Summary Footer)
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setLineWidth(0.5);
  doc.line(14, finalY, pageWidth - 14, finalY);
  
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total Amount :", 100, finalY + 7);
  // Using the calculated totalNet for accuracy
  doc.text(`INR ${totalNet.toLocaleString()}`, pageWidth - 45, finalY + 7, { align: "right" });

  // 5. Page Info Logic
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Printed On: ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.getHeight() - 10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10);
  }
  const fileName = `Business_Report_${startDate}_to_${endDate}.pdf`;

  const pdfBlob = doc.output("bloburl");
  doc.autoPrint();
  window.open(pdfBlob);
//   doc.save(fileName);

};