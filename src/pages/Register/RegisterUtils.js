import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../img/acc.jpg";
export const generateSerialNumbers = () => {
  const regNo = Math.floor(10000 + Math.random() * 90000).toString();
  return { regNo };
};

export const printReceipt = (form, selectedTests, calculations) => {
  const { regNo } = generateSerialNumbers();
  const doc = new jsPDF();
  const rightX = 100;
  const now = new Date();

  const receiptDate = form?.createdAt ? new Date(form.createdAt) : new Date();

  const Reg_Date = receiptDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = now.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.addImage(logo, "PNG", 10, 10, 85, 30);

  // --- 1. HEADER (Laboratory Info) ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ACCURATE DIAGNOSTIC CENTER", rightX, 15, {
    align: "left",
  });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const headerLines = [
    "7/15128/2, Janaura, NH-27, Ayodhya, Uttar Pradesh",
    "Contact Nos : 8009904250",
    "Email: accurate@gmail.com",
    "Website: www.accuratediagnostics.co.in",
  ];
  headerLines.forEach((line, index) => {
    doc.text(line, rightX, 20 + index * 4, { align: "left" });
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
  doc.text(`${Reg_Date}`, rightValX, 64);

  doc.text(`Patient ID :`, rightColX, 70);
  doc.text(`157098`, rightValX, 70); // Static or from user context

  doc.text(`Lab No. :`, rightColX, 76);
  doc.setFont("helvetica", "bold");
  doc.text(`${form.labNumber || "LAB"}`, rightValX, 76);

  // --- 4. INVESTIGATION TABLE ---
  const tableData = selectedTests.map((t, index) => [
    index + 1,
    t.category?.name || "Diagnostic",
    t.name,
    "-",
    Number(t.price || t.defaultPrice || 0).toFixed(2),
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

  // --- 5. BILLING SUMMARY (FULL WIDTH + AMOUNT IN WORDS) ---

  // Helper: number to words (Indian style – enough for receipts)
  const numberToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (num === 0) return "Zero";
    if (num < 20) return a[num];
    if (num < 100)
      return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
    if (num < 1000)
      return (
        a[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 ? " " + numberToWords(num % 100) : "")
      );
    if (num < 100000)
      return (
        numberToWords(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 ? " " + numberToWords(num % 1000) : "")
      );

    return "";
  };

  let finalY = doc.lastAutoTable.finalY + 2;
  doc.setFontSize(8);
  doc.text(`Gross Amount :`, 160, finalY, { align: "right" });
  doc.text(`${(calculations.grossTotal ?? 0).toFixed(2)}`, 195, finalY, {
    align: "right",
  });

  finalY += 15;
  // Box for totals
  doc.rect(135, finalY, 60, 25);
  doc.text(`Discount Amount:`, 137, finalY + 5);
  doc.text(
    `${(calculations.discountAmount ?? 0).toFixed(2)}`,
    193,
    finalY + 5,
    {
      align: "right",
    }
  );

  doc.line(135, finalY + 8, 195, finalY + 8);

  // Net Amount (bold)
  doc.setFont("helvetica", "bold");
  doc.text(`Net Amount:`, 137, finalY + 13);
  doc.text(`${(calculations.netAmount ?? 0).toFixed(2)}`, 193, finalY + 13, {
    align: "right",
  });

  // Paid Amount
  doc.setFont("helvetica", "normal");
  doc.text(`Paid Amount:`, 137, finalY + 18);
  doc.text(`${(calculations.cashReceived ?? 0).toFixed(2)}`, 193, finalY + 18, {
    align: "right",
  });

  // Due Amount
  doc.text(`Due Amount:`, 137, finalY + 23);
  doc.text(`${(calculations.dueAmount ?? 0).toFixed(2)}`, 193, finalY + 23, {
    align: "right",
  });

  // ---- Amount in words (LEFT aligned) ----
  const paidAmount = Math.floor(calculations.cashReceived ?? 0);
  const paidWords = numberToWords(paidAmount);

  doc.setFont("helvetica", "bold");
  doc.text(`Received ${paidWords} Rupees Only`, 15, finalY + 32 + 8);
  // --- 6. FOOTER & SIGNATURE ---
  // footer base line
  const footerY = 270;
  doc.setFontSize(8);
  doc.text("Auth. Signatory", pageWidth - 45, footerY - 5);
  doc.line(15, footerY, pageWidth - 15, footerY);

  const createdBy = form?.createdBy || "System";

  // Left side footer info
  doc.setFontSize(7);
  doc.text(`Printed On: ${formattedDate} ${formattedTime}`, 15, footerY + 5);
  doc.text(`Created By: ${createdBy}`, 15, footerY + 9);

  // ---- Disclaimer ----
  const note =
    "This report is for diagnostic use only and is not valid for medico legal use.";
  doc.text(note, 15, footerY + 14);

  // ---- NOTE Section ----
  doc.setFont("helvetica", "bold");
  doc.text("NOTE", 15, footerY + 20);

  doc.setFont("helvetica", "normal");
  doc.text("* KINDLY DON'T ASK FOR THE REPORT WITHOUT SLIP.", 15, footerY + 24);

  // ---- Print ----
  doc.autoPrint();
  const pdfBlob = doc.output("bloburl");
  window.open(pdfBlob);
};
