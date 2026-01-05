import React, { useEffect, useRef } from "react";

const VARIANT_STYLES = {
  info: {
    button: "bg-blue-600 hover:bg-blue-700",
    title: "text-blue-600",
  },
  warning: {
    button: "bg-amber-600 hover:bg-amber-700",
    title: "text-amber-600",
  },
  danger: {
    button: "bg-red-600 hover:bg-red-700",
    title: "text-red-600",
  },
};

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message = "Do you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // info | warning | danger
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const modalRef = useRef(null);
  const confirmBtnRef = useRef(null);

  // 🔹 ESC key close
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  // 🔹 Focus trap
  useEffect(() => {
    if (open) confirmBtnRef.current?.focus();
  }, [open]);

  const handleTab = (e) => {
    const focusable = modalRef.current.querySelectorAll(
      "button"
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!open) return null;

  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={handleTab}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm p-6 z-10"
      >
        <h2
          className={`text-lg font-bold mb-2 ${styles.title}`}
        >
          {title}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {cancelText}
          </button>

          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-bold rounded-lg text-white ${styles.button}`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
