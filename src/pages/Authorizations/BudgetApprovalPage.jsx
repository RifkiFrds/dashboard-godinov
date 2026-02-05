import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  Search, 
  Check, 
  X, 
  AlertTriangle, 
  Calendar,
  DollarSign,
  FileText,
  Filter
} from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";
import { H2 } from "../../components/ui/Text";

export default function BudgetApprovalPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBudgetRequests = async () => {
    setLoading(true);
    try {
      // Endpoint untuk mengambil pengajuan budget status 'pending'
      const response = await api.get("/api/authorizations/budget");
      if (response.data.success) {
        setBudgets(response.data.data);
      }
    } catch (error) {
      toast.error("Gagal memuat pengajuan budget");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const response = await api.post(`/api/authorizations/budget/${id}/${action}`);
      if (response.data.success) {
        toast.success(`Budget berhasil di-${action}`);
        fetchBudgetRequests(); // Refresh list
      }
    } catch (error) {
      toast.error("Gagal memproses pengajuan");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredBudgets = budgets.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <H2>Budget Approval</H2>
        <p className="text-gray-500 mt-1">Tinjau dan setujui alokasi anggaran perusahaan.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase mb-2">Total Pending</p>
          <p className="text-3xl font-black text-gray-900">{budgets.length}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
          <p className="text-emerald-600 text-xs font-bold uppercase mb-2">Nominal Pengajuan</p>
          <p className="text-3xl font-black text-emerald-700">
            {formatCurrency(budgets.reduce((acc, curr) => acc + curr.amount, 0))}
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Cari berdasarkan keperluan atau departemen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
          />
        </div>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 text-xs font-bold text-gray-400 uppercase">Detail Pengajuan</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase">Departemen</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase">Nominal</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
               <tr><td colSpan="4" className="p-10 text-center animate-pulse">Memuat data...</td></tr>
            ) : filteredBudgets.length === 0 ? (
               <tr>
                 <td colSpan="4" className="p-20 text-center">
                    <AlertTriangle className="mx-auto text-gray-200 mb-4" size={48} />
                    <p className="text-gray-400">Tidak ada pengajuan budget yang tertunda.</p>
                 </td>
               </tr>
            ) : (
              filteredBudgets.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    <p className="font-bold text-gray-800">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Calendar size={12} />
                      <span>{item.date}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {item.department}
                    </span>
                  </td>
                  <td className="p-5">
                    <p className="font-black text-gray-900">{formatCurrency(item.amount)}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleAction(item.id, 'approve')}
                        className="p-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                        title="Setujui"
                      >
                        <Check size={20} />
                      </button>
                      <button 
                        onClick={() => handleAction(item.id, 'reject')}
                        className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        title="Tolak"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}