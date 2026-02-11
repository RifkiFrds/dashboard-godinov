import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calculator, 
  Target, 
  Settings2, 
  RefreshCcw,
  TrendingUp,
  AlertTriangle,
  Info,
  ArrowLeft,
  Briefcase,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceDot,
  ReferenceLine
} from "recharts";
import api from "../../../api";
import { H2 } from "../../../components/ui/Text";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";

export default function UniversalBreakEvenPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // --- State Global ---
  const [projectInfo, setProjectInfo] = useState({ name: "", client_name: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State Simulator ---
  const [params, setParams] = useState({
    fixedCost: 0,       // Diambil dari OPEX T1
    avgPrice: 0,        // Diambil dari Revenue T1
    variableCost: 0,    // Default user input
    targetUnit: 100,    // Default user input
    unitName: "Unit"    // Diambil dari Revenue
  });

  const [usePercentageMode, setUsePercentageMode] = useState(true); // Default pakai % agar lebih mudah
  const [vcPercent, setVcPercent] = useState(35); // Asumsi margin COGS 35%

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

      // Ambil Project Info, Analysis (untuk OPEX), dan Revenue (untuk Harga)
      const [resProject, resAnalysis, resRevenue] = await Promise.all([
        api.get(`/api/projects/${projectId}`),
        api.get(`/api/rab/analysis/${projectId}`),
        api.get(`/api/rab/revenue/${projectId}`)
      ]);

      if (resProject.data.success) {
        setProjectInfo(resProject.data.data);
      }

      // Default Values
      let fetchedFixedCost = 0;
      let fetchedPrice = 0;
      let fetchedUnit = "Unit";

      // 1. Ambil Fixed Cost dari OPEX Tahun 1 (Total Cash Out T1 dari J-Curve)
      if (resAnalysis.data.success && resAnalysis.data.j_curve_chart) {
        const t1Data = resAnalysis.data.j_curve_chart.find(d => d.year === 'T1');
        if (t1Data) {
          fetchedFixedCost = Number(t1Data.cash_out); 
        }
      }

      // 2. Ambil Harga & Unit dari Revenue Stream Pertama
      if (resRevenue.data.success && resRevenue.data.data.length > 0) {
        const primaryStream = resRevenue.data.data[0]; // Ambil stream pertama
        fetchedPrice = Number(primaryStream.price_y1);
        fetchedUnit = primaryStream.unit_name;
      }

      // Update State Simulator
      setParams(prev => ({
        ...prev,
        fixedCost: fetchedFixedCost,
        avgPrice: fetchedPrice,
        unitName: fetchedUnit,
        // Set Variable Cost awal berdasarkan persentase default
        variableCost: fetchedPrice * (vcPercent / 100)
      }));

    } catch (err) {
      console.error("Error fetching BEP data:", err);
      setError("Gagal memuat data simulasi.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Helper ---
  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  
  // --- Core Calculation Logic ---
  const calculation = useMemo(() => {
    // 1. Normalisasi Variable Cost (VC)
    let finalVC = params.variableCost;
    if (usePercentageMode) {
      finalVC = params.avgPrice * (vcPercent / 100);
    }

    // 2. Margin Kontribusi (Sisa uang per unit untuk bayar Fixed Cost)
    const contributionMargin = params.avgPrice - finalVC;
    
    // 3. Titik BEP (Unit & Rupiah)
    // Rumus: Fixed Cost / Margin Kontribusi
    const bepUnit = contributionMargin > 0 ? Math.ceil(params.fixedCost / contributionMargin) : 0;
    const bepRevenue = bepUnit * params.avgPrice;

    // 4. Safety Margin
    const safetyMarginUnit = params.targetUnit - bepUnit;
    const isSafe = safetyMarginUnit >= 0;

    // 5. Generate Data Grafik (Range: 0 s/d Max(Target, BEP) * 1.5)
    const chartData = [];
    const maxRange = Math.max(bepUnit, params.targetUnit) * 1.2 || 100;
    const step = Math.ceil(maxRange / 10); // Buat 10 titik sampel

    for (let i = 0; i <= maxRange; i += step) {
      const units = i; 
      const totalFixedCost = params.fixedCost;
      const totalVariableCost = units * finalVC;
      const totalCost = totalFixedCost + totalVariableCost;
      const totalRevenue = units * params.avgPrice;

      chartData.push({
        units,
        fixedCost: totalFixedCost,
        totalCost: totalCost,
        revenue: totalRevenue,
      });
    }

    // Sisipkan titik BEP persis agar grafik akurat
    if (bepUnit > 0 && bepUnit < maxRange) {
        chartData.push({
            units: bepUnit,
            fixedCost: params.fixedCost,
            totalCost: bepRevenue,
            revenue: bepRevenue,
            isBep: true
        });
        // Sort ulang agar garis tidak berantakan
        chartData.sort((a, b) => a.units - b.units);
    }

    return {
      finalVC,
      contributionMargin,
      bepUnit,
      bepRevenue,
      chartData,
      isSafe,
      safetyMarginUnit
    };
  }, [params, usePercentageMode, vcPercent]);


  // --- Handlers ---
  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Menyiapkan Simulator BEP...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 min-h-screen space-y-6">
      <Breadcrumbs 
            items={[
              { label: "RAB Center", path: "/rab" },
              { label: "Break Even Point", path: "/rab/break-select" },
              { label: projectInfo.client_name, path: "#"} 
            ]} 
          />

      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-4">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wide">
                    Simulation Tool
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Briefcase size={12} /> {projectInfo.client_name}
                </span>
            </div>
            <H2>Analisis Break-Even Point (BEP)</H2>
            <p className="text-gray-500 text-sm mt-1">
              Simulasi titik impas berdasarkan data Fixed Cost (OPEX) dan struktur harga yang telah diinput.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- LEFT PANEL: CONFIGURATOR --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Definisi Model Bisnis */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Settings2 size={16} /> Parameter Biaya
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Satuan Penjualan</label>
                <input 
                  type="text" 
                  value={params.unitName}
                  onChange={(e) => handleParamChange("unitName", e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                    Fixed Cost (Setahun)
                    <span className="ml-1 text-[10px] font-normal normal-case text-gray-400">(Estimasi dari OPEX Tahun ke-1)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 text-xs">Rp</span>
                  <input 
                    disabled
                    type="number" 
                    value={params.fixedCost}
                    onChange={(e) => handleParamChange("fixedCost", Number(e.target.value))}
                    className="cursor-not-allowed w-full pl-8 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Unit Economics */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Calculator size={16} /> Ekonomi per Unit
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Harga Jual / {params.unitName}</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 text-xs">Rp</span>
                  <input 
                    type="number" 
                    value={params.avgPrice}
                    onChange={(e) => handleParamChange("avgPrice", Number(e.target.value))}
                    className="w-full pl-8 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Variable Cost</label>
                  <button 
                    onClick={() => setUsePercentageMode(!usePercentageMode)}
                    className="text-[10px] bg-white border border-gray-300 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-gray-100"
                  >
                    <RefreshCcw size={10} /> {usePercentageMode ? "% Margin" : "Rupiah"}
                  </button>
                </div>
                
                {usePercentageMode ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={vcPercent}
                      onChange={(e) => setVcPercent(Number(e.target.value))}
                      className="w-16 p-1.5 text-sm border border-gray-300 rounded text-right outline-none"
                    />
                    <span className="text-sm font-bold text-gray-600">% dari Harga</span>
                  </div>
                ) : (
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 text-xs">Rp</span>
                    <input 
                      type="number" 
                      value={params.variableCost}
                      onChange={(e) => handleParamChange("variableCost", Number(e.target.value))}
                      className="w-full pl-8 p-2 text-sm border border-gray-300 rounded outline-none"
                    />
                  </div>
                )}
                <p className="text-[10px] text-gray-400 mt-2 italic">
                  Biaya modal/pokok per {params.unitName} (COGS, Bahan, Komisi). 
                  <br/>Total VC: {formatRupiah(calculation.finalVC)} / unit.
                </p>
              </div>

               <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Target Penjualan (Simulasi)</label>
                <input 
                  type="number" 
                  value={params.targetUnit}
                  onChange={(e) => handleParamChange("targetUnit", Number(e.target.value))}
                  className="w-full p-2 text-sm border border-blue-300 bg-blue-50 rounded text-blue-800 font-bold outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* --- RIGHT PANEL: VISUALIZATION --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-5 rounded-xl border border-l-4 shadow-sm ${calculation.isSafe ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
              <p className="text-xs font-bold uppercase tracking-wider opacity-70">BEP (Unit)</p>
              <h3 className={`text-3xl font-bold mt-1 ${calculation.isSafe ? 'text-emerald-700' : 'text-red-700'}`}>
                {calculation.bepUnit.toLocaleString()} <span className="text-sm font-medium">{params.unitName}</span>
              </h3>
              <p className="text-xs mt-2 opacity-80">
                Unit minimal yang harus terjual agar balik modal.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">BEP (Revenue)</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {formatRupiah(calculation.bepRevenue)}
              </h3>
              <p className="text-xs text-gray-400 mt-2">
                Omzet minimal untuk menutupi Fixed Cost.
              </p>
            </div>
          </div>

          {/* 2. The Universal BEP Chart */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-[450px]">
            <h4 className="font-bold text-gray-700 mb-4 flex justify-between items-center">
              <span>Grafik Analisis</span>
              <span className="text-xs font-normal bg-gray-100 px-2 py-1 rounded text-gray-500">
                X: {params.unitName} | Y: Rupiah
              </span>
            </h4>
            
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={calculation.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="units" 
                  type="number" 
                  domain={['dataMin', 'dataMax']} 
                  tick={{ fontSize: 12 }}
                />
                
                <YAxis 
                  tickFormatter={(val) => new Intl.NumberFormat('id', {notation: 'compact'}).format(val)} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => formatRupiah(value)}
                  labelFormatter={(value) => `${value} ${params.unitName}`}
                  contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', border: 'none' }}
                />
                <Legend verticalAlign="top" height={36} />
                
                <Line 
                  type="monotone" 
                  dataKey="fixedCost" 
                  stroke="#94a3b8" 
                  strokeDasharray="5 5" 
                  name="Fixed Cost" 
                  dot={false} 
                  strokeWidth={2}
                />

                <Line 
                  type="monotone" 
                  dataKey="totalCost" 
                  stroke="#ef4444" 
                  name="Total Cost" 
                  dot={false} 
                  strokeWidth={2} 
                />

                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  name="Revenue" 
                  dot={false} 
                  strokeWidth={2} 
                />

                <ReferenceDot 
                  x={calculation.bepUnit} 
                  y={calculation.bepRevenue} 
                  r={6} 
                  fill="#f59e0b" 
                  stroke="#fff"
                  strokeWidth={2} 
                />
                
                <ReferenceLine 
                    x={calculation.bepUnit} 
                    stroke="#f59e0b" 
                    strokeDasharray="3 3" 
                    label={{ position: 'top',  value: 'BEP', fill: '#f59e0b', fontSize: 12 }} 
                />

              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 3. Interpretation & Margin */}
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex flex-col sm:flex-row gap-6 items-center">
             <div className="flex-1">
               <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                 <Info size={18} /> Interpretasi Data
               </h4>
               <p className="text-sm text-blue-900 leading-relaxed">
                 Dengan biaya tetap setahun sebesar <strong>{formatRupiah(params.fixedCost)}</strong>, Anda perlu menjual minimal <strong>{calculation.bepUnit} {params.unitName}</strong> untuk mencapai titik impas.
               </p>
               <p className="text-sm text-blue-900 leading-relaxed mt-2">
                 Setiap 1 {params.unitName} yang terjual di atas BEP akan memberikan profit murni sebesar <strong>{formatRupiah(calculation.contributionMargin)}</strong>.
               </p>
             </div>
             
             <div className="shrink-0 text-center bg-white p-4 rounded-lg shadow-sm border border-blue-100 min-w-[150px]">
                <p className="text-xs text-gray-500 font-bold uppercase">Status Target</p>
                {calculation.isSafe ? (
                  <>
                    <TrendingUp className="mx-auto text-emerald-500 mb-1 mt-2" size={24} />
                    <span className="text-emerald-600 font-bold text-sm">Profit Zone</span>
                    <p className="text-[10px] text-gray-400 mt-1">+{calculation.safetyMarginUnit} unit aman</p>
                  </>
                ) : (
                   <>
                    <AlertTriangle className="mx-auto text-red-500 mb-1 mt-2" size={24} />
                    <span className="text-red-600 font-bold text-sm">Loss Zone</span>
                    <p className="text-[10px] text-gray-400 mt-1">Kurang {Math.abs(calculation.safetyMarginUnit)} unit</p>
                  </>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}