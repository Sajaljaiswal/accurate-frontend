import jsPDF from "jspdf";
import sign from "../../img/sign.png";

export const generateLabReportPDF = async (patient, isSignedOff) => {
  if (!patient) return;

  const FOOTER_SPACE = 30;
  const infoStartY = 35;

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = { top: 20, bottom: FOOTER_SPACE + 10, left: 15, right: 15 };
  // const CONTENT_START_Y = infoStartY + 42;
  const CONTENT_LEFT = 0;
  // const htmlMargins = [0, 0, FOOTER_SPACE, 0];
  const HEADER_HEIGHT = 80;
  /* ================= HEADER FUNCTION ================= */
  const drawHeader = (doc) => {
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
    doc.text(`Ref. Lab/Hosp : ${patient.panel || "-"}`, leftX, y);

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
      y,
    );
    y += 6;
    doc.text(`Report Date : ${new Date().toLocaleString("en-GB")}`, rightX, y);
  };

  drawHeader(doc);

  const tempContainer = document.createElement("div");
  tempContainer.style.width = "700px";
  tempContainer.style.padding = "10px";
  tempContainer.style.fontFamily = "Arial, sans-serif";
  tempContainer.style.lineHeight = "1.4";

  let fullHtmlContent = `
    <style>
    .test-section { margin-bottom: 20px; }
    .test-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
    
    /* This ensures tables and images inside the rich text don't overflow */
    .rich-text-body { width: 100%; }
    // .rich-text-body table { width: 100% !important; border-collapse: collapse; }
    .rich-text-body table { 
        width: 100% !important; 
        border-collapse: collapse; 
        margin: 10px 0;
      }
      
      .rich-text-body table, 
      .rich-text-body th, 
      .rich-text-body td { 
        border: 1px solid #000 !important; /* Forces the black borders */
        padding: 6px 8px !important;      /* Provides clean spacing inside cells */
        text-align: left;
      }

      .rich-text-body th {
        background-color: #f2f2f2; /* Light grey for headers if applicable */
        font-weight: bold;
      }
    
    /* Preserve the exact styling from your editor */
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
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
        </div>
      `;
    } else {
      fullHtmlContent += `
        <div class="test-section">
          <div class="test-title">${test.name.toUpperCase()}</div>
          <table>
            <tr style="background-color:#f2f2f2">
              <th style="width:40%">Result</th>
              <th style="width:20%">Unit</th>
              <th style="width:40%">Reference</th>
            </tr>
            <tr>
              <td>${test.resultValue || "---"}</td>
              <td>${test.unit || ""}</td>
              <td>${test.referenceRange || ""}</td>
            </tr>
          </table>
        </div>
      `;
    }
  });

  /* ✅ CKEditor list cleanup */
  fullHtmlContent = fullHtmlContent
    .replace(/<ul[^>]*>/g, "<ul>")
    .replace(/<ol[^>]*>/g, "<ol>")
    .replace(/<li><p>/g, "<li>")
    .replace(/<\/p><\/li>/g, "</li>");

  tempContainer.innerHTML = fullHtmlContent;
  document.body.appendChild(tempContainer);

  /* ================= PDF HTML RENDER ================= */
  await doc.html(tempContainer, {
    x: margin.left,
    // y: CONTENT_START_Y,
    width: pageWidth - margin.left - margin.right,
    windowWidth: 750,
    autoPaging: "text",
    margin: [
      HEADER_HEIGHT, // top (push content below header on every page)
      margin.right,
      FOOTER_SPACE,
      CONTENT_LEFT,
    ],
    callback: function (doc) {
      const totalPages = doc.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        /* ✅ HEADER EVERY PAGE */
        drawHeader(doc);

        /* Footer Line */
        // doc.setDrawColor(0);
        // doc.line(
        //   margin.left,
        //   pageHeight - FOOTER_SPACE,
        //   pageWidth - margin.right,
        //   pageHeight - FOOTER_SPACE,
        // );

        /* Signatory */
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Dr. Manvendra Singh", pageWidth - 60, pageHeight - 18);
        doc.text("MD Radio-Diagnosis", pageWidth - 60, pageHeight - 15);


        if (isSignedOff) {
          doc.addImage(sign, "PNG", pageWidth - 65, pageHeight - 34 , 45, 16);
        }

        /* Page Number */
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      }

      document.body.removeChild(tempContainer);
      window.open(doc.output("bloburl"), "_blank");
    },
  });
};
