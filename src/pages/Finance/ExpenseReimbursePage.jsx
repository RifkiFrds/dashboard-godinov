import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Search, Filter, Download, MoreHorizontal, Receipt, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import api from "../../api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ReimbursementDetailModal from "../../components/finances/ReimbursementDetailModal";
import Pagination from "../../components/ui/Pagination";

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export default function ExpenseReimbursePage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', page: 1, per_page: 15 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);


  // Menggunakan useMemo agar kalkulasi hanya berjalan saat data 'submissions' berubah
  const stats = useMemo(() => {
    if (!submissions.length) return { pending_count: 0, approved_total: 0, top_category: 'N/A' };

    // 1. Hitung jumlah status 'Pending'
    const pending = submissions.filter(item => item.status === 'Pending').length;

    // 2. Hitung total nominal status 'Approved' atau 'Paid'
    // Menggunakan parseFloat karena dari backend biasanya dikirim sebagai string decimal/numeric
    const totalApproved = submissions
      .filter(item => item.status === 'Approved' || item.status === 'Paid')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    // 3. Cari Kategori Terbanyak
    const categoryCounts = submissions.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const topCat = Object.entries(categoryCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ['N/A', 0])[0];

    return {
      pending_count: pending,
      approved_total: totalApproved,
      top_category: topCat
    };
  }, [submissions]);

const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const response = await api.get('/api/finance/expenses', { params: filters });
    
    // Debug: Cek apakah data muncul di console
    console.log("API Response:", response.data);

    // Laravel Paginate menyimpan array di response.data.data
    const rawData = response.data.data || [];
    
    const formattedData = rawData.map(item => ({
      ...item,
      // Pastikan item.amount adalah angka
      amountFormatted: formatCurrency(item.amount || 0),
      dateFormatted: item.transaction_date 
        ? format(new Date(item.transaction_date), "dd MMMM yyyy", { locale: id }) 
        : '-',
      // Fallback jika user null
      userName: item.user?.name || 'User Tidak Ditemukan'
    }));
    
    setSubmissions(formattedData);
    setPagination(response.data); 
  } catch (error) {
    console.error("Fetch Error:", error);
    toast.error("Gagal memuat data.");
  } finally {
    setLoading(false);
  }
}, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logika Filter, Page Change, Approve, dan Reject tetap sama
  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  const handlePageChange = (newPage) => setFilters(prev => ({ ...prev, page: newPage }));
  
  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleApprove = async (id) => {
    try {
        await api.put(`/api/finance/expenses/${id}`, { status: 'Approved' });
        toast.success(`Klaim #${id} disetujui.`);
        fetchData();
        setIsModalOpen(false);
    } catch (error) { toast.error("Gagal menyetujui klaim."); }
  };

  const handleReject = async (id, reason) => {
    try {
        await api.put(`/api/finance/expenses/${id}`, { status: 'Rejected', notes: reason });
        toast.warn(`Klaim #${id} ditolak.`);
        fetchData();
        setIsModalOpen(false);
    } catch (error) { toast.error("Gagal menolak klaim."); }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Paid': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        <Breadcrumbs items={[{ label: "Expense & Reimburse", path: "/finance/expenses" }]} />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-8 gap-4">
          <div>
            <H2>Expense & Reimbursement</H2>
            <p className="text-gray-500 text-sm mt-1">Pantau dan setujui klaim pengeluaran karyawan secara real-time.</p>
          </div>
        </div>

        {/* Dashboard Stats (Dihitung dari Frontend) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Clock size={24} /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Menunggu</p>
                <p className="text-xl font-bold text-gray-800">{stats.pending_count} Klaim</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={24} /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Disetujui (Halaman ini)</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(stats.approved_total)}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Receipt size={24} /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Kategori Terbanyak</p>
                <p className="text-xl font-bold text-gray-800">{stats.top_category}</p>
              </div>
            </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Cari karyawan atau deskripsi..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100" onChange={(e) => handleFilterChange('search', e.target.value)} />
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50" onChange={(e) => handleFilterChange('status', e.target.value)}>
            <option value="">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Karyawan</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Jumlah</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="6" className="text-center p-8 text-gray-500">Memuat data...</td></tr>
                ) : (
                  submissions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{item.user?.name || 'User'}</div>
                        <div className="text-[10px] text-gray-400 font-mono">ID: {item.id}</div>
                      </td>
                      <td className="px-6 py-4"><span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs">{item.category}</span></td>
                      <td className="px-6 py-4 text-gray-500">{item.dateFormatted}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{item.amountFormatted}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(item.status)}`}>{item.status}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleViewDetails(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Eye size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
        </div>
      </div>
      
      {isModalOpen && (
        <ReimbursementDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} submission={selectedSubmission} onApprove={handleApprove} onReject={handleReject} />
      )}
    </>
  );
}