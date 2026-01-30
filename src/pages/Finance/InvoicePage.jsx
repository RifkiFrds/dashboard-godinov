import React, { useState } from "react";
import { Plus, Search, Filter, Upload, MoreHorizontal } from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

export default function InvoicePage() {
  // Mock Data
  const [invoices] = useState([
    { id: "INV-001", client: "PT. Teknologi Maju", date: "2023-10-01", amount: "Rp 15.000.000", status: "Paid" },
    { id: "INV-002", client: "CV. Kreatif Digital", date: "2023-10-05", amount: "Rp 8.500.000", status: "Pending" },
    { id: "INV-003", client: "Global Corp Ltd", date: "2023-10-12", amount: "Rp 45.000.000", status: "Overdue" },
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">

    <Breadcrumbs 
      items={[
        { label: "Manajemen Invoice", path: "/finance/invoices" } 
      ]} 
    />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <H2>Manajemen Invoice</H2>
          <p className="text-gray-500 text-sm mt-1">Kelola semua tagihan masuk dan keluar.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                <Upload size={16} /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                <Plus size={16} /> Buat Invoice
            </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Cari No. Invoice atau Client..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
            />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-600">
            <Filter size={16} /> Filter Status
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">No. Invoice</th>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold">Jumlah</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{inv.id}</td>
                  <td className="px-6 py-4 text-gray-600">{inv.client}</td>
                  <td className="px-6 py-4 text-gray-500">{inv.date}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{inv.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600">
                        <MoreHorizontal size={20} />
                    </button>
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