import React, { useState, useEffect } from "react";
import { 
  Receipt, 
  Search, 
  Check, 
  X, 
  Eye,
  Calendar,
  User,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";
import { H2 } from "../../components/ui/Text";

export default function ReimburseApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // Untuk zoom struk

  const fetchReimbursements = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/authorizations/reimbursements");
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      toast.error("Gagal memuat data reimburse");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.post(`/api/authorizations/reimbursements/${id}/action`, { status });
      toast.success(`Permintaan telah di-${status}`);
      fetchReimbursements();
    } catch (error) {
      toast.error("Gagal memproses permintaan");
    }
  };

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <H2>Expense & Reimbursement</H2>
        <p className="text-gray-500 mt-1">Verifikasi nota dan setujui klaim biaya operasional staff.</p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-3xl" />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <Receipt className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400">Semua klaim sudah diproses.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row gap-6 hover:border-orange-200 transition-all">
              
              {/* Foto Struk / Nota */}
              <div 
                className="w-full lg:w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer relative group"
                onClick={() => setSelectedImage(item.attachment_url)}
              >
                <img src={item.attachment_url} alt="Struk" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <Eye className="text-white" size={20} />
                </div>
              </div>

              {/* Detail Klaim */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.category === 'Transport' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar size={12} />
                    <span>{item.date}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800">{item.description}</h3>
                
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <User size={14} />
                    <span>{item.staff_name}</span>
                  </div>
                </div>
              </div>

              {/* Nominal & Aksi */}
              <div className="flex flex-col justify-between items-end border-l border-gray-100 pl-6 min-w-[200px]">
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase">Nominal Klaim</p>
                  <p className="text-2xl font-black text-gray-900">{formatIDR(item.amount)}</p>
                </div>

                <div className="flex gap-2 mt-4 w-full">
                  <button 
                    onClick={() => handleAction(item.id, 'rejected')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
                  >
                    <X size={18} /> Tolak
                  </button>
                  <button 
                    onClick={() => handleAction(item.id, 'approved')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                  >
                    <Check size={18} /> Bayar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Preview Image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} className="max-w-full max-h-full rounded-lg shadow-2xl" alt="Preview Struk" />
          <button className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full">
            <X size={24} />
          </button>
        </div>
      )}
    </div>
  );
}