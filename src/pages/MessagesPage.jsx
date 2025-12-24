import React, { useEffect, useState } from "react";
import api from "../api";
import InboxRow from "../components/messages/InboxRow";
import InboxDetailModal from "../components/messages/InboxDetailModal";
import { H2 } from "../components/ui/Text";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/api/inbox/");
      setMessages(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching messages:", err);
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
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          {/* Table header only for desktop */}
          <table className="w-full text-left hidden sm:table table-auto">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-600">
                <th className="py-3">Nama</th>
                <th>Perusahaan</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <InboxRow
                  key={m.id}
                  item={m}
                  onOpen={() => setSelected(m.id)}
                  onUpdated={fetchMessages}
                />
              ))}
            </tbody>
          </table>

          {/* Mobile list */}
          <div className="sm:hidden">
            {messages.map((m) => (
              <InboxRow
                key={m.id}
                item={m}
                onOpen={() => setSelected(m.id)}
                onUpdated={fetchMessages}
              />
            ))}
          </div>
        </div>
      )}

      {selected && (
        <InboxDetailModal
          id={selected}
          onClose={() => setSelected(null)}
          onUpdated={fetchMessages}
        />
      )}
    </div>
  );
}
