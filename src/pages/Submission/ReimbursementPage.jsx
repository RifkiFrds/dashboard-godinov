import React, { useState, useEffect, useCallback } from 'react';
import { ReceiptText, Calendar, DollarSign, Briefcase, UploadCloud, X, Paperclip, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { H2 } from '../../components/ui/Text';
import api from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../api/AuthContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const expenseTypes = [
  "Transportasi", "Makan & Minum", "Akomodasi", "Pembelian Kantor", "Internet & Komunikasi", "Lainnya"
];

const getStatusStyle = (status) => {
  switch(status) {
    case 'Approved': return { icon: <CheckCircle2 size={14}/>, style: 'bg-emerald-100 text-emerald-700' };
    case 'Pending': return { icon: <Clock size={14}/>, style: 'bg-yellow-100 text-yellow-700' };
    case 'Rejected': return { icon: <XCircle size={14}/>, style: 'bg-red-100 text-red-700' };
    default: return { icon: <Clock size={14}/>, style: 'bg-gray-100 text-gray-700' };
  }
};

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export default function ReimbursementPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ transactionDate: '', category: '', amount: '', description: '', notes: '' });
  
  // Mengaktifkan kembali state file
  const [files, setFiles] = useState([]); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

// ReimbursementPage.jsx

const fetchHistory = useCallback(async () => {
  if (!user) return;
  setHistoryLoading(true);
  try {
    // Mengarah ke rute history yang baru dibuat
    const response = await api.get('/api/finance/expenses/history');
    
    // Data otomatis tersaring oleh backend, tidak perlu .filter() manual lagi
    const expensesData = response.data.data || [];

    setHistory(expensesData);
  } catch (error) {
    console.error("Gagal memuat riwayat:", error);
    toast.error("Gagal memuat riwayat pengajuan.");
  } finally {
    setHistoryLoading(false);
  }
}, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Mengaktifkan kembali fungsi file handler
  const handleFileChange = (e) => {
    if (e.target.files) {
      // Untuk receipt, umumnya 1 file sudah cukup. Jika ingin membatasi 1 file saja:
      setFiles([e.target.files[0]]); 
    }
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //debug user
    console.log("Current User Object:", user);
   
   if (!user || !user.email) {
        toast.error("Email pengguna tidak ditemukan.");
        return;
    }

    setIsSubmitting(true);

    // Menggunakan FormData karena kita mengirimkan file (multipart/form-data)
    const submissionData = new FormData();
    submissionData.append('description', formData.description);
    submissionData.append('amount', parseFloat(formData.amount));
    submissionData.append('category', formData.category);
    submissionData.append('transaction_date', formData.transactionDate);
    submissionData.append('status', 'Pending');
    submissionData.append('email', user.email); //req validasi user berdasarkan email
    if (formData.notes) submissionData.append('notes', formData.notes);
    
    // Append file jika ada (Sesuai validasi request di backend: 'receipt_file')
    if (files.length > 0) {
        submissionData.append('receipt_file', files[0]);
    }
    
    try {
        const response = await api.post('/api/finance/expenses', submissionData, {
            headers: {
                // Axios akan mendeteksi objek FormData dan otomatis menset header 
                // menjadi 'Content-Type': 'multipart/form-data' beserta boundary-nya.
            }
        });

        toast.success(`Pengajuan dari ${user.name} berhasil dikirim!`);
        setFormData({ transactionDate: '', category: '', amount: '', description: '', notes: '' });
        setFiles([]); // Reset file
        fetchHistory(); 
    } catch (error) {
        console.error("Backend Error Detail:", error.response?.data);
        toast.error(error.response?.data?.message || "Gagal mengirim pengajuan.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        <Breadcrumbs items={[{ label: "Submission", path: "/submissions" }, { label: "Reimbursement", path: "/submissions/reimburse" }]} />

        <div className="mt-4 mb-8">
          <H2>Formulir Pengajuan Reimbursement</H2>
          <p className="text-gray-500 text-sm mt-1">Isi detail di bawah untuk mengajukan klaim biaya dan lihat riwayat Anda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Transaksi</label>
                  <input type="date" id="transactionDate" name="transactionDate" value={formData.transactionDate} onChange={handleInputChange} required className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select id="category" name="category" value={formData.category} onChange={handleInputChange} required className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none">
                    <option value="" disabled>Pilih jenis klaim...</option>
                    {expenseTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Jumlah (IDR)</label>
                    <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="e.g., 50000" min="0" required className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Judul / Deskripsi</label>
                  <input type="text" id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="e.g., Beli alat kantor" maxLength="255" required className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows="3" placeholder="Jelaskan detail pengeluaran..." className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"></textarea>
              </div>

              {/* Tampilan Upload File Diaktifkan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bukti Pembayaran (Nota/Kuitansi)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-white hover:bg-gray-50 transition-colors">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex justify-center text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload file gambar/PDF</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500">Maks. 5MB</p>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                            <Paperclip size={16} className="text-blue-500" />
                            <span className="text-sm text-gray-800 font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                        </div>
                        <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50">
                            <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-wait transition-colors">{isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}</button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Pengajuan</h3>
              {historyLoading ? (
                <div className="text-center py-10 text-gray-500">Memuat riwayat...</div>
              ) : history.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <ReceiptText size={40} className="mx-auto mb-3 text-gray-300" />
                  Belum ada riwayat pengajuan.
                </div>
              ) : (
                <ul className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {history.map(item => {
                    const statusInfo = getStatusStyle(item.status);
                    return (
                      <li key={item.id} className="flex flex-col p-4 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl gap-2">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-800">{formatCurrency(item.amount)}</p>
                                <p className="text-xs font-medium text-gray-600 mt-0.5">{item.category}</p>
                            </div>
                            <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${statusInfo.style}`}>
                                {statusInfo.icon}
                                <span>{item.status || 'Pending'}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end mt-1">
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{item.description}</p>
                            <p className="text-[11px] text-gray-400 font-medium">{item.transaction_date ? format(new Date(item.transaction_date), "dd MMM yyyy", { locale: id }) : '-'}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}