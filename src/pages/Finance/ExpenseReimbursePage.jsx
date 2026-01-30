import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Receipt, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Eye
} from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

export default function ExpenseReimbursePage() {
  // Mock Data Reimbursement
  const [expenses] = useState([
    { 
      id: "EXP-8801", 
      employee: "Dian Sastro", 
      category: "Transportasi", 
      date: "2023-10-25", 
      amount: "Rp 450.000", 
      status: "Pending",
      note: "Taxi ke Client Site PT. ABC"
    },
    { 
      id: "EXP-8802", 
      employee: "Bambang Pamungkas", 
      category: "Entertainment", 
      date: "2023-10-24", 
      amount: "Rp 1.200.000", 
      status: "Approved",
      note: "Makan siang dengan vendor IT"
    },
    { 
      id: "EXP-8803", 
      employee: "Siska Kohl", 
      category: "Office Supplies", 
      date: "2023-10-22", 
      amount: "Rp 350.000", 
      status: "Rejected",
      note: "Beli tinta printer (Salah Nota)"
    },
  ]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <Breadcrumbs 
        items={[
          { label: "Expense & Reimburse", path: "/finance/expenses" }
        ]} 
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <H2>Expense & Reimbursement</H2>
          <p className="text-gray-500 text-sm mt-1">Pantau dan setujui klaim pengeluaran karyawan secara real-time.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                <Download size={16} /> Report
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                <Plus size={16} /> Tambah Klaim
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Clock size={24} /></div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Menunggu</p>
            <p className="text-xl font-bold text-gray-800">12 Klaim</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Disetujui (Bulan ini)</p>
            <p className="text-xl font-bold text-gray-800">Rp 24.500.000</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Receipt size={24} /></div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kategori Terbanyak</p>
            <p className="text-xl font-bold text-gray-800">Transportasi</p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Cari ID klaim atau nama karyawan..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm transition-all"
            />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:bg-gray-50">
            <Filter size={16} /> Filter Status
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Karyawan & ID</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4">Jumlah</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">{item.employee}</div>
                    <div className="text-[10px] text-gray-400 font-mono tracking-tighter">{item.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 text-gray-500 italic max-w-xs truncate">{item.note}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{item.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                        <button title="Lihat Detail" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                            <Eye size={18} />
                        </button>
                        <button title="Menu" className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}