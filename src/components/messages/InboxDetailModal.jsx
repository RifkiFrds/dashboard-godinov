import React, { useEffect, useState } from "react";
import api from "../../api";
import { X, Mail, Phone, MapPin, Building, User2, Calendar, FileText } from "lucide-react";

export default function InboxDetailModal({ id, onClose }) {

  const [detail, setDetail] = useState(null);

  const fetchDetail = async () => {
    const res = await api.get(`/api/inbox/${id}`);
    setDetail(res.data.data);
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (!detail) return null;

  const isProcessed = detail.status?.toLowerCase() === "sudah diproses";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">

      {/* Modal Wrapper */}
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-4 sm:p-6 relative border border-gray-200 max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
          Detail Inbox
        </h2>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

        {/* GRID CONTENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">

          <DetailItem icon={<User2 size={16} />} label="Nama" value={detail.name} />
          <DetailItem icon={<Mail size={16} />} label="Email" value={detail.email} />

          <DetailItem icon={<Phone size={16} />} label="Kontak" value={detail.contact} />
          <DetailItem icon={<Building size={16} />} label="Perusahaan" value={detail.company} />

          <DetailItem icon={<MapPin size={16} />} label="Alamat" value={detail.address} />

          <div className="flex flex-col">
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <Calendar size={16} /> Waktu
            </span>
            <span className="font-medium break-all">{detail.created_at}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">Status</span>
            <span
              className={`px-2 py-1 rounded text-xs w-max mt-1 ${
                isProcessed
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {detail.status}
            </span>
          </div>

        </div>

        {/* Description */}
        <div className="mt-4">
          <span className="text-gray-500 text-xs flex items-center gap-1">
            <FileText size={16} /> Pesan / Deskripsi
          </span>
          <p className="text-gray-800 mt-2 leading-relaxed border bg-gray-50 p-3 rounded-md break-words">
            {detail.description}
          </p>
        </div>

      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-xs flex items-center gap-1">
        {icon} {label}
      </span>
      <span className="font-medium break-words">{value}</span>
    </div>
  );
}

