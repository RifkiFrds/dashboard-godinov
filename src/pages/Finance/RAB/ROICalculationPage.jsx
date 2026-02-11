import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  HelpCircle, 
  Timer, 
  ArrowUpRight,
  Loader2,
  ArrowLeft,
  Briefcase,
  AlertCircle,
  Save,
  Check
} from "lucide-react";
import api from "../../../api";
import { H2 } from "../../../components/ui/Text";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";

export default function ROICalculationPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // --- State ---
  const [projectInfo, setProjectInfo] = useState({ name: "", client_name: "" });
  const [projectData, setProjectData] = useState({
    capex: 0,
    cashFlows: [] // [{ year: 1, cashIn: 0, cashOutOps: 0 }, ...]
  });
  
  const [discountRate, setDiscountRate] = useState(10); // Default 10%
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

      // Ambil Info Project & Data Analisis dari Controller Agregator
      const [resProject, resAnalysis] = await Promise.all([
        api.get(`/api/projects/${projectId}`),
        api.get(`/api/rab/analysis/${projectId}`)
      ]);

      if (resProject.data.success) {
        setProjectInfo(resProject.data.data);
      }

      if (resAnalysis.data.success) {
        const { j_curve_chart, settings } = resAnalysis.data;

        // 1. Set Discount Rate dari Database (jika ada)
        if (settings?.discount_rate) {
          setDiscountRate(Number(settings.discount_rate));
        }

        // 2. Transform Data API (J-Curve Array) kembali ke struktur Raw Data
        // Backend mengirim: [{year: 'T0', cash_out: X}, {year: 'T1', cash_in: Y, cash_out: Z}, ...]
        
        // Cari T0 untuk CAPEX
        const t0Data = j_curve_chart.find(d => d.year === 'T0');
        const capexValue = t0Data ? Number(t0Data.cash_out) : 0;

        // Cari T1-T3 untuk Cash Flows
        const flows = j_curve_chart
          .filter(d => d.year !== 'T0')
          .map(d => ({
            year: parseInt(d.year.replace('T', '')), // "T1" -> 1
            cashIn: Number(d.cash_in),
            cashOutOps: Number(d.cash_out)
          }));

        setProjectData({
          capex: capexValue,
          cashFlows: flows
        });
      }

    } catch (err) {
      console.error("Error fetching ROI data:", err);
      setError("Gagal memuat data analisis. Pastikan data CAPEX, OPEX, dan Revenue sudah diisi.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Handle Save Analysis ---
  const handleSaveAnalysis = async () => {
    try {
      setIsSaving(true);
      // Kita gunakan endpoint settings yang sudah ada untuk update parsial
      await api.post(`/api/rab/settings/${projectId}`, {
        discount_rate: discountRate
      });
      alert("Parameter analisis berhasil disimpan!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Gagal menyimpan parameter.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Helper Functions ---
  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
  const formatPercent = (num) => `${num.toFixed(1)}%`;

  // --- Core Calculation Logic (Frontend Side) ---
  // Kita kalkulasi ulang di sini agar User bisa main-main dengan Discount Rate tanpa reload page
  const calculation = useMemo(() => {
    let cumulative = -projectData.capex;
    let tableRows = [];
    let totalNPV = -projectData.capex; // NPV diawali dengan pengeluaran T0 (Investasi)
    let paybackPeriod = null;

    // Row T0 (Investasi Awal)
    tableRows.push({
      year: 0,
      label: "T0 (CAPEX)",
      cashOut: projectData.capex,
      cashIn: 0,
      netCashFlow: -projectData.capex,
      cumulative: -projectData.capex
    });

    // Loop T1 - T3
    let prevCumulative = cumulative;

    projectData.cashFlows.forEach((cf) => {
      const netCashFlow = cf.cashIn - cf.cashOutOps;
      
      prevCumulative = cumulative;
      cumulative += netCashFlow;

      // NPV Calculation: NCF / (1 + r)^t
      const presentValue = netCashFlow / Math.pow(1 + (discountRate / 100), cf.year);
      totalNPV += presentValue;

      // Payback Period Logic (Linear Interpolation)
      // Jika kumulatif berubah dari negatif (hutang) ke positif (lunas) di tahun ini
      if (prevCumulative < 0 && cumulative >= 0) {
        // Rumus: Tahun Terakhir Negatif + (Nilai Absolut Sisa Hutang / Net Flow Tahun Ini)
        const fraction = Math.abs(prevCumulative) / (netCashFlow === 0 ? 1 : netCashFlow);
        paybackPeriod = (cf.year - 1) + fraction;
      }

      tableRows.push({
        year: cf.year,
        label: `Tahun ${cf.year}`,
        cashOut: cf.cashOutOps,
        cashIn: cf.cashIn,
        netCashFlow: netCashFlow,
        cumulative: cumulative
      });
    });

    // Final Metrics
    const totalProfit3Years = cumulative; // Saldo akhir
    // ROI = (Net Profit / Investment) * 100
    const roiPercentage = projectData.capex > 0 ? (totalProfit3Years / projectData.capex) * 100 : 0;

    return {
      tableRows,
      roiPercentage,
      totalNPV,
      paybackPeriod,
      totalProfit3Years
    };
  }, [projectData, discountRate]);

  // Interpretasi Warna & Teks untuk NPV
  const getNpvStatus = (val) => {
    if (val > 10000000) return { text: "Sangat Layak (Feasible)", color: "text-emerald-600", bg: "bg-emerald-100" };
    if (val > 0) return { text: "Layak (Marginal)", color: "text-blue-600", bg: "bg-blue-100" };
    return { text: "Tidak Layak / Rugi", color: "text-red-600", bg: "bg-red-100" };
  };

  const npvStatus = getNpvStatus(calculation.totalNPV);

  // --- Rendering UI ---

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Mengkalkulasi Kelayakan Bisnis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 flex flex-col items-center justify-center h-screen">
        <AlertCircle className="mx-auto mb-2" size={32} />
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">Kembali</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 min-h-screen space-y-8 pb-20">
      <Breadcrumbs 
            items={[
              { label: "RAB Center", path: "/rab" },
              { label: "Analisis ROI & NPV", path: "/rab/roi-select" },
              { label: projectInfo.client_name, path: "#"} 
            ]} 
          />

      {/* --- HEADER & SETTINGS --- */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-4">
       
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wide">
                    Financial Analysis
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Briefcase size={12} /> {projectInfo.client_name}
                </span>
            </div>
            <H2>Kalkulasi ROI & NPV</H2>
            <p className="text-gray-500 text-sm mt-1">
              Analisis profitabilitas investasi berdasarkan data CAPEX, OPEX, dan Revenue yang telah diinput.
            </p>
          </div>

        <div className="flex items-center gap-2">
            <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
                <label className="text-xs font-bold uppercase text-gray-500">Discount Rate</label>
                <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden w-20">
                  <input
                      type="number" 
                      value={discountRate}
                      onChange={(e) => setDiscountRate(Number(e.target.value))}
                      className="w-full px-1 py-1 text-sm font-bold text-center outline-none"
                  />
                  <span className="bg-gray-100 px-1 text-xs text-gray-600">%</span>
                </div>
            </div>
          {/*  <button 
                onClick={handleSaveAnalysis}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg shadow-sm disabled:opacity-70 transition-colors"
                title="Simpan Parameter Analisis"
            >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}Simpan Analisis ROI
            </button>*/}
        </div>            
          </div>
      </div>

      {/* --- EXECUTIVE SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: ROI */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">ROI (3 Tahun)</p>
              <h3 className={`text-2xl font-bold mt-1 ${calculation.roiPercentage > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatPercent(calculation.roiPercentage)}
              </h3>
              <p className="text-xs text-gray-400 mt-2">Return on Investment</p>
            </div>
            <div className={`p-2 rounded-lg ${calculation.roiPercentage > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {calculation.roiPercentage > 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </div>
          </div>
        </div>

        {/* Card 2: NPV */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">NPV ({discountRate}%)</p>
              <h3 className={`text-xl font-bold mt-1 ${calculation.totalNPV > 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatRupiah(calculation.totalNPV)}
              </h3>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${npvStatus.bg} ${npvStatus.color}`}>
                {npvStatus.text}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Activity size={24} />
            </div>
          </div>
        </div>

        {/* Card 3: Payback Period */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Payback Period</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {calculation.paybackPeriod ? `${calculation.paybackPeriod.toFixed(1)} Tahun` : "> 3 Tahun"}
              </h3>
              <p className="text-xs text-gray-400 mt-2">
                {calculation.paybackPeriod ? `± ${(calculation.paybackPeriod * 12).toFixed(0)} Bulan` : "Belum balik modal"}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <Timer size={24} />
            </div>
          </div>
        </div>

        {/* Card 4: Net Cash Flow Akhir */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-5 rounded-xl shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Profit Bersih (Kumulatif)</p>
              <h3 className="text-2xl font-bold mt-1 text-white">
                {formatRupiah(calculation.totalProfit3Years)}
              </h3>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                Total Uang Sisa T3 <ArrowUpRight size={12}/>
              </p>
            </div>
            <div className="p-2 rounded-lg bg-white/10 text-white">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Calculator size={18} /> Detail Arus Kas (Cash Flow)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Tahun / Periode</th>
                <th className="px-6 py-4 font-semibold text-right text-red-500">Cash Out (Simulasi Investasi/Biaya)</th>
                <th className="px-6 py-4 font-semibold text-right text-emerald-500">Cash In (Simulasi Pendapatan)</th>
                <th className="px-6 py-4 font-semibold text-right text-blue-600 bg-blue-50/30">Net Cash Flow</th>
                <th className="px-6 py-4 font-semibold text-right text-gray-800 bg-gray-50/50">Cumulative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {calculation.tableRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-red-600">
                    {row.cashOut > 0 ? `(${formatRupiah(row.cashOut)})` : "0"}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-emerald-600 font-medium">
                    {formatRupiah(row.cashIn)}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold bg-blue-50/20 ${row.netCashFlow >= 0 ? 'text-blue-700' : 'text-orange-600'}`}>
                    {formatRupiah(row.netCashFlow)}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold bg-gray-50/30 ${row.cumulative >= 0 ? 'text-emerald-700' : 'text-gray-500'}`}>
                    {formatRupiah(row.cumulative)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- INTERPRETATION SECTION --- */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h4 className="text-blue-800 font-bold mb-3 flex items-center gap-2">
          <Activity size={18} /> Interpretasi Hasil
        </h4>
        <ul className="space-y-2 text-sm text-blue-900/80">
          <li className="flex gap-2">
            <span className="font-bold">• ROI {formatPercent(calculation.roiPercentage)}:</span>
            {calculation.roiPercentage > 20 
              ? "Tingkat pengembalian cukup baik untuk software development." 
              : "Tingkat pengembalian tergolong rendah/moderat. Perlu evaluasi efisiensi biaya atau peningkatan harga."}
          </li>
          <li className="flex gap-2">
            <span className="font-bold">• Payback Period {calculation.paybackPeriod ? calculation.paybackPeriod.toFixed(1) : "?"} Tahun:</span>
             Ini berarti modal awal (CAPEX) baru akan tertutup sepenuhnya pada bulan ke-{calculation.paybackPeriod ? (calculation.paybackPeriod * 12).toFixed(0) : "?"}.
          </li>
          <li className="flex gap-2">
            <span className="font-bold">• NPV {formatRupiah(calculation.totalNPV)}:</span>
            Karena bernilai {calculation.totalNPV > 0 ? "positif" : "negatif"}, proyek ini secara finansial {calculation.totalNPV > 0 ? "layak dijalankan" : "berisiko tinggi"} dengan asumsi tingkat diskonto {discountRate}%.
          </li>
        </ul>
      </div>

    </div>
  );
}