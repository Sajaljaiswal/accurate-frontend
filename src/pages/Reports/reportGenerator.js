import jsPDF from "jspdf";

/**
 * Generates and opens a Lab Report PDF
 * @param {Object} patient - The patient data object
 * @param {boolean} isSignedOff - Whether to include the signature
 */
export const generateLabReportPDF = async (patient, isSignedOff) => {
  if (!patient) return;

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = { top: 40, bottom: 30, left: 15, right: 15 };
  
  
  const SIGNATURE_IMAGE_URL = "data:image/png;base64,..."; // Keep your base64 string here

  // --- Header & Metadata ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ACCURATE DIAGNOSTIC CENTER", margin.left, 15);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const headerLines = [
    "7/15128/2, Janaura, NH-27, Ayodhya, Uttar Pradesh",
    "Contact Nos : 8009904250",
    "Email: accurate@gmail.com",
  ];
  headerLines.forEach((line, index) => doc.text(line, margin.left, 22 + index * 4));

  doc.setFillColor(230, 230, 230);
  doc.rect(15, 42, pageWidth - 30, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Lab Report", 18, 46);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Patient Name : ${patient.title} ${patient.firstName}`, 15, 58);
  doc.text(`Age / Sex : ${patient.age} Y / ${patient.gender}`, 15, 64);
  doc.text(`Reg No : ${patient.registrationNumber}`, 130, 58);

  // --- HTML Content Processing ---
  const tempContainer = document.createElement("div");
  // FIX: Force a specific width for calculation to prevent text overlap
  tempContainer.style.width = "750px"; 
  tempContainer.style.padding = "10px";
  tempContainer.style.fontFamily = "helvetica";
  tempContainer.style.lineHeight = "1.6";

  let fullHtmlContent = `
    <style>
      .test-section { margin-bottom: 25px; page-break-inside: avoid; }
      .test-title { font-weight: bold; font-size: 14px; margin-bottom: 8px; border-bottom: 1px solid #eee; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 10pt; }
      th, td { border: 1px solid black; padding: 6px; text-align: left; }
    </style>
  `;

  patient.tests.forEach((test) => {
    if (test.reportType === "text") {
      // FIX: Improved check for empty CKEditor content
      const content = test.richTextContent?.replace(/<[^>]*>?/gm, '').trim();
      const displayHtml = (content && content !== "") ? test.richTextContent : "No findings recorded.";

      fullHtmlContent += `
        <div class="test-section">
          <div class="test-title">${test.name.toUpperCase()}</div>
          <div>${displayHtml}</div>
        </div>`;
    } else {
      fullHtmlContent += `
        <div class="test-section">
          <div class="test-title">${test.name.toUpperCase()}</div>
          <table>
            <tr style="background-color: #eee;"><th>Result</th><th>Unit</th><th>Reference</th></tr>
            <tr>
                <td>${test.resultValue || "---"}</td>
                <td>${test.unit || ""}</td>
                <td>${test.referenceRange || ""}</td>
            </tr>
          </table>
        </div>`;
    }
  });

  tempContainer.innerHTML = fullHtmlContent;
  document.body.appendChild(tempContainer);

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
        
        // Footer Line
        doc.line(margin.left, pageHeight - 25, pageWidth - margin.right, pageHeight - 25);
        
        // Signatory
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Authorised Signatory", pageWidth - 60, pageHeight - 15);

        if (isSignedOff) {
          doc.addImage(SIGNATURE_IMAGE_URL, "PNG", pageWidth - 55, pageHeight - 40, 35, 12);
        }

        // Page Numbers
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      }
      document.body.removeChild(tempContainer);
      window.open(doc.output("bloburl"), "_blank");
    },
  });
}