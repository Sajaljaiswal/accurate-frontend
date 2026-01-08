import React from "react";

const AccountReportTemplate = React.forwardRef(({ stats, startDate, endDate }, ref) => {
  // Calculate Grand Totals
  const grandTotals = stats.recentBookings?.reduce(
    (acc, p) => ({
      gross: acc.gross + (p.billing?.grossTotal || 0),
      discount: acc.discount + (p.billing?.discountAmount || 0),
      net: acc.net + (p.billing?.netAmount || 0),
      cash: acc.cash + (p.billing?.cashReceived || 0),
      balance: acc.balance + (p.billing?.dueAmount || 0),
    }),
    { gross: 0, discount: 0, net: 0, cash: 0, balance: 0 }
  );

  return (
    <div ref={ref} className="p-8 bg-white text-black font-sans print:p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold uppercase">Center Collection(Account) Report</h1>
        <p className="text-sm font-semibold mt-1">
          Period From : {new Date(startDate).toLocaleDateString('en-IN')} To : {new Date(endDate).toLocaleDateString('en-IN')}
        </p>
      </div>

      <table className="w-full border-collapse border-t-2 border-b-2 border-black text-[11px]">
        <thead>
          <tr className="border-b border-black">
            <th className="py-2 text-left">S No</th>
            <th className="text-left">LabNo</th>
            <th className="text-left">PatientName</th>
            <th className="text-left">DoctorName</th>
            <th className="text-left">PanelName</th>
            <th className="text-right">Gross Amt</th>
            <th className="text-right">Dis Amt</th>
            <th className="text-right">NetAmt</th>
            <th className="text-right">AmtCash</th>
            <th className="text-right">BalAmt</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="10" className="py-2 font-bold text-center text-sm">
              Accurate Diagnostic
            </td>
          </tr>
          {/* Grouped by Date (Simplified logic) */}
          <tr>
            <td colSpan="10" className="py-1 font-bold">Main</td>
          </tr>
          <tr>
            <td colSpan="10" className="pb-2 font-bold italic underline">
               Receipt Date : {new Date(startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </td>
          </tr>

          {stats.recentBookings?.map((p, index) => (
            <tr key={index} className="border-b border-dotted border-gray-400 align-top">
              <td className="py-2">{index + 1}</td>
              <td>{p.labNumber}</td>
              <td>{p.title} {p.firstName}</td>
              <td>{p.referredBy || "-"}</td>
              <td className="max-w-[150px] uppercase">{p.panel || "SELF"}</td>
              <td className="text-right">{p.billing?.grossTotal?.toFixed(2)}</td>
              <td className="text-right">{p.billing?.discountAmount?.toFixed(2)}</td>
              <td className="text-right">{p.billing?.netAmount?.toFixed(2)}</td>
              <td className="text-right">{p.billing?.cashReceived?.toFixed(2)}</td>
              <td className="text-right font-bold">{p.billing?.dueAmount?.toFixed(2)}</td>
            </tr>
          ))}

          {/* Totals Section */}
          <tr className="border-t-2 border-black font-bold">
            <td colSpan="5" className="py-2 text-right pr-4">Total of Accurate Diagnostic ::</td>
            <td className="text-right">{grandTotals?.gross.toFixed(2)}</td>
            <td className="text-right">{grandTotals?.discount.toFixed(2)}</td>
            <td className="text-right">{grandTotals?.net.toFixed(2)}</td>
            <td className="text-right">{grandTotals?.cash.toFixed(2)}</td>
            <td className="text-right">{grandTotals?.balance.toFixed(2)}</td>
          </tr>
          <tr className="border-t border-black font-black text-sm">
            <td colSpan="5" className="py-3 text-right pr-4">Grand Total Amount ::</td>
            <td className="text-right">{grandTotals?.gross.toFixed(2)}</td>
            <td className="text-right">{grandTotals?.discount.toFixed(2)}</td>
            <td className="text-right">{grandTotals?.net.toFixed(2)}</td>
            <td className="text-right">{grandTotals?.cash.toFixed(2)}</td>
            <td className="text-right">{grandTotals?.balance.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default AccountReportTemplate;