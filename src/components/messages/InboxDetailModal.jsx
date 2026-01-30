import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Building,
  User2,
  Calendar,
  FileText,
} from "lucide-react";

export default function InboxDetailModal({ id, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/api/inbox/${id}`);
      setDetail(res.data.data);
    } catch (err) {
      console.error("Gagal mengambil detail inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
    return () => setDetail(null);
  }, [id]);

  if (loading) return null;
  if (!detail) return null;

  const isProcessed =
    detail.status?.toLowerCase() === "sudah diproses";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Detail Inbox
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

          <DetailItem icon={<User2 size={16} />} label="Nama" value={detail.name} />
          <DetailItem icon={<Mail size={16} />} label="Email" value={detail.email} />
          <DetailItem icon={<Phone size={16} />} label="Kontak" value={detail.contact} />
          <DetailItem icon={<Building size={16} />} label="Perusahaan" value={detail.company} />
          <DetailItem icon={<MapPin size={16} />} label="Alamat" value={detail.address} />

          <div>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={14} /> Waktu
            </span>
            <span className="font-medium">
              {new Date(detail.created_at).toLocaleString("id-ID")}
            </span>
          </div>

          <div>
            <span className="text-xs text-gray-500">Status</span>
            <span
              className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                isProcessed
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {detail.status}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <FileText size={14} /> Pesan
          </span>
          <p className="mt-2 bg-gray-50 border p-3 rounded-md text-gray-800">
            {detail.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div>
      <span className="text-xs text-gray-500 flex items-center gap-1">
        {icon} {label}
      </span>
      <span className="font-medium break-words">{value}</span>
    </div>
  );
}
