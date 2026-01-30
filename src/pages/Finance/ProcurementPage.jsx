import React, { useState } from "react";
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Truck, 
  FileText, 
  PackageCheck,
  Clock,
  ExternalLink
} from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

export default function ProcurementPage() {
  // Mock Data Pengadaan Barang/Jasa
  const [orders] = useState([
    { 
      id: "PO-2023-1104", 
      vendor: "PT. Sumber Makmur", 
      item: "Laptop Workstation (10 Unit)", 
      requestDate: "2023-10-28", 
      total: "Rp 250.000.000", 
      status: "On Delivery" 
    },
    { 
      id: "PO-2023-1105", 
      vendor: "CV. Alat Kantor Jaya", 
      item: "Furniture Ruang Meeting", 
      requestDate: "2023-10-29", 
      total: "Rp 45.000.000", 
      status: "Approved" 
    },
    { 
      id: "PO-2023-1106", 
      vendor: "Global Cloud Services", 
      item: "Annual Server Subscription", 
      requestDate: "2023-10-30", 
      total: "Rp 120.000.000", 
      status: "Pending" 
    },
  ]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'On Delivery': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <Breadcrumbs 
        items={[
          { label: "Procurement", path: "/finance/procurement" }
        ]} 
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <H2>Procurement & Purchasing</H2>
          <p className="text-gray-500 text-sm mt-1">Kelola permintaan pembelian barang, Purchase Order, dan hubungan vendor.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                <Truck size={16} /> Daftar Vendor
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition">
                <Plus size={16} /> Create PO
            </button>
        </div>
      </div>

      {/* Procurement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Orders</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">24 <span className="text-sm font-normal text-gray-400">PO</span></h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={24} /></div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Awaiting Approval</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">08 <span className="text-sm font-normal text-gray-400">Requests</span></h3>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Clock size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fulfilled This Month</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">156 <span className="text-sm font-normal text-gray-400">Items</span></h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><PackageCheck size={24} /></div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Cari nomor PO atau nama vendor..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
            />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 text-gray-600">
            <Filter size={16} /> Filter Vendor
        </button>
      </div>

      {/* Procurement Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 text-center">No. PO</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Item/Deskripsi</th>
                <th className="px-6 py-4">Tanggal Order</th>
                <th className="px-6 py-4 text-right">Total Nilai</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-blue-600 font-medium text-center">{order.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{order.vendor}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{order.item}</td>
                  <td className="px-6 py-4 text-gray-500">{order.requestDate}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">{order.total}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button title="Print PO" className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                            <ExternalLink size={18} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600">
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