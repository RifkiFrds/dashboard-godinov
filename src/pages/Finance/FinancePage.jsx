import React from "react";
import { NavLink } from "react-router-dom";
import { 
  FileText, 
  ArrowRightLeft, 
  Users, 
  PieChart, 
  Landmark, 
  Receipt, 
  Building2, 
  Briefcase,
  TrendingUp,
  FileBarChart
} from "lucide-react";
import MenuButton from "../../components/ui/MenuButton";
import { H2 } from "../../components/ui/Text";

export default function FinanceMenuPage() {
  
  const menuGroups = [
    {
      label: "Operasional Harian",
      items: [
        {
          title: "Invoice & Piutang",
          desc: "Kelola tagihan client dan monitoring status pembayaran (AR).",
          icon: FileText,
          path: "/finance/invoices",
          color: "bg-blue-50 text-blue-600"
        },
        {
          title: "CashFlow & Kas",
          desc: "Pencatatan uang masuk/keluar dan rekonsiliasi bank.",
          icon: ArrowRightLeft,
          path: "/finance/cashflow",
          color: "bg-emerald-50 text-emerald-600"
        },
        {
          title: "Expense & Reimburse",
          desc: "Klaim pengeluaran operasional dan persetujuan biaya.",
          icon: Receipt,
          path: "/finance/expenses",
          color: "bg-orange-50 text-orange-600"
        }
      ]
    },
    {
      label: "Kontrol & Kepatuhan",
      items: [
        {
          title: "Payroll & Gaji",
          desc: "Hitung gaji karyawan, BPJS, dan slip gaji otomatis.",
          icon: Users,
          path: "/finance/payroll",
          color: "bg-purple-50 text-purple-600"
        },
        {
          title: "Pajak (Tax)",
          desc: "Perhitungan PPh 21, PPN, dan pelaporan SPT masa.",
          icon: Landmark,
          path: "/finance/tax",
          color: "bg-red-50 text-red-600"
        },
        {
          title: "Manajemen Aset",
          desc: "Inventaris aset tetap dan perhitungan depresiasi.",
          icon: Building2,
          path: "/finance/assets",
          color: "bg-cyan-50 text-cyan-600"
        }
      ]
    },
    {
      label: "Strategis & Laporan",
      items: [
        {
          title: "Budgeting",
          desc: "Perencanaan anggaran tahunan dan forecasting.",
          icon: TrendingUp,
          path: "/finance/budgeting",
          color: "bg-pink-50 text-pink-600"
        },
        {
          title: "Procurement",
          desc: "Manajemen vendor dan Purchase Order (PO).",
          icon: Briefcase,
          path: "/finance/procurement",
          color: "bg-indigo-50 text-indigo-600"
        },
        {
          title: "Laporan Keuangan",
          desc: "Laba Rugi, Neraca, dan Buku Besar (General Ledger).",
          icon: FileBarChart,
          path: "/finance/reports",
          color: "bg-slate-50 text-slate-600"
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4">
      
      {/* Header Section */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <H2>Finance Central</H2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Pusat kendali keuangan, akuntansi, dan pelaporan perusahaan.
        </p>
      </div>

      {/* Menu Grid Loop */}
      <div className="space-y-10">
        {menuGroups.map((group, groupIdx) => (
          <section key={groupIdx} className="animate-fade-in">
            {/* Group Label */}
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              {group.label}
            </h3>
            
            {/* Grid Items */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {group.items.map((item, idx) => (
                <NavLink key={idx} to={item.path} className="block h-full outline-none">
                  <MenuButton
                    title={item.title}
                    desc={item.desc}
                    icon={item.icon}
                    color={item.color}
                  />
                </NavLink>
              ))}
            </div>
          </section>
        ))}
      </div>
      
    </div>
  );
}