import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Trash2, 
  Server, 
  FileText, 
  TrendingUp, 
  CalendarRange, 
  AlertCircle,
  Loader2,
  ArrowLeft,
  Briefcase
} from "lucide-react";
import api from "../../../api";
import { H2 } from "../../../components/ui/Text";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";

export default function OpexComponentsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // --- State ---
  const [opexItems, setOpexItems] = useState([]);
  const [projectInfo, setProjectInfo] = useState({ name: "", client_name: "" });
  
  // Form State (Sesuai nama kolom DB)
  const [newItem, setNewItem] = useState({
    component_name: "",
    source_reference: "",
    monthly_cost_y1: "",
    monthly_cost_y2: "",
    monthly_cost_y3: ""
  });

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // --- 1. Fetch Data ---
  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Panggil API Project Info & OPEX Items
      const [resProject, resOpex] = await Promise.all([
        api.get(`/api/projects/${projectId}`),
        api.get(`/api/rab/opex/${projectId}`)
      ]);

      if (resProject.data.success) {
        setProjectInfo(resProject.data.data);
      }

      if (resOpex.data.success) {
        // Backend mengembalikan { summary: {...}, data: [...] }
        setOpexItems(resOpex.data.data || []);
      }

    } catch (err) {
      console.error("Error fetching OPEX data:", err);
      setError("Gagal memuat data operasional. Pastikan server berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Add Item ---
  const handleAddItem = async () => {
    if (!newItem.component_name || !newItem.monthly_cost_y1) {
      alert("Nama Komponen dan Biaya Tahun 1 wajib diisi.");
      return;
    }
    
    try {
      setIsSubmitting(true);

      // Logic Auto-Fill: Jika Y2/Y3 kosong, gunakan nilai Y1 (Asumsi Flat)
      const costY1 = Number(newItem.monthly_cost_y1);
      const costY2 = newItem.monthly_cost_y2 ? Number(newItem.monthly_cost_y2) : costY1;
      const costY3 = newItem.monthly_cost_y3 ? Number(newItem.monthly_cost_y3) : costY2;

      const payload = {
        component_name: newItem.component_name,
        source_reference: newItem.source_reference || "-",
        monthly_cost_y1: costY1,
        monthly_cost_y2: costY2,
        monthly_cost_y3: costY3
      };

      const response = await api.post(`/api/rab/opex/${projectId}`, payload);

      if (response.data.success) {
        fetchData(); // Refresh data
        // Reset form
        setNewItem({ 
          component_name: "", 
          source_reference: "", 
          monthly_cost_y1: "", 
          monthly_cost_y2: "", 
          monthly_cost_y3: "" 
        });
      }

    } catch (err) {
      console.error("Gagal menyimpan OPEX:", err);
      alert("Gagal menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. Delete Item ---
  const handleDelete = async (id) => {
    if(!window.confirm("Hapus komponen biaya ini?")) return;

    try {
      // Optimistic Update
      const prevItems = [...opexItems];
      setOpexItems(opexItems.filter(item => item.id !== id));

      await api.delete(`/api/rab/opex/${id}`);

    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus data.");
      fetchData(); // Rollback
    }
  };

  // --- Helper Functions ---
  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  // Hitung Total Tahunan (Monthly * 12)
  const calculateAnnualTotal = (key) => {
    return opexItems.reduce((acc, curr) => acc + (Number(curr[key] || 0) * 12), 0);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Memuat Data Operasional...</p>
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
              { label: "Pilih Proyek untuk OPEX", path: "/rab/opex-select" },
              { label: projectInfo.client_name, path: "#"} 
            ]} 
          />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wide">
                Editing OPEX
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Briefcase size={12} /> {projectInfo.client_name || "Client"}
              </span>
            </div>
            <H2>{projectInfo.name}</H2>
            <p className="text-gray-500 text-sm mt-1">
              Input komponen biaya rutin bulanan. Sistem akan menghitung total tahunan secara otomatis.
            </p>
          </div>
        </div>
      </div>

      {/* --- SUMMARY CARDS (YEARLY PROJECTION) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tahun 1 */}
        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <CalendarRange size={60} className="text-blue-600" />
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total OPEX Tahun 1</p>
          <h3 className="text-2xl font-bold text-blue-700 mt-1">
            {formatRupiah(calculateAnnualTotal('monthly_cost_y1'))}
          </h3>
          <p className="text-xs text-blue-400 mt-2">Cash Out Rutin</p>
        </div>

        {/* Tahun 2 */}
        <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={60} className="text-indigo-600" />
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total OPEX Tahun 2</p>
          <h3 className="text-2xl font-bold text-indigo-700 mt-1">
            {formatRupiah(calculateAnnualTotal('monthly_cost_y2'))}
          </h3>
          <p className="text-xs text-indigo-400 mt-2">
            vs T1: {calculateAnnualTotal('monthly_cost_y1') > 0 ? (((calculateAnnualTotal('monthly_cost_y2') - calculateAnnualTotal('monthly_cost_y1')) / calculateAnnualTotal('monthly_cost_y1')) * 100).toFixed(1) : 0}%
          </p>
        </div>

        {/* Tahun 3 */}
        <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={60} className="text-purple-600" />
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total OPEX Tahun 3</p>
          <h3 className="text-2xl font-bold text-purple-700 mt-1">
            {formatRupiah(calculateAnnualTotal('monthly_cost_y3'))}
          </h3>
          <p className="text-xs text-purple-400 mt-2">
            vs T2: {calculateAnnualTotal('monthly_cost_y2') > 0 ? (((calculateAnnualTotal('monthly_cost_y3') - calculateAnnualTotal('monthly_cost_y2')) / calculateAnnualTotal('monthly_cost_y2')) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* --- INPUT FORM --- */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
        <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Plus size={16} /> Tambah Komponen Biaya
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Komponen & Sumber */}
          <div className="md:col-span-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Nama Komponen</label>
              <div className="relative">
                <Server className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cth: Sewa Server" 
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newItem.component_name}
                  onChange={(e) => setNewItem({...newItem, component_name: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Sumber Dokumen / Ref</label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cth: AWS Pricing Page" 
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newItem.source_reference}
                  onChange={(e) => setNewItem({...newItem, source_reference: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Input Biaya 3 Tahun */}
          <div className="md:col-span-6 grid grid-cols-3 gap-3 bg-white p-3 rounded border border-gray-200">
            <div>
              <label className="text-xs font-bold text-blue-600 mb-1 block">Biaya Bulan T1</label>
              <input 
                type="number" 
                placeholder="Rp 0" 
                className="w-full p-2 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                value={newItem.monthly_cost_y1}
                onChange={(e) => setNewItem({...newItem, monthly_cost_y1: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-indigo-600 mb-1 block">Biaya Bulan T2</label>
              <input 
                type="number" 
                placeholder="Rp 0" 
                className="w-full p-2 text-sm border border-gray-300 rounded focus:border-indigo-500 outline-none"
                value={newItem.monthly_cost_y2}
                onChange={(e) => setNewItem({...newItem, monthly_cost_y2: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-purple-600 mb-1 block">Biaya Bulan T3</label>
              <input 
                type="number" 
                placeholder="Rp 0" 
                className="w-full p-2 text-sm border border-gray-300 rounded focus:border-purple-500 outline-none"
                value={newItem.monthly_cost_y3}
                onChange={(e) => setNewItem({...newItem, monthly_cost_y3: e.target.value})}
              />
            </div>
            <div className="col-span-3 text-[10px] text-gray-400 text-center italic mt-1">
              *Jika T2 & T3 kosong, otomatis mengikuti nilai T1.
            </div>
          </div>

          {/* Action Button */}
          <div className="md:col-span-2">
            <button 
              onClick={handleAddItem}
              disabled={isSubmitting}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Tambah</>}
            </button>
          </div>
        </div>
      </div>

      {/* --- TABLE DETAIL --- */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold w-1/3">Komponen & Referensi</th>
                <th className="p-4 font-semibold text-right text-blue-700 bg-blue-50/50">Biaya/Bln (T1)</th>
                <th className="p-4 font-semibold text-right text-indigo-700 bg-indigo-50/50">Biaya/Bln (T2)</th>
                <th className="p-4 font-semibold text-right text-purple-700 bg-purple-50/50">Biaya/Bln (T3)</th>
                <th className="p-4 font-semibold text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {opexItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{item.component_name}</div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <FileText size={10} /> {item.source_reference}
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-gray-700 bg-blue-50/10 group-hover:bg-blue-50/30">
                    {formatRupiah(item.monthly_cost_y1)}
                  </td>
                  <td className="p-4 text-right font-mono text-gray-700 bg-indigo-50/10 group-hover:bg-indigo-50/30">
                    {formatRupiah(item.monthly_cost_y2)}
                  </td>
                  <td className="p-4 text-right font-mono text-gray-700 bg-purple-50/10 group-hover:bg-purple-50/30">
                    {formatRupiah(item.monthly_cost_y3)}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {opexItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    Belum ada data biaya operasional.
                  </td>
                </tr>
              )}
            </tbody>
            
            {/* Table Footer (Total Monthly Cost) */}
            {opexItems.length > 0 && (
              <tfoot className="bg-gray-50 font-bold text-gray-800 border-t border-gray-200">
                <tr>
                  <td className="p-4 text-right text-xs uppercase tracking-wider text-gray-500">Total Biaya per Bulan</td>
                  <td className="p-4 text-right text-blue-700">
                    {formatRupiah(opexItems.reduce((a, b) => a + Number(b.monthly_cost_y1), 0))}
                  </td>
                  <td className="p-4 text-right text-indigo-700">
                    {formatRupiah(opexItems.reduce((a, b) => a + Number(b.monthly_cost_y2), 0))}
                  </td>
                  <td className="p-4 text-right text-purple-700">
                    {formatRupiah(opexItems.reduce((a, b) => a + Number(b.monthly_cost_y3), 0))}
                  </td>
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