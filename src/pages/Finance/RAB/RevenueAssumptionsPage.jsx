import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Users, 
  Repeat, 
  CalendarDays, 
  Coins, 
  ArrowRight, 
  RefreshCw, 
  Calculator,
  Save,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Trash2,
  Plus
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from "recharts";
import api from "../../../api";
import { H2 } from "../../../components/ui/Text";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";

// --- Default Simulation Data ---
const initialYears = [
  { year: 1, volume: 100, price: 50000 },
  { year: 2, volume: 150, price: 55000 },
  { year: 3, volume: 200, price: 60000 },
];

export default function UniversalRevenuePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // --- 1. Global State ---
  const [projectInfo, setProjectInfo] = useState({ name: "", client_name: "" });
  const [savedStreams, setSavedStreams] = useState([]); // Data dari API
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // --- 2. Simulation Form State ---
  const [streamName, setStreamName] = useState(""); // Nama Revenue (misal: "Langganan Basic")
  const [unitName, setUnitName] = useState("User"); 
  const [frequency, setFrequency] = useState("monthly");
  const [yearData, setYearData] = useState(initialYears);
  const [growthRate, setGrowthRate] = useState(20);

  // --- Helper ---
  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  const formatCompact = (num) => new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(num);

  // --- Calculation Logic ---
  const multiplier = frequency === "monthly" ? 12 : 1;

  const calculateAnnualRevenue = (vol, price) => {
    return vol * price * multiplier;
  };

  // Hitung total dari DATABASE (bukan simulasi)
  const calculateTotalSavedRevenue = () => {
    let total = 0;
    savedStreams.forEach(stream => {
      const mult = stream.frequency === 'monthly' ? 12 : 1;
      total += (Number(stream.volume_y1) * Number(stream.price_y1) * mult);
      total += (Number(stream.volume_y2) * Number(stream.price_y2) * mult);
      total += (Number(stream.volume_y3) * Number(stream.price_y3) * mult);
    });
    return total;
  };

  // --- 3. Fetch Data ---
  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [resProject, resRevenue] = await Promise.all([
        api.get(`/api/projects/${projectId}`),
        api.get(`/api/rab/revenue/${projectId}`)
      ]);

      if (resProject.data.success) setProjectInfo(resProject.data.data);
      if (resRevenue.data.success) setSavedStreams(resRevenue.data.data || []);

    } catch (err) {
      console.error("Error loading data:", err);
      setError("Gagal memuat data pendapatan.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. Handle Save Simulation ---
  const handleSaveStream = async () => {
    if (!streamName) {
      alert("Mohon isi Nama Pendapatan (misal: Penjualan Tiket)");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        name: streamName,
        unit_name: unitName,
        frequency: frequency,
        // Mapping Simulation Data -> DB Columns
        volume_y1: yearData[0].volume,
        price_y1: yearData[0].price,
        volume_y2: yearData[1].volume,
        price_y2: yearData[1].price,
        volume_y3: yearData[2].volume,
        price_y3: yearData[2].price,
      };

      const response = await api.post(`/api/rab/revenue/${projectId}`, payload);

      if (response.data.success) {
        fetchData(); // Refresh list saved streams
        setStreamName(""); // Reset nama saja, biarkan angka simulasi tetap ada jika user mau edit dikit
        alert("Data pendapatan berhasil disimpan!");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Gagal menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 5. Handle Delete ---
  const handleDelete = async (id) => {
    if(!window.confirm("Hapus data pendapatan ini?")) return;
    try {
      await api.delete(`/api/rab/revenue/${id}`);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus.");
    }
  };

  // --- Simulation Handlers ---
  const handleInputChange = (index, field, value) => {
    const newData = [...yearData];
    newData[index][field] = Number(value);
    setYearData(newData);
  };

  const applyGrowthProjection = () => {
    const baseVol = yearData[0].volume;
    const basePrice = yearData[0].price;
    const newData = [
      yearData[0],
      { 
        year: 2, 
        volume: Math.ceil(baseVol * (1 + growthRate / 100)), 
        price: Math.ceil(basePrice * (1 + (growthRate/2) / 100)) 
      },
      { 
        year: 3, 
        volume: Math.ceil(baseVol * Math.pow(1 + growthRate / 100, 2)), 
        price: Math.ceil(basePrice * Math.pow(1 + (growthRate/2) / 100, 2)) 
      }
    ];
    setYearData(newData);
  };

  // Data for Chart (Simulation)
  const chartData = yearData.map(d => ({
    name: `Tahun ${d.year}`,
    revenue: calculateAnnualRevenue(d.volume, d.price),
    volume: d.volume
  }));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Memuat Data Pendapatan...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 min-h-screen space-y-6">
      <Breadcrumbs 
            items={[
              { label: "RAB Center", path: "/rab" },
              { label: "Pilih Proyek untuk Simulasi Revenue", path: "/rab/roi-select" },
              { label: projectInfo.client_name, path: "#"} 
            ]} 
          />

      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-4">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                Revenue Stream
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Briefcase size={12} /> {projectInfo.client_name}
              </span>
            </div>
            <H2>{projectInfo.name}</H2>
            <p className="text-gray-500 text-sm mt-1">
              Simulasi dan input sumber pendapatan proyek (Recurring atau One-time).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- LEFT PANEL: CONFIGURATION --- */}
        <div className="space-y-6">
          
          {/* 1. Global Settings */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
            <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                Simulator Mode
            </div>
            <h3 className="text-sm font-bold text-gray-800 uppercase mb-4 flex items-center gap-2">
              <Calculator size={16} /> Parameter Simulasi
            </h3>

            <div className="space-y-4">
              {/* Stream Name */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Pendapatan</label>
                <input 
                  type="text" 
                  value={streamName}
                  onChange={(e) => setStreamName(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Cth: Langganan Basic / Penjualan Tiket"
                />
              </div>

              {/* Unit Name Input */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Satuan (Unit)</label>
                <input 
                  type="text" 
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Cth: User, Proyek, Barang"
                />
              </div>

              {/* Frequency Toggle */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Frekuensi Pendapatan</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setFrequency("monthly")}
                    className={`p-2 rounded-lg text-xs font-bold border transition-all flex flex-col items-center gap-1 ${frequency === "monthly" ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white border-gray-200 text-gray-500"}`}
                  >
                    <Repeat size={16} />
                    Bulanan (x12)
                    <span className="text-[9px] font-normal opacity-70">Langganan/SaaS/Gaji</span>
                  </button>
                  <button 
                    onClick={() => setFrequency("yearly")}
                    className={`p-2 rounded-lg text-xs font-bold border transition-all flex flex-col items-center gap-1 ${frequency === "yearly" ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white border-gray-200 text-gray-500"}`}
                  >
                    <CalendarDays size={16} />
                    Tahunan / Putus (x1)
                    <span className="text-[9px] font-normal opacity-70">Proyek/E-commerce</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Total Summary Card (REAL DATA) */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-6 text-white shadow-lg">
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Total Cash In (Saved)</p>
            <h3 className="text-3xl font-bold">{formatCompact(calculateTotalSavedRevenue())}</h3>
            <p className="text-xs text-emerald-100 mt-2 opacity-80">
              Total kumulatif 3 tahun dari {savedStreams.length} stream yang tersimpan.
            </p>
          </div>

          {/* 3. Auto-Growth Tool */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-gray-600 uppercase">Auto-Projection Tool</h4>
              <span className="text-xs bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-500">{growthRate}% Growth</span>
            </div>
            <p className="text-[10px] text-gray-400 mb-3">
              Isi data Tahun 1 saja, lalu tekan tombol ini untuk otomatis mengisi T2 & T3.
            </p>
            <input 
              type="range" min="5" max="100" step="5"
              value={growthRate} onChange={(e) => setGrowthRate(Number(e.target.value))}
              className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer mb-3"
            />
            <button 
              onClick={applyGrowthProjection}
              className="w-full py-2 bg-white border border-gray-300 hover:border-emerald-400 text-emerald-700 text-xs font-bold rounded shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw size={12} /> Terapkan Proyeksi {growthRate}%
            </button>
          </div>

        </div>

        {/* --- RIGHT PANEL: YEARLY INPUTS & CHART --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Input Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {yearData.map((data, index) => {
              const annualRev = calculateAnnualRevenue(data.volume, data.price);
              const prevRev = index > 0 ? calculateAnnualRevenue(yearData[index-1].volume, yearData[index-1].price) : 0;
              const growth = prevRev > 0 ? ((annualRev - prevRev) / prevRev) * 100 : 0;

              return (
                <div key={data.year} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                    <span className="font-bold text-gray-800">Tahun {data.year}</span>
                    {index > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {growth > 0 ? '+' : ''}{growth.toFixed(0)}%
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {/* Volume Input */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1 mb-1">
                        <Users size={10} /> Volume ({unitName})
                      </label>
                      <input 
                        type="number" 
                        value={data.volume}
                        onChange={(e) => handleInputChange(index, 'volume', e.target.value)}
                        className="w-full p-1.5 text-sm border border-gray-300 rounded focus:border-emerald-500 outline-none font-semibold text-gray-700"
                      />
                    </div>

                    {/* Price Input */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1 mb-1">
                        <Coins size={10} /> Harga / {unitName}
                      </label>
                      <input 
                        type="number" 
                        value={data.price}
                        onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                        className="w-full p-1.5 text-sm border border-gray-300 rounded focus:border-emerald-500 outline-none"
                      />
                    </div>

                    {/* Annual Result (Read-only) */}
                    <div className="pt-2 mt-2 border-t border-dashed border-gray-200">
                      <p className="text-[10px] text-gray-400 text-right mb-0.5">
                        Total / Tahun {frequency === 'monthly' ? '(x12)' : '(x1)'}
                      </p>
                      <p className="text-sm font-bold text-emerald-600 text-right truncate">
                        {formatCompact(annualRev)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Visual Chart (SIMULATION PREVIEW) */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
             <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-2">
                 <TrendingUp className="text-emerald-600" size={20} />
                 <h3 className="font-bold text-gray-700">Preview Grafik Simulasi</h3>
               </div>
               <button 
                 onClick={handleSaveStream}
                 disabled={isSubmitting}
                 className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isSubmitting ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />}
                 Simpan Stream
               </button>
             </div>

             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={formatCompact} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => formatRupiah(value)}
                      cursor={{ fill: '#f0fdf4' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={50}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 2 ? '#059669' : '#34d399'} />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <p className="text-center text-xs text-gray-400 mt-2">
               *Grafik ini menampilkan data dari form input di atas (Belum disimpan).
             </p>
          </div>

          {/* 3. LIST OF SAVED STREAMS */}
          {savedStreams.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700 text-sm">Rincian Pendapatan Tersimpan</h3>
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">{savedStreams.length} Items</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-5 py-3">Nama Stream</th>
                                <th className="px-5 py-3 text-right">Total T1</th>
                                <th className="px-5 py-3 text-right">Total T2</th>
                                <th className="px-5 py-3 text-right">Total T3</th>
                                <th className="px-5 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {savedStreams.map((item) => {
                                const mult = item.frequency === 'monthly' ? 12 : 1;
                                const t1 = Number(item.volume_y1) * Number(item.price_y1) * mult;
                                const t2 = Number(item.volume_y2) * Number(item.price_y2) * mult;
                                const t3 = Number(item.volume_y3) * Number(item.price_y3) * mult;

                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3">
                                            <div className="font-bold text-gray-800">{item.name}</div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                                                {item.frequency === 'monthly' ? 'Bulanan' : 'Tahunan'} • {item.unit_name}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right font-mono text-gray-600">{formatCompact(t1)}</td>
                                        <td className="px-5 py-3 text-right font-mono text-gray-600">{formatCompact(t2)}</td>
                                        <td className="px-5 py-3 text-right font-mono text-gray-600">{formatCompact(t3)}</td>
                                        <td className="px-5 py-3 text-center">
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}