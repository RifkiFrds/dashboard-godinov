import React from "react";
import { NavLink } from "react-router-dom";
import { 
  FolderKanban, 
  Blocks, 
  Server, 
  Target, 
  Calculator, 
  Scale, 
  FileDown, 
  Settings,
  LineChart
} from "lucide-react";
import MenuButton from "../../../components/ui/MenuButton";
import { H2 } from "../../../components/ui/Text";

export default function RABMenuPage() {
  
  const menuGroups = [
    {
      label: "Perencanaan & Input Data",
      items: [
        // {
        //   title: "Proyek RAB",
        //   desc: "Buat proyek baru atau kelola versi RAB yang sudah ada.",
        //   icon: FolderKanban,
        //   path: "/rab/projects",
        //   color: "bg-blue-50 text-blue-600"
        // },
        {
          title: "Modul & Fitur (CAPEX)",
          desc: "Input fitur, kompleksitas, dan estimasi jam pengembangan (Dev Cost).",
          icon: Blocks,
          path: "/rab/capex-select",
          color: "bg-indigo-50 text-indigo-600"
        },
        {
          title: "Biaya Operasional (OPEX)",
          desc: "Komponen biaya bulanan, infrastruktur, dan lisensi pihak ketiga.",
          icon: Server,
          path: "/rab/opex-select",
          color: "bg-cyan-50 text-cyan-600"
        }
      ]
    },
    {
      label: "Simulasi & Analisis Bisnis",
      items: [
        {
          title: "Asumsi Pendapatan",
          desc: "Simulasi tarif, volume pengguna, dan kenaikan harga tahunan.",
          icon: Target,
          path: "/rab/revenue-select",
          color: "bg-emerald-50 text-emerald-600"
        },
        {
          title: "Kalkulasi ROI & NPV",
          desc: "Analisis Arus Kas (Cashflow), Net Present Value, dan Profitabilitas.",
          icon: Calculator,
          path: "/rab/roi-select",
          color: "bg-orange-50 text-orange-600"
        },
        {
          title: "Break-Even Analysis",
          desc: "Titik impas (BEP) berdasarkan biaya tetap dan margin kontribusi.",
          icon: Scale,
          path: "/rab/break-select",
          color: "bg-pink-50 text-pink-600"
        }
      ]
    },
    {
      label: "Laporan & Ekspor",
      items: [
        {
          title: "Dashboard Metrik",
          desc: "Visualisasi grafik perbandingan CAPEX vs Profit 3 tahun.",
          icon: LineChart,
          path: "/rab/dashboard-select",
          color: "bg-purple-50 text-purple-600"
        },
        {
          title: "Ekspor Proposal",
          desc: "Cetak RAB dalam format PDF atau Excel untuk penawaran klien.",
          icon: FileDown,
          path: "/rab/export-select",
          color: "bg-slate-50 text-slate-600"
        },
        {
          title: "Konfigurasi Global",
          desc: "Pengaturan tingkat inflasi, pajak, dan discount rate default.",
          icon: Settings,
          path: "/rab/settings",
          color: "bg-gray-50 text-gray-600"
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4">
      
      {/* Header Section */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <H2>RAB Management</H2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Pusat estimasi biaya sistem, analisis investasi, dan proyeksi keuntungan (ROI).
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