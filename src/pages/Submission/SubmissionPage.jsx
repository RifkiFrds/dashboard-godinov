import React from "react";
import { NavLink } from "react-router-dom";
import { 
  ReceiptText, 
  CalendarDays, 
  Stethoscope, 
  UserCog, 
  MapPin, 
  Laptop, 
  FileCheck, 
  Clock, 
  ShieldCheck,
  MessageSquarePlus
} from "lucide-react";
import MenuButton from "../../components/ui/MenuButton";
import { H2 } from "../../components/ui/Text";

export default function SubmissionMenuPage() {
  
  const menuGroups = [
    {
      label: "Klaim & Keuangan",
      items: [
        {
          title: "Reimbursement",
          desc: "Klaim biaya operasional, bensin, atau makan yang dikeluarkan.",
          icon: ReceiptText,
          path: "/submissions/reimburse",
          color: "bg-orange-50 text-orange-600"
        },
        {
          title: "Medical Claim",
          desc: "Pengajuan klaim kesehatan, kacamata, atau rawat inap.",
          icon: Stethoscope,
          path: "/submissions/medical",
          color: "bg-red-50 text-red-600"
        },
        {
          title: "Cash Advance",
          desc: "Permintaan uang muka untuk keperluan perjalanan dinas.",
          icon: FileCheck,
          path: "/submissions/cash-advance",
          color: "bg-emerald-50 text-emerald-600"
        }
      ]
    },
    {
      label: "Absensi & Izin",
      items: [
        {
          title: "Pengajuan Cuti",
          desc: "Ajukan cuti tahunan, sakit, atau alasan penting lainnya.",
          icon: CalendarDays,
          path: "/submissions/leave",
          color: "bg-blue-50 text-blue-600"
        },
        {
          title: "Lembur (Overtime)",
          desc: "Pencatatan jam kerja tambahan untuk persetujuan manajer.",
          icon: Clock,
          path: "/submissions/overtime",
          color: "bg-indigo-50 text-indigo-600"
        },
        {
          title: "Dinas Luar",
          desc: "Izin melakukan pekerjaan di luar kantor atau kunjungan klien.",
          icon: MapPin,
          path: "/submissions/business-trip",
          color: "bg-purple-50 text-purple-600"
        }
      ]
    },
    {
      label: "Administrasi & Fasilitas",
      items: [
        {
          title: "Permintaan Inventaris",
          desc: "Permintaan aset baru seperti laptop atau alat tulis kantor.",
          icon: Laptop,
          path: "/submissions/inventory",
          color: "bg-cyan-50 text-cyan-600"
        },
        {
          title: "Perubahan Data",
          desc: "Update data pribadi seperti alamat, rekening, atau status.",
          icon: UserCog,
          path: "/submissions/update-profile",
          color: "bg-slate-50 text-slate-600"
        },
        {
          title: "Surat Keterangan",
          desc: "Permintaan surat keterangan kerja atau referensi bank.",
          icon: ShieldCheck,
          path: "/submissions/certificate",
          color: "bg-pink-50 text-pink-600"
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4">
      
      {/* Header Section */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <H2>Submission Central</H2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Ajukan permintaan, klaim, dan izin secara mandiri dalam satu pintu.
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
      
      {/* Help Footer (Optional) */}
      <div className="mt-12 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquarePlus className="text-gray-400" size={20} />
          <span className="text-sm text-gray-600">Ada kendala atau pengajuan lain?</span>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:underline">
          Hubungi HR
        </button>
      </div>
      
    </div>
  );
}