import React, { useEffect, useState } from "react";
import api from "../api";
import InboxRow from "../components/messages/InboxRow";
import InboxDetailModal from "../components/messages/InboxDetailModal";
import { H2 } from "../components/ui/Text";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/api/inbox");
      setMessages(res.data?.data || []);
    } catch (err) {
      console.error("Fetch inbox error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <H2 className="mb-6">Daftar Pesan Masuk</H2>

      {loading && <p className="text-gray-500">Memuat pesan...</p>}

      {!loading && (
        <div className="rounded-xl border bg-white p-4 sm:p-6">

          {/* DESKTOP */}
          <table className="hidden sm:table w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-600">
                <th className="py-3">Nama</th>
                <th>Perusahaan</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((item) => (
                <InboxRow
                  key={item.id}
                  item={item}
                  mode="desktop"
                  onOpen={() => setSelectedId(item.id)}
                  onUpdated={fetchMessages}
                />
              ))}
            </tbody>
          </table>

          {/* MOBILE */}
          <div className="sm:hidden">
            {messages.map((item) => (
              <InboxRow
                key={item.id}
                item={item}
                mode="mobile"
                onOpen={() => setSelectedId(item.id)}
                onUpdated={fetchMessages}
              />
            ))}
          </div>
        </div>
      )}

      {selectedId !== null && (
        <InboxDetailModal
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
