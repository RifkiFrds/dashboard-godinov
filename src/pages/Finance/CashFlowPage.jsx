import React from "react";
import { ArrowUpRight, ArrowDownRight, Wallet, PieChart } from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

const StatCard = ({ title, amount, type }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{amount}</h3>
        </div>
        <div className={`p-3 rounded-full ${type === 'in' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {type === 'in' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
        </div>
    </div>
);

export default function CashFlowPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
    <Breadcrumbs 
      items={[
        { label: "Cash Flow Monitor", path: "/finance/cashflow" } 
      ]} 
    />

      <div className="mb-6">
        <H2>Cash Flow Monitor</H2>
        <p className="text-gray-500 text-sm mt-1">Monitoring alur kas masuk dan keluar bulan ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Pemasukan" amount="Rp 125.000.000" type="in" />
        <StatCard title="Total Pengeluaran" amount="Rp 42.000.000" type="out" />
        <div className="bg-blue-600 p-5 rounded-xl text-white shadow-md flex flex-col justify-center">
            <p className="text-blue-100 text-sm mb-1">Saldo Kas Saat Ini</p>
            <h3 className="text-2xl font-bold">Rp 83.000.000</h3>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Chart Placeholder / Analysis */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">Analisa Arus Kas</h3>
                <select className="text-sm border-gray-200 border rounded-md p-1 bg-gray-50">
                    <option>Bulan Ini</option>
                    <option>Kuartal Ini</option>
                </select>
            </div>
            {/* Placeholder Grafik */}
            <div className="w-full h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                <PieChart size={48} className="mb-2 opacity-50"/>
                <span className="text-sm">Area Grafik (Integrasikan Chart.js / Recharts disini)</span>
            </div>
        </div>

        {/* Right: Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">Transaksi Terakhir</h3>
            <div className="space-y-4">
                {[1,2,3,4].map((i) => (
                    <div key={i} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <Wallet size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Pembayaran Server</p>
                                <p className="text-xs text-gray-500">20 Okt 2023</p>
                            </div>
                        </div>
                        <span className="text-sm font-semibold text-red-600">- Rp 2.5jt</span>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition">
                Lihat Semua
            </button>
        </div>

      </div>
    </div>
  );
}