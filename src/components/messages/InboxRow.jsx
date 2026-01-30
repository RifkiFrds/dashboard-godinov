import React, { useState } from "react";
import { Eye, Trash2, CheckCircle, XCircle } from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";
import ConfirmModal from "../ui/ConfirmModal";

export default function InboxRow({ item, onOpen, onUpdated }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const statusText = item.status?.toLowerCase();

  const handleStatusChange = async () => {
    await api.put(`/api/inbox/${item.id}/status`, {
      status: statusText === "sudah diproses" ? 0 : 1,
    });
    toast.success("Status berhasil diperbarui!");
    onUpdated();
  };

  const deleteInbox = async () => {
    await api.delete(`/api/inbox/${item.id}`);
    toast.success("Pesan berhasil dihapus");
    onUpdated();
    setOpenConfirm(false);
  };

  return (
    <>
      {/* DESKTOP VIEW */}
      <tr className="hidden sm:table-row border-b border-gray-200 text-sm hover:bg-gray-50 transition">
        <td className="py-3">{item.name}</td>
        <td className="py-3">{item.company}</td>
        <td className="py-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusText === "sudah diproses"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {item.status}
          </span>
        </td>
        <td className="py-3 text-gray-600">{item.created_at}</td>
        <td className="py-3 text-right space-x-2 whitespace-nowrap">
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
          >
            <Eye size={16} /> Detail
          </button>
          <button
            onClick={handleStatusChange}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg ${
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
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
          >
            <Trash2 size={16} /> Hapus
          </button>
        </td>
      </tr>

      {/* MOBILE VIEW */}
      <div className="sm:hidden border rounded-lg p-4 mb-3 shadow-sm bg-white">
        <div className="font-semibold text-gray-900">{item.name}</div>
        <div className="text-gray-600 text-sm mb-1">{item.company}</div>
        <div className="text-sm mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusText === "sudah diproses"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {item.status}
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-3">{item.created_at}</div>

        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={onOpen}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
          >
            <Eye size={16} /> Detail
          </button>
          <button
            onClick={handleStatusChange}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg ${
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
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
          >
            <Trash2 size={16} /> Hapus
          </button>
        </div>
      </div>

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
