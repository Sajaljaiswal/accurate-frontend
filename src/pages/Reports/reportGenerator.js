import jsPDF from "jspdf";

/**
 * Generates and opens a Lab Report PDF with fixed alignment.
 * @param {Object} patient - The patient data object
 * @param {boolean} isSignedOff - Whether to include the signature
 */
export const generateLabReportPDF = async (patient, isSignedOff) => {
  if (!patient) return;

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = { top: 20, bottom: 30, left: 15, right: 15 };
  const FOOTER_SPACE = 30; // space needed for footer

  const SIGNATURE_IMAGE_URL = "data:image/png;base64,...";

  const infoStartY = 35;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  // Outer Box
  doc.rect(15, infoStartY, pageWidth - 30, 38);

  // LEFT COLUMN
  const leftX = 18;
  let y = infoStartY + 6;

  doc.text(`Patient Name : ${patient.firstName}`, leftX, y);
  y += 6;
  doc.text(`Age / Sex : ${patient.age} Years / ${patient.gender}`, leftX, y);
  y += 6;
  doc.text(`Referred By : ${patient.referredBy || "-"}`, leftX, y);
  y += 6;
  doc.text(`Ref. Lab/Hosp : ${patient.referredBy || "-"}`, leftX, y);
  y += 6;
  doc.text(`Client Name : ${patient.panel?.name || "-"}`, leftX, y);
  y += 6;
  doc.text(`Client Code : ${patient.panel?.code || "-"}`, leftX, y);

  // RIGHT COLUMN
  const rightX = pageWidth / 2 + 10;
  y = infoStartY + 6;

  doc.text(`Barcode No. : ${patient.barcode || "-"}`, rightX, y);
  y += 6;
  doc.text(`Lab No. : ${patient.labNumber}`, rightX, y);
  y += 6;
  doc.text(
    `Reg Date : ${new Date(patient.createdAt).toLocaleString("en-GB")}`,
    rightX,
    y
  );
  y += 6;
  doc.text(`Sample Rec. Date : ${patient.sampleReceivedAt || "-"}`, rightX, y);
  y += 6;
  doc.text(`Report Date : ${new Date().toLocaleString("en-GB")}`, rightX, y);
  y += 6;
  doc.text(`Report Status : Final Report`, rightX, y);

  // --- HTML Content Processing (Dynamic Section) ---
  const tempContainer = document.createElement("div");
  // FIX: Force a specific pixel width to stabilize scale calculation and prevent overlap
  tempContainer.style.width = "750px";
  tempContainer.style.padding = "10px";
  tempContainer.style.fontFamily = "Arial, sans-serif";
  // FIX: Higher line-height prevents vertical text bunching/overlapping
  tempContainer.style.lineHeight = "1.5";

  let fullHtmlContent = `
    <style>
      .test-section { 
        margin-bottom: 30px; 
        page-break-inside: avoid; 
        width: 100%;
        display: block;
      }
      .test-title { 
        font-weight: bold; 
        font-size: 18px; 
        margin-bottom: 12px; 
        border-bottom: 2px solid #333;
        padding-bottom: 4px;
      }
      .rich-text-body {
        font-size: 14px;
        color: #000;
        text-align: justify;
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-top: 10px; 
      }
      th, td { 
        border: 1px solid black; 
        padding: 12px; 
        text-align: left; 
        font-size: 14px; 
      }
      /* Standardize paragraph spacing to prevent overlapping lines */
      p { margin: 8px 0; } 
    </style>
  `;

  patient.tests.forEach((test) => {
    if (test.reportType === "text") {
      const plainText = test.richTextContent?.replace(/<[^>]*>?/gm, "").trim();
      const displayHtml =
        plainText && plainText.length > 0
          ? test.richTextContent
          : "No findings recorded.";

      fullHtmlContent += `
        <div class="test-section">
          <div class="test-title">${test.name.toUpperCase()}</div>
          <div class="rich-text-body">${displayHtml}</div>
        </div>`;
    } else {
      fullHtmlContent += `
        <div class="test-section">
          <div class="test-title">${test.name.toUpperCase()}</div>
          <table>
            <tr style="background-color: #f2f2f2;">
              <th style="width: 40%">Result</th>
              <th style="width: 20%">Unit</th>
              <th style="width: 40%">Reference</th>
            </tr>
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
    y: infoStartY + 42,

    // Target width in the PDF document (mm)
    width: pageWidth - (margin.left + margin.right),
    // Reference width for scaling calculation (must match tempContainer.style.width)
    windowWidth: 750,
    autoPaging: "text",
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
};