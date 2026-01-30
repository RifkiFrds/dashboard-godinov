import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Users, 
  CheckCircle2, 
  Clock,
  Banknote
} from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

export default function PayrollPage() {
  // Mock Data Karyawan & Gaji
  const [payrollData] = useState([
    { 
      id: "EMP-001", 
      name: "Budi Santoso", 
      position: "Senior Developer", 
      basicSalary: "Rp 15.000.000", 
      allowance: "Rp 2.000.000",
      total: "Rp 17.000.000",
      status: "Processed" 
    },
    { 
      id: "EMP-002", 
      name: "Siti Aminah", 
      position: "UI/UX Designer", 
      basicSalary: "Rp 10.000.000", 
      allowance: "Rp 1.500.000",
      total: "Rp 11.500.000",
      status: "Pending" 
    },
    { 
      id: "EMP-003", 
      name: "Rian Pratama", 
      position: "Project Manager", 
      basicSalary: "Rp 18.000.000", 
      allowance: "Rp 3.000.000",
      total: "Rp 21.000.000",
      status: "Paid" 
    },
  ]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Processed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <Breadcrumbs 
        items={[
          { label: "Payroll & Gaji", path: "/finance/payroll" }
        ]} 
      />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <H2>Payroll & Kompensasi</H2>
          <p className="text-gray-500 text-sm mt-1">Manajemen upah, tunjangan, dan status pembayaran gaji karyawan.</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                <Download size={16} /> Slip Gaji Kolektif
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                <Plus size={16} /> Run Payroll
            </button>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
          <div>
            <p className="text-xs text-gray-500">Total Karyawan</p>
            <p className="text-lg font-bold text-gray-800">124 Orang</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Banknote size={20} /></div>
          <div>
            <p className="text-xs text-gray-500">Total Pengeluaran Gaji</p>
            <p className="text-lg font-bold text-gray-800">Rp 1.2 M</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Clock size={20} /></div>
          <div>
            <p className="text-xs text-gray-500">Menunggu Persetujuan</p>
            <p className="text-lg font-bold text-gray-800">12 Orang</p>
          </div>
        </div>
      </div>

      {/* Table Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Cari nama karyawan atau jabatan..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
            />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-600">
            <Filter size={16} /> Filter Periode
        </button>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Karyawan</th>
                <th className="px-6 py-4 font-semibold">Jabatan</th>
                <th className="px-6 py-4 font-semibold">Gaji Pokok</th>
                <th className="px-6 py-4 font-semibold">Tunjangan</th>
                <th className="px-6 py-4 font-semibold">Total Bersih</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payrollData.map((emp, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{emp.name}</div>
                    <div className="text-xs text-gray-400">{emp.id}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{emp.position}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.basicSalary}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.allowance}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{emp.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 w-fit ${getStatusStyle(emp.status)}`}>
                      {emp.status === 'Paid' && <CheckCircle2 size={12} />}
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-6 py-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
            <p className="text-xs text-gray-500">Menampilkan 3 dari 124 Karyawan</p>
            <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-200 rounded text-xs disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-gray-200 rounded text-xs hover:bg-white">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}