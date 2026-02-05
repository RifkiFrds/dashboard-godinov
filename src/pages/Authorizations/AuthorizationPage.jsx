import React from "react";
import { NavLink } from "react-router-dom";
import { 
  ShieldCheck, 
  Key, 
  FileCheck, 
  UserCog, 
  Wallet, 
  CreditCard,
  Lock,
  Rocket
} from "lucide-react";
import MenuButton from "../../components/ui/MenuButton";
import { H2 } from "../../components/ui/Text";
import { useAuth } from "../../api/AuthContext";

export default function AuthorizationMenuPage() {
  const { user } = useAuth();

  // Konfigurasi Menu dengan filter Role
  const menuGroups = [
    {
      label: "Otorisasi Project",
      roles: ["admin", "pm"], // Hanya Admin dan PM
      items: [
        {
          title: "Task OTP Approval",
          desc: "Berikan kode otorisasi untuk staff yang menyelesaikan task tanpa timer.",
          icon: Key,
          path: "/authorization/project-otp",
          color: "bg-blue-50 text-blue-600"
        },
        // {
        //   title: "Project Milestone",
        //   desc: "Persetujuan penyelesaian fase project dan rilis fitur.",
        //   icon: Rocket,
        //   path: "/authorization/milestone",
        //   color: "bg-purple-50 text-purple-600"
        // }
      ]
    },
    {
      label: "Otorisasi Keuangan (CFO)",
      roles: ["admin", "cfo"], // Hanya Admin dan CFO
      items: [
        {
          title: "Budget Approval",
          desc: "Otorisasi pengajuan anggaran besar dan dana darurat.",
          icon: Wallet,
          path: "/authorization/budget-otp",
          color: "bg-emerald-50 text-emerald-600"
        },
        {
          title: "Expense Reimburse",
          desc: "Persetujuan klaim pengeluaran operasional tingkat tinggi.",
          icon: CreditCard,
          path: "/authorization/reimburse-otp",
          color: "bg-orange-50 text-orange-600"
        }
      ]
    },
    {
      label: "Sistem & Keamanan",
      roles: ["admin"], // Hanya Admin Utama
      items: [
        {
          title: "Role Management",
          desc: "Atur hak akses pengguna dan level otorisasi setiap jabatan.",
          icon: UserCog,
          path: "/authorization/roles",
          color: "bg-red-50 text-red-600"
        },
        {
          title: "Security Audit",
          desc: "Monitoring log akses dan aktivitas otorisasi sensitif.",
          icon: ShieldCheck,
          path: "/authorization/audit",
          color: "bg-slate-50 text-slate-600"
        }
      ]
    }
  ];

  // Filter kelompok menu berdasarkan role user saat ini
  const filteredGroups = menuGroups.filter(group => 
    group.roles.includes(user?.role)
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4">
      
      {/* Header Section */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <H2>Authorization Center</H2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Pusat kendali persetujuan, otorisasi OTP, dan manajemen hak akses.
        </p>
      </div>

      {/* Empty State jika tidak punya akses sama sekali */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
           <Lock className="mx-auto text-gray-300 mb-4" size={48} />
           <p className="text-gray-500 font-medium">Anda tidak memiliki akses ke menu otorisasi apapun.</p>
        </div>
      ) : (
        /* Menu Grid Loop */
        <div className="space-y-10">
          {filteredGroups.map((group, groupIdx) => (
            <section key={groupIdx} className="animate-fade-in">
              {/* Group Label */}
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                {group.label}
              </h3>
              
              {/* Grid Items */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      )}
      
    </div>
  );
}