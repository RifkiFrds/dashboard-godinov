import React, { useState } from "react";
import { 
  Landmark, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  FileCheck, 
  Calendar,
  ExternalLink
} from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

export default function TaxManagementPage() {
  // Mock Data Perpajakan
  const [taxRecords] = useState([
    { 
      id: "TAX-2023-10-01", 
      type: "PPh 21", 
      period: "September 2023", 
      amount: "Rp 12.450.000", 
      dueDate: "2023-10-10",
      status: "Reported" 
    },
    { 
      id: "TAX-2023-10-02", 
      type: "PPN (Value Added Tax)", 
      period: "September 2023", 
      amount: "Rp 45.200.000", 
      dueDate: "2023-10-31",
      status: "Calculated" 
    },
    { 
      id: "TAX-2023-10-03", 
      type: "PPh 23", 
      period: "September 2023", 
      amount: "Rp 2.100.000", 
      dueDate: "2023-10-10",
      status: "Overdue" 
    },
  ]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Reported': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Calculated': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <Breadcrumbs 
        items={[
          { label: "Pajak (Tax)", path: "/finance/tax" }
        ]} 
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <H2>Tax Management & Compliance</H2>
          <p className="text-gray-500 text-sm mt-1">Monitoring kewajiban pajak PPh 21, 23, 25, dan PPN secara terpadu.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                <Download size={16} /> Rekap SPT
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm transition">
                <FileCheck size={16} /> Buat ID Billing
            </button>
        </div>
      </div>

      {/* Tax Alert for Deadlines */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 flex items-start gap-4 animate-pulse-subtle">
        <AlertTriangle className="text-red-600 shrink-0" size={24} />
        <div>
            <h4 className="text-sm font-bold text-red-800">Peringatan Jatuh Tempo</h4>
            <p className="text-xs text-red-700 mt-1">
                Ada **2 laporan pajak** (PPh 23) yang akan jatuh tempo dalam 48 jam ke depan. Segera lakukan validasi data.
            </p>
        </div>
      </div>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Landmark size={20} /></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimasi</span>
            </div>
            <p className="text-sm text-gray-500">Total Kewajiban Bulan Ini</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">Rp 59.750.000</h3>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Calendar size={20} /></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kepatuhan</span>
            </div>
            <p className="text-sm text-gray-500">Pajak Sudah Dilaporkan</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">1/3 <span className="text-sm font-normal text-gray-400">Modul</span></h3>
        </div>

        <div className="bg-blue-900 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-blue-200 text-sm">Akses DJP Online</p>
                <h3 className="text-lg font-bold mt-1">e-Filing Terintegrasi</h3>
                <button className="mt-4 flex items-center gap-2 text-xs bg-white/20 hover:bg-white/30 py-2 px-3 rounded-lg transition">
                    Buka Portal <ExternalLink size={12} />
                </button>
            </div>
            <Landmark className="absolute -right-4 -bottom-4 text-white/10" size={100} />
        </div>
      </div>

      {/* Tax Records Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/30">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Cari jenis pajak..." className="w-full pl-9 pr-4 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 border px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50">
                <Filter size={16} /> Filter Tahun
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">ID Transaksi</th>
                <th className="px-6 py-4">Jenis Pajak</th>
                <th className="px-6 py-4">Masa Pajak</th>
                <th className="px-6 py-4">Nominal</th>
                <th className="px-6 py-4">Jatuh Tempo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {taxRecords.map((tax, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{tax.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{tax.type}</td>
                  <td className="px-6 py-4 text-gray-600">{tax.period}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{tax.amount}</td>
                  <td className="px-6 py-4 text-gray-500">{tax.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(tax.status)}`}>
                      {tax.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-blue-600 font-medium hover:underline cursor-pointer text-xs">
                    Lihat Bukti
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