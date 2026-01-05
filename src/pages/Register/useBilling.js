// Register/useBilling.js
import { useMemo } from "react";

export const useBilling = (selectedTests, discountValue, discountType, cashReceived, discountAmount) => {
  return useMemo(() => {
    // 1. Ensure grossTotal is a valid number
    const grossTotal = selectedTests.reduce(
      (sum, item) => sum + (Number(item.defaultPrice) || 0), 
      0
    );

    const distVal = Number(discountValue) || 0;
    const cashRec = Number(cashReceived) || 0;

    // 2. Calculate Discount
    const discountAmt =
      discountType === "percent"
        ? (grossTotal * distVal) / 100
        : distVal;

    // 3. Final amounts (Using Math.max to prevent negative numbers)
    const netAmount = Math.max(0, grossTotal - discountAmt);
    const dueAmount = Math.max(0, netAmount - cashRec);

    // 4. Determine Status (Match your Backend Enum exactly - usually lowercase or specific caps)
    // The error said `UNPAID` is invalid. Check if your backend expects "Unpaid" or "unpaid"
    let paymentStatus = "unpaid"; 
    if (dueAmount <= 0 && netAmount > 0) paymentStatus = "paid";
    else if (cashRec > 0 && dueAmount > 0) paymentStatus = "partial";

    return {
      grossTotal,
      discountValue: distVal,
      discountAmount: discountAmt,
      netAmount,
      cashReceived: cashRec,
      dueAmount,
      paymentStatus, // Use the dynamically calculated status
      count: selectedTests.length,
    };
  }, [selectedTests, discountValue,  discountType, cashReceived]);
};