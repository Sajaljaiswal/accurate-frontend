import React, { useState, useEffect } from "react";
import { X, Trash2, RotateCcw } from "lucide-react";
import { updatePatient } from "../../api/patientApi"; // Use this to update tests + billing
import { getAllTests } from "../../api/testApi";
import LazySelect from "../../commom/LazySelect";
import { useBilling } from "../Register/useBilling";

const SettleBillingModal = ({ patient, onClose, onSuccess }) => {
  // 1. States for Tests and Discounts
  const [selectedTests, setSelectedTests] = useState([]);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState("amount");
  const [paidNow, setPaidNow] = useState(0);

  // 2. States for Test Dropdown
  const [dropdownTests, setDropdownTests] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dropPage, setDropPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  // 3. Live Math using Hook (cashReceived is set to 0 here because we handle it manually below)
  const calculations = useBilling(
    selectedTests,
    discountValue,
    discountType,
    0
  );
console.log("Calculations in SettleBillingModal:", calculations);
  useEffect(() => {
    if (patient) {
      const existingTests =
        patient.tests?.map((t) => ({
          _id: t.testId,
          name: t.name,
          defaultPrice: t.price,
        })) || [];
      setSelectedTests(existingTests);
      setDiscountValue(patient.billing?.discountValue || 0);
      setDiscountType(patient.billing?.discountType || "amount");
    }
    fetchDropdownData(1, true);
  }, [patient]);

  const fetchDropdownData = async (page, isInitial = false) => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const res = await getAllTests(page, 10);
      setDropdownTests((prev) =>
        isInitial ? res.data.data : [...prev, ...res.data.data]
      );
      setTotalRecords(res.data.pagination.totalItems);
      setDropPage(page);
    } finally {
      setIsFetching(false);
    }
  };

  // 4. Calculations for Return/Due
  const alreadyPaid = Number(patient.billing?.cashReceived || 0);
  const netAmount = calculations.netAmount; // New calculated net after edits

  // Total  at hand after current collection
  const totalCashHandled = alreadyPaid + Number(paidNow);

  // Balance logic
  const balance = netAmount - totalCashHandled;
  const isRefund = balance < 0;
  const finalDue = isRefund ? 0 : balance;
  const refundAmount = isRefund ? Math.abs(balance) : 0;

  const handleAddTest = (testId) => {
    const testObj = dropdownTests.find((t) => t._id === testId);
    if (testObj && !selectedTests.some((t) => t._id === testObj._id)) {
      setSelectedTests([...selectedTests, testObj]);
    }
  };
  // Inside SettleBillingModal component...

  const handleAutoRefund = () => {
    // Setting paidNow to a negative value effectively "refunds" the difference
    // from the alreadyPaid total during the save process.
    setPaidNow(-refundAmount);
  };

  // The UI will now react to this change:
  // totalCashHandled will become (alreadyPaid - refundAmount) which equals netAmount.
  // finalDue will become 0.
  // isRefund will become false (or 0).

  const handleSave = async () => {
    try {
      // Determine the status string
      let finalStatus = "PENDING";

      if (totalCashHandled > netAmount) {
        finalStatus = "RETURN"; // Use this if your backend Enum supports it
      } else if (finalDue <= 0 && netAmount > 0) {
        finalStatus = "PAID";
      } else if (totalCashHandled > 0) {
        finalStatus = "PARTIAL";
      }
      const payload = {
        tests: selectedTests.map((t) => ({
          testId: t._id,
          name: t.name,
          price: t.defaultPrice,
        })),
        billing: {
          ...patient.billing,
          grossTotal: calculations.grossTotal,
          discountType,
          discountValue,
          discountAmount: calculations.discountAmt,
          netAmount: netAmount,
          cashReceived: totalCashHandled, // Updates total history
          dueAmount: finalDue,
          paymentStatus: finalStatus,
        },
      };

      await updatePatient(patient._id, payload);
      alert(isRefund ? "Refund and Billing Settled ✅" : "Payment Settled ✅");
      onSuccess();
      onClose();
      window.location.reload();
    } catch (err) {
      alert("Error settling account");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[95vh]">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h2 className="font-bold text-lg text-blue-800">
            Settle & Edit Billing: {patient.firstName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <X />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section: Discount Editing */}
          <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
            <div>
              <label className="text-xs font-bold block mb-1">
                Discount Type
              </label>
              <select
                className="w-full border rounded p-2 bg-white"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="amount">Amount (₹)</option>
                <option value="percent">Percent (%)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">
                Discount Value
              </label>
              <input
                type="number"
                className="w-full border rounded p-2 bg-white"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>
                Discount Amount (
                {discountType === "percent" ? `${discountValue}%` : "Fixed"}):
              </span>
              <span className="font-semibold text-red-600">
                 ₹{(calculations.discountAmount ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>New Net Amount:</span>
              <span className="font-bold text-black">
                ₹{netAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Previously Paid:</span>
              <span className="font-bold text-blue-600">
                ₹{alreadyPaid.toFixed(2)}
              </span>
            </div>

            {isRefund ? (
              <div className="bg-green-50 border-2 border-green-200 p-5 rounded-xl space-y-4 shadow-inner">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-green-800 font-black uppercase text-xs tracking-widest">
                      Amount to Return
                    </p>
                    <p className="text-3xl font-black text-green-700">
                      ₹{refundAmount.toFixed(2)}
                    </p>
                  </div>

                  {/* RETURN BUTTON */}
                  <button
                    type="button"
                    onClick={handleAutoRefund}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md"
                  >
                    <RotateCcw size={18} />
                    CONFIRM RETURN
                  </button>
                </div>
                <p className="text-[10px] text-green-600 italic">
                  * Clicking confirm will adjust the total collected amount to
                  match the new net bill.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-700">
                    Collect Now (₹):
                  </label>
                  <input
                    type="number"
                    className="border-2 border-blue-500 rounded p-2 w-32 text-right font-bold text-lg outline-none focus:ring-2 focus:ring-blue-200"
                    value={paidNow}
                    onChange={(e) => setPaidNow(Number(e.target.value))}
                  />
                </div>

                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-bold text-gray-500 uppercase text-[10px]">
                    New Total Collection:
                  </span>
                  <span className="font-bold text-gray-700">
                    ₹{totalCashHandled.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-red-600 pt-1">
                  <span className="font-bold uppercase text-xs">
                    Remaining Due:
                  </span>
                  <span className="font-black text-xl">
                    ₹{finalDue.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 font-medium">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-2 rounded-lg font-bold text-white shadow-lg ${
              isRefund
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {isRefund ? "Settle Refund" : "Save & Settle"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettleBillingModal;
