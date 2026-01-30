import React from "react";
import { 
  FileBarChart, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calendar,
  FileText,
  ArrowUpRight
} from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

export default function FinancialReportPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <Breadcrumbs 
        items={[
          { label: "Laporan Keuangan", path: "/finance/reports" }
        ]} 
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <H2>Financial Statements</H2>
          <p className="text-gray-500 text-sm mt-1">Analisa performa keuangan, neraca saldo, dan laporan laba rugi perusahaan.</p>
        </div>
        <div className="flex gap-2">
            <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100">
                <option>FY 2023</option>
                <option>FY 2024</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition">
                <Download size={16} /> Export PDF
            </button>
        </div>
      </div>

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gross Revenue</p>
            <h3 className="text-3xl font-black text-gray-800 mt-1">Rp 4.280M</h3>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
                <TrendingUp size={14} /> +12.5% <span className="text-gray-400 font-normal ml-1 text-[10px]">vs last month</span>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <TrendingUp size={80} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Profit</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">Rp 1.120M</h3>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
                <TrendingUp size={14} /> +5.2% <span className="text-gray-400 font-normal ml-1 text-[10px]">margin 26.1%</span>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Operating Expenses</p>
            <h3 className="text-3xl font-black text-red-500 mt-1">Rp 2.850M</h3>
            <div className="flex items-center gap-1 text-red-500 text-xs font-bold mt-2">
                <TrendingDown size={14} /> +8.1% <span className="text-gray-400 font-normal ml-1 text-[10px]">increase in OPEX</span>
            </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-gray-800">Revenue vs Expenses (Monthly)</h4>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Revenue
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span> Expenses
                    </span>
                </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <FileBarChart size={40} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 italic">Chart.js Visualisation Placeholder</p>
                </div>
            </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-6">Top Expense Categories</h4>
            <div className="space-y-5">
                {[
                    { label: 'Payroll', val: '45%', color: 'bg-blue-500' },
                    { label: 'Marketing', val: '25%', color: 'bg-indigo-500' },
                    { label: 'Infrastructure', val: '20%', color: 'bg-purple-500' },
                    { label: 'Others', val: '10%', color: 'bg-gray-400' }
                ].map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-gray-600 font-medium">{item.label}</span>
                            <span className="text-gray-800 font-bold">{item.val}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full">
                            <div className={`${item.color} h-full rounded-full`} style={{ width: item.val }}></div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-8 py-2.5 text-xs font-bold text-blue-600 border border-blue-50 rounded-xl hover:bg-blue-50 transition">
                VIEW FULL BREAKDOWN
            </button>
        </div>
      </div>

      {/* Available Reports List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h4 className="font-bold text-gray-800 text-sm">Downloadable Official Statements</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {[
                { title: 'Profit & Loss Statement', date: 'Monthly Update' },
                { title: 'Balance Sheet', date: 'Quarterly Update' },
                { title: 'Cash Flow Statement', date: 'Real-time' }
            ].map((report, i) => (
                <div key={i} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FileText size={20} />
                        </div>
                        <ArrowUpRight size={18} className="text-gray-300 group-hover:text-blue-600" />
                    </div>
                    <h5 className="font-bold text-gray-800 mt-4">{report.title}</h5>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{report.date}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}