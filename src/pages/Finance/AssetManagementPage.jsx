import React, { useState } from "react";
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Laptop, 
  Car, 
  Armchair, 
  History,
  TrendingDown
} from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

export default function AssetManagementPage() {
  // Mock Data Aset
  const [assets] = useState([
    { 
      id: "AST-2023-001", 
      name: "MacBook Pro M2 14\"", 
      category: "Elektronik", 
      purchaseDate: "2023-01-15", 
      value: "Rp 32.000.000", 
      location: "HO - Jakarta",
      status: "Active" 
    },
    { 
      id: "AST-2023-042", 
      name: "Honda CR-V Operasional", 
      category: "Kendaraan", 
      purchaseDate: "2022-05-10", 
      value: "Rp 520.000.000", 
      location: "HO - Jakarta",
      status: "Maintenance" 
    },
    { 
      id: "AST-2023-089", 
      name: "Meja Kerja Ergonomis", 
      category: "Furnitur", 
      purchaseDate: "2023-08-20", 
      value: "Rp 4.500.000", 
      location: "Branch - Bandung",
      status: "Active" 
    },
  ]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Maintenance': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Retired': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Elektronik': return <Laptop size={16} />;
      case 'Kendaraan': return <Car size={16} />;
      case 'Furnitur': return <Armchair size={16} />;
      default: return <Building2 size={16} />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <Breadcrumbs 
        items={[
          { label: "Manajemen Aset", path: "/finance/assets" }
        ]} 
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <H2>Fixed Asset Management</H2>
          <p className="text-gray-500 text-sm mt-1">Lacak inventaris, lokasi, dan nilai penyusutan aset perusahaan.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                <History size={16} /> History
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition">
                <Plus size={16} /> Aset Baru
            </button>
        </div>
      </div>

      {/* Asset Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Total Nilai Aset</p>
            <h3 className="text-xl font-bold text-gray-800">Rp 12.4 M</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Total Unit</p>
            <h3 className="text-xl font-bold text-gray-800">458 <span className="text-xs font-normal text-gray-400">Items</span></h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase">Depresiasi</p>
                <TrendingDown size={14} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-2">Rp 85.2 Jt <span className="text-[10px] text-red-500 font-medium">/ bln</span></h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Dalam Perbaikan</p>
            <h3 className="text-xl font-bold text-gray-800">12 <span className="text-xs font-normal text-gray-400">Unit</span></h3>
        </div>
      </div>

      {/* Table Control */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Cari kode aset atau nama barang..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
            />
        </div>
        <div className="flex gap-2">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 bg-white">
                <Filter size={16} /> Kategori
            </button>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Kode & Nama Aset</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Tgl Perolehan</th>
                <th className="px-6 py-4">Lokasi</th>
                <th className="px-6 py-4 text-right">Nilai Buku</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-600">
              {assets.map((asset, idx) => (
                <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{asset.name}</div>
                    <div className="text-[10px] font-mono text-gray-400">{asset.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-gray-100 rounded text-gray-500">{getCategoryIcon(asset.category)}</span>
                        <span>{asset.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{asset.purchaseDate}</td>
                  <td className="px-6 py-4">{asset.location}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-800">{asset.value}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <MoreHorizontal size={18} />
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