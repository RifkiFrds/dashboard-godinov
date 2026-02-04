import React, { useState } from "react";
import { Eye, Trash2, CheckCircle, XCircle } from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";
import ConfirmModal from "../ui/ConfirmModal";

export default function InboxRow({ item, mode, onOpen, onUpdated }) {
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openStatusConfirm, setOpenStatusConfirm] = useState(false);

  // Derived state for status
  const isProcessed = item.status === 1;
  const statusText = isProcessed ? "sudah diproses" : "belum diproses";

  const handleStatusChange = async () => {
    try {
      await api.put(`/api/inbox/${item.id}/status`, {
        status: isProcessed ? 0 : 1, // Toggle status
      });
      toast.success("Status berhasil diperbarui!");
      onUpdated();
      setOpenStatusConfirm(false); // Close modal after successful update
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal memperbarui status!");
    }
  };

  /* ================= DELETE ================= */
  const deleteInbox = async () => {
    try {
      await api.delete(`/api/inbox/${item.id}`);
      toast.success("Pesan berhasil dihapus");
      onUpdated();
      setOpenDeleteConfirm(false); // Corrected state setter
    } catch (error) {
      console.error("Error deleting inbox:", error);
      toast.error("Gagal menghapus pesan!");
    }
  };

  /* ================= DESKTOP ================= */
  if (mode === "desktop") {
    return (
      <>
        <tr className="border-b text-sm hover:bg-gray-50">
          <td className="py-3">{item.name}</td>
          <td>{item.company}</td>
          <td>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                isProcessed
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {/* Capitalize first letter */}
              {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
            </span>
          </td>
          <td>{item.created_at}</td>
          <td className="text-right space-x-2">
            <ActionButton onClick={onOpen} icon={<Eye size={16} />} />
            <ActionButton
              onClick={() => setOpenStatusConfirm(true)}
              icon={isProcessed ? <XCircle size={16} /> : <CheckCircle size={16} />}
            />
            <ActionButton
              onClick={() => setOpenDeleteConfirm(true)}
              icon={<Trash2 size={16} />}
              danger
            />
          </td>
        </tr>
        {/* MODAL KONFIRMASI STATUS */}
        <ConfirmModal
          open={openStatusConfirm}
          message={
            isProcessed
              ? "Apakah Anda yakin ingin membatalkan proses pesan ini?"
              : "Apakah Anda yakin ingin memproses pesan ini?"
          }
          confirmText="Ya"
          confirmVariant="primary"
          onCancel={() => setOpenStatusConfirm(false)}
          onConfirm={handleStatusChange}
        />
        {/* MODAL KONFIRMASI DELETE */}
        <ConfirmModal
          open={openDeleteConfirm}
          message="Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan."
          onCancel={() => setOpenDeleteConfirm(false)}
          onConfirm={deleteInbox}
        />
      </>
    );
  }

  /* ================= MOBILE ================= */
  return (
    <>
      <div className="border rounded-lg p-4 mb-3 bg-white">
        <div className="font-semibold">{item.name}</div>
        <div className="text-sm text-gray-500">{item.company}</div>

        <span
          className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
            isProcessed
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {/* Capitalize first letter */}
          {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
        </span>

        <div className="flex gap-2 mt-3">
          <ActionButton onClick={onOpen} icon={<Eye size={16} />} />
          <ActionButton
            onClick={() => setOpenStatusConfirm(true)}
            icon={isProcessed ? <XCircle size={16} /> : <CheckCircle size={16} />}
          />
          <ActionButton
            onClick={() => setOpenDeleteConfirm(true)}
            icon={<Trash2 size={16} />}
            danger
          />
        </div>
      </div>
      {/* MODAL KONFIRMASI STATUS */}
      <ConfirmModal
        open={openStatusConfirm}
        message={
          isProcessed
            ? "Apakah Anda yakin ingin membatalkan status pesan ini?"
            : "Apakah Anda yakin ingin memproses pesan ini?"
        }
        onCancel={() => setOpenStatusConfirm(false)}
        onConfirm={handleStatusChange} 
      />
      {/* MODAL KONFIRMASI DELETE */}
      <ConfirmModal
        open={openDeleteConfirm}
        message="Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan."
        onCancel={() => setOpenDeleteConfirm(false)}
        onConfirm={deleteInbox}
      />
    </>
  );
}

function ActionButton({ onClick, icon, danger }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center p-2 rounded-lg transition ${
        danger
          ? "bg-red-50 text-red-700 hover:bg-red-100"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {icon}
    </button>
  );
}
