import React, { useState } from "react";
import { Eye, Trash2, CheckCircle, XCircle } from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";
import ConfirmModal from "../ui/ConfirmModal";

export default function InboxRow({ item, onOpen, onUpdated }) {
  const [openConfirm, setOpenConfirm] = useState(false);

  const statusText = item.status?.toLowerCase();

  const handleStatusChange = async () => {
    const isProcessed = statusText === "sudah diproses";
    const newStatus = isProcessed ? 0 : 1;

    await api.put(`/api/updateStatus/${item.id}`, {
      status: newStatus,
    });

    toast.success("Status berhasil diperbarui!");
    onUpdated();
  };

  const deleteInbox = async () => {
    await api.delete(`/api/deleteInbox/${item.id}`);
    toast.success("Pesan berhasil dihapus");
    onUpdated();
    setOpenConfirm(false);
  };

  return (
    <>
      <tr className="border-b border-gray-100 text-sm flex flex-col sm:table-row p-3 sm:p-0">

        <td className="py-2 sm:py-3">{item.name}</td>

        <td className="py-2">{item.company}</td>

        <td className="py-2">
          <span
            className={`px-2 py-1 rounded text-xs ${
              statusText === "sudah diproses"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {item.status}
          </span>
        </td>

        <td className="py-2 break-all">{item.created_at}</td>

        <td className="sm:text-right flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 justify-end mt-3 sm:mt-0">

          <button
            onClick={onOpen}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
          >
            <Eye size={16} /> Detail
          </button>

          <button
            onClick={handleStatusChange}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition 
              ${
                statusText === "sudah diproses"
                  ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
          >
            {statusText === "sudah diproses" ? <XCircle size={16} /> : <CheckCircle size={16} />}
            {statusText === "sudah diproses" ? "Batalkan" : "Proses"}
          </button>

          <button
            onClick={() => setOpenConfirm(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 size={16} />
            Hapus
          </button>

        </td>
      </tr>

      {/* Modal Konfirmasi */}
      <ConfirmModal
        open={openConfirm}
        message="Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan."
        onCancel={() => setOpenConfirm(false)}
        onConfirm={deleteInbox}
      />
    </>
  );
}
