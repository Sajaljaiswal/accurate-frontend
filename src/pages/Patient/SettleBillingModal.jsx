import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { settleBilling } from "../../api/patientApi";

const SettleBillingModal = ({ patient, onClose, onSuccess }) => {
  const [paidNow, setPaidNow] = useState(0);

  const billing = patient.billing;

  const netAmount = billing.netAmount || 0;
  const alreadyPaid = billing.cashReceived || 0;
  const dueAmount = billing.dueAmount || 0;

  const newPaidTotal = alreadyPaid + Number(paidNow);
  const newDue = Math.max(0, netAmount - newPaidTotal);

  const paymentStatusDisplay =
    newPaidTotal === 0 ? "UNPAID" : newPaidTotal >= netAmount ? "PAID" : "PARTIAL";

  const paymentStatus =
    paymentStatusDisplay === "UNPAID"
      ? "unpaid"
      : paymentStatusDisplay === "PAID"
      ? "paid"
      : "partial";

  const handleSave = async () => {
    if (paidNow <= 0 || paidNow > dueAmount) {
      alert("Please enter a valid amount to collect");
      return;
    }
    try {
      await settleBilling(patient._id, {
        cashReceived: newPaidTotal,
        dueAmount: newDue,
        paymentStatus,
      });

      alert("Payment updated successfully ✅");
      onSuccess();
      onClose();
       window.location.reload();
    } catch (err) {
      alert("Failed to settle billing");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 border-b">
          <h2 className="font-bold text-lg">Settle Billing</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-sm">
          <div className="flex justify-between">
            <span>Patient</span>
            <strong>{patient.firstName}</strong>
          </div>

          <div className="flex justify-between">
            <span>Total Amount</span>
            <strong>₹{netAmount}</strong>
          </div>

          <div className="flex justify-between">
            <span>Already Paid</span>
            <strong>₹{alreadyPaid}</strong>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              Collect Now (₹)
            </label>
            <input
              type="number"
              value={paidNow}
              onChange={(e) => setPaidNow(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex justify-between text-red-600 font-bold">
            <span>Remaining Due</span>
            <span>₹{newDue}</span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span className="font-bold">{paymentStatusDisplay}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-700 text-white rounded font-bold"
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettleBillingModal;
