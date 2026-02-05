import React, { useState, useEffect } from "react";
import { 
  Key, 
  RefreshCw, 
  Search, 
  Clock, 
  User, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";
import { H2 } from "../../components/ui/Text";

export default function ProjectOtpPage() {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch task yang memiliki OTP aktif dan belum 'Done'
  const fetchPendingOtps = async () => {
    setLoading(true);
    try {
      // Endpoint ini harus mengembalikan task yang: status != 'Done' && otp_code != null
      const response = await api.get("/api/projects/authorizations/project-otp");
      if (response.data.success) {
        setPendingTasks(response.data.data);
      }
    } catch (error) {
      toast.error("Gagal memuat data OTP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOtps();
  }, []);

  const filteredTasks = pendingTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.project?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <H2>Task OTP Approval</H2>
          <p className="text-gray-500 text-sm mt-1">
            Berikan kode di bawah ini kepada staff untuk mengotorisasi penyelesaian tugas.
          </p>
        </div>
        <button 
          onClick={fetchPendingOtps}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* Filters & Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text"
          placeholder="Cari berdasarkan task, project, atau nama staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        />
      </div>

      {/* List Tasks */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <p className="text-gray-500 font-medium">Tidak ada permintaan otorisasi aktif.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className="group bg-white border border-gray-100 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:border-blue-100 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {task.project?.name || "No Project"}
                  </span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={12} />
                    <span>Requested {new Date(task.updated_at).toLocaleTimeString()}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{task.title}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                      {task.assignee_name?.charAt(0)}
                    </div>
                    {task.assignee_name}
                  </div>
                </div>
              </div>

              {/* OTP Display Box */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Authorization Code</p>
                  <div className="flex items-center gap-2">
                    <Key size={18} className="text-blue-500" />
                    <span className="text-3xl font-mono font-black text-gray-900 tracking-tighter">
                      {task.otp_code}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Perhatian:</strong> Kode OTP ini bersifat rahasia. Jangan berikan kode ini kecuali Anda telah memverifikasi bahwa task tersebut memang layak diselesaikan tanpa melalui proses <i>In Progress</i> (Timer).
        </p>
      </div>
    </div>
  );
}