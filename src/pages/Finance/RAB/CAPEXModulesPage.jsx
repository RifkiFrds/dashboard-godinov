import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Trash2, 
  Clock, 
  DollarSign, 
  Layers, 
  AlertCircle, 
  Loader2,
  ArrowLeft,
  Briefcase
} from "lucide-react";
import api from "../../../api";
import { H2 } from "../../../components/ui/Text";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";

export default function CapexModulesPage() {
  const { projectId } = useParams(); 
  const navigate = useNavigate();

  // --- State ---
  const [modules, setModules] = useState([]);
  const [projectInfo, setProjectInfo] = useState({ name: "", client_name: "" });
  
  // Rate Developer
  const [hourlyRate, setHourlyRate] = useState(150000); 
  
  // Form State
  const [newModule, setNewModule] = useState({ 
    feature_name: "", 
    sub_feature: "", 
    complexity: "Low", 
    estimated_hours: 0 
  });

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // --- 1. Fetch Data (Initial Load) ---
  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Hanya panggil API yang sudah siap (Project & Capex)
        const [resProject, resCapex] = await Promise.all([
          api.get(`/api/projects/${projectId}`),
          api.get(`/api/rab/capex/${projectId}`)
        ]);

        // Set Info Project (Nama & Client)
        if (resProject.data.success) {
          setProjectInfo(resProject.data.data);
        }

        // Set List Modul CAPEX
        if (resCapex.data.success) {
          // Ambil array items dari response data
          setModules(resCapex.data.data.items || []);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Periksa apakah Route /api/rab/capex sudah benar.");
      } finally {
        setIsLoading(false);
      }
    };

  // --- 2. Create Module (Add) ---
  const handleAddModule = async () => {
    // Validasi sederhana
    if (!newModule.feature_name || newModule.estimated_hours <= 0) {
      alert("Mohon isi Nama Fitur dan Estimasi Jam dengan benar.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        feature_name: newModule.feature_name,
        sub_feature: newModule.sub_feature,
        complexity: newModule.complexity,
        estimated_hours: Number(newModule.estimated_hours),
        hourly_rate: Number(hourlyRate) // Simpan rate saat ini ke DB history
      };

      const response = await api.post(`/api/rab/capex/${projectId}`, payload);

      if (response.data.success) {
        // Tambahkan item baru ke state lokal (Optimistic UI update) atau refetch
        // Kita refetch saja untuk memastikan ID dan calculation dari server sinkron
        fetchData(); 
        
        // Reset Form
        setNewModule({ feature_name: "", sub_feature: "", complexity: "Low", estimated_hours: 0 });
      }

    } catch (err) {
      console.error("Gagal menambah modul:", err);
      alert("Gagal menyimpan data ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. Delete Module ---
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus modul ini?")) return;

    try {
      // Optimistic Update: Hapus dari UI dulu biar cepat
      const prevModules = [...modules];
      setModules(modules.filter(m => m.id !== id));

      await api.delete(`/api/rab/capex/${id}`);
      
      // Jika gagal, kembalikan state
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus data.");
      fetchData(); // Rollback / Refresh data asli
    }
  };

  // --- Helper Functions ---
  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  // Kalkulasi total
  const calculateTotalHours = () => modules.reduce((acc, curr) => acc + Number(curr.estimated_hours), 0);
  const calculateTotalCapex = () => modules.reduce((acc, curr) => acc + Number(curr.total_cost), 0);

  const getComplexityColor = (level) => {
    switch (level) {
      case "High": return "bg-red-100 text-red-700 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Memuat Modul CAPEX...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <AlertCircle className="mx-auto mb-2" size={32} />
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">Kembali</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 min-h-screen space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-4">
         <Breadcrumbs 
            items={[
              { label: "RAB Center", path: "/rab" },
              { label: "Pilih Proyek untuk CAPEX", path: "/rab/capex-select" },
              { label: projectInfo.client_name, path: "#"} 
            ]} 
          />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide">
                Editing CAPEX
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Briefcase size={12} /> {projectInfo.client_name || "Client"}
              </span>
            </div>
            <H2>{projectInfo.name || "Loading..."}</H2>
            <p className="text-gray-500 text-sm mt-1">
              Rincian biaya pengembangan awal (Initial Investment).
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 shadow-sm">
            <span className="text-sm text-blue-800 font-medium mr-2">Rate Developer / Jam:</span>
            <div className="flex items-center bg-gray-200 border border-blue-200 rounded px-2 py-1 cursor-not-allowed">
              <span className="text-gray-500 text-xs mr-1">Rp</span>
              <input
                disabled 
                type="number" 
                value={hourlyRate} 
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="cursor-not-allowed w-24 text-sm font-bold text-blue-700 outline-none text-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Modul</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{modules.length}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Layers size={24} />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Estimasi Jam</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{calculateTotalHours()} <span className="text-sm font-normal text-gray-400">Jam</span></h3>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <div>
            <p className="text-blue-600 text-sm font-bold uppercase tracking-wide">Total CAPEX (T0)</p>
            <h3 className="text-2xl font-bold text-blue-700 mt-1">{formatRupiah(calculateTotalCapex())}</h3>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* --- INPUT FORM (ADD NEW) --- */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
         Tambah Modul Baru
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-3">
            <label className="text-xs text-gray-500 mb-1 block">Nama Fitur Utama</label>
            <input 
              type="text" 
              placeholder="Cth: Payment Gateway" 
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={newModule.feature_name}
              onChange={(e) => setNewModule({...newModule, feature_name: e.target.value})}
            />
          </div>
          <div className="md:col-span-4">
            <label className="text-xs text-gray-500 mb-1 block">Sub-Fitur / Detail</label>
            <input 
              type="text" 
              placeholder="Cth: Integrasi Midtrans & Xendit" 
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={newModule.sub_feature}
              onChange={(e) => setNewModule({...newModule, sub_feature: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Kompleksitas</label>
            <select 
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={newModule.complexity}
              onChange={(e) => setNewModule({...newModule, complexity: e.target.value})}
            >
              <option value="Low">Low (Mudah)</option>
              <option value="Medium">Medium (Sedang)</option>
              <option value="High">High (Sulit)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Est. Jam</label>
            <input 
              type="number" 
              placeholder="0" 
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={newModule.estimated_hours}
              onChange={(e) => setNewModule({...newModule, estimated_hours: Number(e.target.value)})}
            />
          </div>
          <div className="md:col-span-1">
            <button 
              onClick={handleAddModule}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded text-sm font-medium transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">Fitur & Modul</th>
                <th className="p-4 font-semibold">Detail Sub-fitur</th>
                <th className="p-4 font-semibold text-center">Kompleksitas</th>
                <th className="p-4 font-semibold text-right">Jam (Hours)</th>
                <th className="p-4 font-semibold text-right">Biaya (Cost)</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {modules.map((module) => (
                <tr key={module.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 font-medium text-gray-800">
                    {module.feature_name}
                  </td>
                  <td className="p-4 text-gray-500">
                    {module.sub_feature || "-"}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${getComplexityColor(module.complexity)}`}>
                      {module.complexity}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-gray-700">
                    {module.estimated_hours} h
                  </td>
                  <td className="p-4 text-right font-mono font-medium text-gray-900">
                    {formatRupiah(module.total_cost)}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(module.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Table Footer Summary */}
              {modules.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 bg-gray-50/50">
                    <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    Belum ada modul. Silakan tambahkan data di atas.
                  </td>
                </tr>
              )}
            </tbody>
            {modules.length > 0 && (
              <tfoot className="bg-gray-50 font-bold text-gray-800 border-t border-gray-200">
                <tr>
                  <td colSpan="3" className="p-4 text-right uppercase text-xs tracking-wider text-gray-500">Total Keseluruhan</td>
                  <td className="p-4 text-right">{calculateTotalHours()} h</td>
                  <td className="p-4 text-right text-blue-700">{formatRupiah(calculateTotalCapex())}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}