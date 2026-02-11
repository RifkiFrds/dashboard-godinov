import React, { useState, useEffect } from "react";
import { 
  Save, 
  Building2, 
  Percent, 
  Users, 
  RefreshCcw, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import api from "../../../api";
import { H2 } from "../../../components/ui/Text";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";

export default function RABSettingsPage() {

  // --- State ---
  const [isLoading, setIsLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(null);

  // State config
  const [config, setConfig] = useState({
    company_name: "",
    company_address: "",
    contact_email: "",
    prepared_by: "",
    default_tax_rate: 11,
    default_inflation_rate: 5,
    default_discount_rate: 10,
    default_hourly_rate: 150000,
    default_variable_cost_percentage: 35,
    work_hours_per_day: 8,
    work_days_per_month: 22,
  });

  //fetch data global
  useEffect(() => {
      fetchSettings();
  }, []);

 const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/rab/settings");
      
      if (response.data.success && response.data.data) {
        setConfig(prev => ({ ...prev, ...response.data.data }));
      }
    } catch (err) {
      console.error("Error fetching global settings:", err);
      setError("Gagal memuat pengaturan global.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---
  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      // Endpoint Global baru
      const response = await api.post("/api/rab/settings", config);

      if (response.data.success) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error("Error saving:", err);
      setError("Gagal menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if(window.confirm("Batalkan perubahan yang belum disimpan? Data akan dikembalikan ke kondisi terakhir di server.")) {
      fetchSettings(); // Refetch dari server
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Memuat Master Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 min-h-screen relative pb-20">
      <Breadcrumbs 
            items={[
              { label: "RAB Center", path: "/rab" },
              { label: "Pengaturan", path: "#" },
            ]} 
          />
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 gap-4 mb-6">
        <div>
          <H2>Master Konfigurasi</H2>
          <p className="text-gray-500 text-sm mt-1">
            Pengaturan sistem global yang berlaku untuk seluruh aplikasi.
          </p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
                {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                Simpan Global
            </button>
        </div>
      </div>

      {/* --- ERROR ALERT --- */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* SECTION 1: PROFIL PERUSAHAAN */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Building2 className="text-blue-600" size={20} />
            Identitas Perusahaan (Untuk Proposal)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Nama Perusahaan</label>
                <input 
                  type="text" 
                  value={config.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  className="w-full p-2.5 text-gray-600 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-not-allowed"
                  disabled
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Alamat Lengkap</label>
                <textarea 
                  rows={3}
                  value={config.company_address}
                  onChange={(e) => handleChange("company_address", e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Email Kontak</label>
                <input 
                  type="email" 
                  value={config.contact_email}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Prepared By</label>
                <input 
                  type="text" 
                  value={config.prepared_by}
                  onChange={(e) => handleChange("prepared_by", e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Cth: Tim IT Internal"
                />
                <p className="text-[10px] text-gray-400 mt-1">Nama default pembuat RAB di footer proposal.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PARAMETER KEUANGAN */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Percent className="text-emerald-600" size={20} />
            Default Finansial
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Pajak PPN (VAT)</label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  value={config.default_tax_rate}
                  onChange={(e) => handleChange("tax_rate", e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-right font-mono"
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 p-2 rounded-r-lg text-sm text-gray-500 font-bold">%</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Inflasi Tahunan (Asumsi)</label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  step="0.1"
                  value={config.default_inflation_rate}
                  onChange={(e) => handleChange("inflation_rate", e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-right font-mono"
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 p-2 rounded-r-lg text-sm text-gray-500 font-bold">%</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Digunakan untuk estimasi kenaikan OPEX di Tahun 2 & 3.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Discount Rate (NPV)</label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  value={config.default_discount_rate}
                  onChange={(e) => handleChange("discount_rate", e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-right font-mono"
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 p-2 rounded-r-lg text-sm text-gray-500 font-bold">%</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Suku bunga acuan untuk menghitung Net Present Value.</p>
            </div>
            
            {/* Variable Cost Rate (BEP) - Tambahan agar lengkap */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Variable Cost Ratio (BEP Default)</label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  value={config.default_variable_cost_percentage}
                  onChange={(e) => handleChange("variable_cost_percentage", e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-right font-mono"
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 p-2 rounded-r-lg text-sm text-gray-500 font-bold">%</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Default margin kontribusi untuk analisis BEP.</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: MANPOWER STANDARDS */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Users className="text-orange-600" size={20} />
            Standar Manpower & Waktu
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Rate Developer (Rata-rata)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm font-bold">Rp</span>
                <input 
                  type="number" 
                  value={config.default_hourly_rate}
                  onChange={(e) => handleChange("default_hourly_rate", e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none font-mono"
                />
                <span className="absolute right-3 top-2 text-gray-400 text-xs">/ Jam</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Acuan dasar kalkulasi biaya modul CAPEX.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Jam Kerja/Hari</label>
                <input 
                  type="number" 
                  value={config.work_hours_per_day}
                  onChange={(e) => handleChange("work_hours_per_day", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none text-center"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Hari Kerja/Bulan</label>
                <input 
                  type="number" 
                  value={config.work_days_per_month}
                  onChange={(e) => handleChange("work_days_per_month", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none text-center"
                />
              </div>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-xs text-orange-800 flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <p>
                Mengubah standar waktu akan mempengaruhi konversi Mandays ke Manhours pada proyek baru. Proyek lama tidak akan berubah.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* --- TOAST NOTIFICATION --- */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-up z-50">
          <CheckCircle2 className="text-emerald-400" size={20} />
          <div>
            <h4 className="text-sm font-bold">Tersimpan!</h4>
            <p className="text-xs text-gray-300">Pengaturan global aktif untuk semua proyek baru.</p>
          </div>
        </div>
      )}

    </div>
  );
}