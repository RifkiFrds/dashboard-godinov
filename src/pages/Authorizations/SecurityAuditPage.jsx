import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Search, 
  History, 
  Filter, 
  Download, 
  Clock, 
  Fingerprint,
  User,
  ExternalLink
} from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";
import { H2 } from "../../components/ui/Text";

export default function SecurityAuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/admin/audit-logs?type=${filterType}`);
      if (response.data.success) {
        setLogs(response.data.data);
      }
    } catch (error) {
      toast.error("Gagal memuat log audit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filterType]);

  const getActionColor = (action) => {
    if (action.includes("APPROVED")) return "text-emerald-600 bg-emerald-50";
    if (action.includes("REJECTED")) return "text-red-600 bg-red-50";
    if (action.includes("ROLE_CHANGE")) return "text-purple-600 bg-purple-50";
    return "text-blue-600 bg-blue-50";
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <H2>Security Audit Log</H2>
          <p className="text-gray-500 text-sm mt-1">Rekam jejak seluruh aktivitas kritikal dan otorisasi sistem.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'authorization', 'finance', 'role_change', 'security'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              filterType === t 
              ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
              : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
            }`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2 text-gray-400">
          <History size={18} />
          <span className="text-sm font-bold uppercase tracking-widest">System Activity Stream</span>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-10 text-center animate-pulse text-gray-400">Menarik data dari server...</div>
          ) : logs.length === 0 ? (
            <div className="p-20 text-center">
              <ShieldAlert className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400">Belum ada aktivitas yang tercatat.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50/50 transition-all flex flex-col md:flex-row gap-4 md:items-center">
                {/* Timestamp */}
                <div className="md:w-40 shrink-0">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Clock size={14} />
                    <span className="text-xs font-medium">{new Date(log.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-500">{new Date(log.created_at).toLocaleDateString()}</p>
                </div>

                {/* Performer */}
                <div className="md:w-48 shrink-0 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <User size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 truncate">{log.user_name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{log.user_role}</p>
                  </div>
                </div>

                {/* Action & Details */}
                <div className="flex-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase mb-2 ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {log.description}
                  </p>
                </div>

                {/* Metadata / IP */}
                <div className="md:w-32 text-right hidden lg:block">
                  <div className="flex items-center justify-end gap-1 text-gray-300">
                    <Fingerprint size={12} />
                    <span className="text-[10px] font-mono">{log.ip_address}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}