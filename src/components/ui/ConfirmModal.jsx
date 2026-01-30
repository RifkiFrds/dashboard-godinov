import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  open,
  message,
  onConfirm,
  onCancel,
  confirmText = "Hapus",
  confirmVariant = "danger",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl relative">

        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle
            className={
              confirmVariant === "primary"
                ? "text-blue-500"
                : "text-red-500"
            }
            size={22}
          />
          <h3 className="text-lg font-semibold text-gray-800">
            Konfirmasi
          </h3>
        </div>

        {/* Message */}
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-lg text-white transition ${
              confirmVariant === "primary"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
