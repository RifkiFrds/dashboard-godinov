import React, { useEffect, useState, useRef } from "react";
import { 
  PieChart, 
  Wallet, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  AlertCircle, 
  Briefcase, 
  Hash, 
  Calendar, 
  User,
  Loader2
} from "lucide-react";
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  ReferenceLine 
} from "recharts";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { H2 } from "../../../components/ui/Text";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import api from "../../../api";

export default function RABDashboardPage() {
  const { projectId } = useParams();
  const componentRef = useRef(null);
  const navigate = useNavigate();

  // --- State ---
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Project Header Info
  const [projectInfo, setProjectInfo] = useState({
    name: "",
    client_name: "",
    project_code: "",
    deadline: "",
    status: ""
  });

  // 2. Metrics Cards (ROI, NPV, etc)
  const [summaryMetrics, setSummaryMetrics] = useState({
    total_capex: 0,
    total_revenue_3y: 0,
    net_profit_3y: 0,
    roi: 0,
    payback_period: 0,
    viability_score: 0 
  });

  // 3. Chart Data
  const [cashFlowData, setCashFlowData] = useState([]); // Chart 1: J-Curve
  const [financeStructureData, setFinanceStructureData] = useState([]); // Chart 2: Area

  // --- Helper Formatter ---
  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
  
  const formatCompact = (num) => {
    return new Intl.NumberFormat('id-ID', {
      notation: "compact",
      compactDisplay: "short",
      style: "currency",
      currency: "IDR"
    }).format(num);
  };

  // --- Fetch Data ---
  useEffect(() => {
    if (projectId) {
      fetchDashboardData();
    }
  }, [projectId]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Panggil 2 API: Detail Project & Analysis Data
      const [resProject, resAnalysis] = await Promise.all([
        api.get(`/api/projects/${projectId}`),
        api.get(`/api/rab/analysis/${projectId}`)
      ]);

      // 1. Set Project Info
      if (resProject.data.success) {
        setProjectInfo(resProject.data.data);
      }

      // 2. Set Analysis Data
      if (resAnalysis.data.success) {
        const { metrics, j_curve_chart } = resAnalysis.data;
        
        // A. Hitung Metrics Tambahan
        const roiVal = Number(metrics.total_capex) > 0 
            ? ((Number(metrics.net_profit_3y) / Number(metrics.total_capex)) * 100) 
            : 0;

        setSummaryMetrics({
            ...metrics,
            net_profit_3y: Number(metrics.net_profit_3y || 0), 
            total_capex: Number(metrics.total_capex || 0),
            roi: roiVal,
        });
        
        // B. Set Data Chart 1 (J-Curve)
        setCashFlowData(j_curve_chart);

        // C. Transform Data untuk Chart 2 (Structure: Revenue vs Opex)
        const structData = j_curve_chart
            .filter(d => d.year !== 'T0')
            .map(d => ({
                year: d.year,
                revenue: d.cash_in,
                opex: d.cash_out,
                profit: d.net_flow
            }));
        setFinanceStructureData(structData);
      }

    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Laporan_RAB_${projectInfo.project_code || 'Project'}`,
    pageStyle: `
      @page { 
        size: A4 portrait; 
        margin: 20mm 15mm; 
      }
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        html, body { 
          height: initial !important; 
          overflow: initial !important; 
        }
        .no-print { 
          display: none !important; 
        }
        .page-break { 
          page-break-before: always !important;
        }
      }
    `,
  });

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Menyiapkan Dashboard Eksekutif...</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 min-h-screen space-y-6">
      
        <Breadcrumbs 
            items={[
              { label: "RAB Center", path: "/rab" },
              { label: "Metrics Summary", path: "/rab/dashboard-select" },
              { label: projectInfo.client_name, path: "#"} 
            ]} 
          />
      {/* --- HEADER SCREEN ONLY --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4 gap-4 no-print">
        <div>
          <H2>Dashboard Eksekutif</H2>
          <p className="text-gray-500 text-sm mt-1">
            Visualisasi performa investasi dan proyeksi keuntungan sistem.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
          >
            Cetak Laporan PDF
          </button>
        </div>
      </div>

      {/* SCREEN VIEW - CARDS */}
      <div className="no-print space-y-6">
        {/* Project Info Panel */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Proyek</p>
              <h3 className="text-sm font-bold text-gray-700">{projectInfo.name || "-"}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Klien</p>
              <h3 className="text-sm font-semibold text-gray-700">{projectInfo.client_name || "-"}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Hash size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kode</p>
              <h3 className="text-sm font-mono font-bold text-gray-700">{projectInfo.project_code || "-"}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deadline</p>
              <h3 className="text-sm font-semibold text-gray-700">
                {projectInfo.deadline ? new Date(projectInfo.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
              </h3>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Profit (3Y)</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {formatCompact(summaryMetrics.net_profit_3y || 0)}
                  </h3>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className={`mt-4 flex items-center text-xs font-medium ${summaryMetrics.roi > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
               <ArrowUpRight size={14} className="mr-1" />
               ROI {summaryMetrics.roi.toFixed(1)}%
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Investasi Awal (CAPEX)</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCompact(summaryMetrics.total_capex)}</h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Wallet size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-400">
               Dibayar lunas di T0
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Payback Period</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {typeof summaryMetrics.payback_period === 'number' 
                      ? `${summaryMetrics.payback_period.toFixed(1)} Thn` 
                      : "> 3 Tahun"}
                </h3>
              </div>
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Activity size={20} />
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-5 rounded-xl shadow-md flex items-center justify-between relative overflow-hidden">
            <div className="z-10">
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Health Score</p>
              <h3 className="text-4xl font-bold mt-1">{summaryMetrics.viability_score}<span className="text-lg opacity-60">/100</span></h3>
              <p className="text-xs text-indigo-200 mt-1">
                {summaryMetrics.viability_score > 70 
                  ? "Sangat Layak" 
                  : summaryMetrics.viability_score >= 55 
                  ? "Cukup Layak" 
                  : "Tidak Layak"}
              </p>
            </div>
            <div className="z-10 h-16 w-16 rounded-full border-4 border-indigo-400/30 flex items-center justify-center">
              <PieChart size={32} />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Arus Kas (J-Curve)</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" style={{ fontSize: '10px' }} />
                  <YAxis tickFormatter={formatCompact} width={40} style={{ fontSize: '10px' }} />
                  <Legend />
                  <Bar dataKey="net_flow" name="Net Flow" fill="#3b82f6" />
                  <Line type="monotone" dataKey="cumulative" name="Kumulatif" stroke="#f97316" strokeWidth={3} dot={false} />
                  <ReferenceLine y={0} stroke="#000" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col gap-6">
            <h3 className="font-bold text-gray-700">Insight Singkat</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1"><ArrowUpRight size={16} /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Profitability</p>
                  <p className="text-sm text-gray-700 leading-snug">
                    Proyeksi Peluang Profitability sebesar <strong>{formatCompact(summaryMetrics.net_profit_3y)}</strong> di akhir tahun ke-3.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div>
                   {summaryMetrics.net_profit_3y > 0 ? (
                      <div className="flex items-start gap-3">
                        <div className="bg-orange-100 p-2 rounded-full text-orange-600 mt-1">
                          <AlertCircle size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Break Even Point</p>
                          <p className="text-sm text-gray-700 leading-snug">
                            Titik impas diperkirakan terjadi pada <strong>Tahun ke-{Math.ceil(Number(summaryMetrics.payback_period || 3))}</strong>.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Tampilkan pesan peringatan jika belum BEP dalam 3 tahun */
                      <div className="flex items-start gap-3">
                        <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                          <AlertCircle size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-red-500 uppercase font-bold">Status Investasi</p>
                          <p className="text-sm text-red-700 leading-snug">
                            Proyek <strong>belum mencapai titik impas</strong> dalam proyeksi 3 tahun ini.
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Komposisi Pendapatan vs Biaya Operasional</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeStructureData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => formatCompact(val)} width={80} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip formatter={(value) => formatRupiah(value)} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Pendapatan (Revenue)" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="opex" name="Biaya Ops (OPEX)" stroke="#ef4444" fillOpacity={1} fill="url(#colorOpex)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" name="Profit Bersih" stroke="#6366f1" fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- PRINT VIEW - PROFESSIONAL REPORT FORMAT --- */}
      <div ref={componentRef} className="hidden print:block">
        
        {/* HEADER LAPORAN */}
        <div className="mb-8 pb-4 border-b-2 border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">LAPORAN ANALISIS RENCANA ANGGARAN BIAYA</h1>
          <h2 className="text-lg font-semibold text-gray-700">{projectInfo.name}</h2>
          <div className="mt-3 text-sm text-gray-600 grid grid-cols-2 gap-2">
            <div><span className="font-semibold">Kode Proyek:</span> {projectInfo.project_code || "-"}</div>
            <div><span className="font-semibold">Klien:</span> {projectInfo.client_name || "-"}</div>
            <div><span className="font-semibold">Tanggal Cetak:</span> {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            {/*<div><span className="font-semibold">Deadline:</span> {projectInfo.deadline ? new Date(projectInfo.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}</div>*/}
          </div>
        </div>

        {/* RINGKASAN EKSEKUTIF */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-300">RINGKASAN EKSEKUTIF</h3>
          
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 font-semibold text-gray-700 w-1/3">Investasi Awal (CAPEX)</td>
                <td className="py-2 text-gray-900">{formatRupiah(summaryMetrics.total_capex)}</td>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-2 font-semibold text-gray-700">Proyeksi Profit Bersih (3 Tahun)</td>
                <td className="py-2 text-gray-900 font-bold">{formatRupiah(summaryMetrics.net_profit_3y)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 font-semibold text-gray-700">Return on Investment (ROI)</td>
                <td className="py-2 text-gray-900">{summaryMetrics.roi.toFixed(2)}%</td>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-2 font-semibold text-gray-700">Payback Period</td>
                <td className="py-2 text-gray-900">
                  {typeof summaryMetrics.payback_period === 'number' 
                    ? `${summaryMetrics.payback_period.toFixed(1)} Tahun` 
                    : "> 3 Tahun"}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 font-semibold text-gray-700">Skor Kelayakan Proyek</td>
                <td className="py-2 text-gray-900">
                  <span className="font-bold">{summaryMetrics.viability_score}/100</span>
                  <span className="ml-2 text-xs">
                    ({summaryMetrics.viability_score > 70 
                      ? "Sangat Layak" 
                      : summaryMetrics.viability_score >= 55 
                      ? "Cukup Layak" 
                      : "Tidak Layak"})
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ANALISIS ARUS KAS - TABLE */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-300">ANALISIS ARUS KAS (J-CURVE)</h3>
          
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 py-2 px-3 text-left font-semibold">Periode</th>
                <th className="border border-gray-300 py-2 px-3 text-right font-semibold">Cash In</th>
                <th className="border border-gray-300 py-2 px-3 text-right font-semibold">Cash Out</th>
                <th className="border border-gray-300 py-2 px-3 text-right font-semibold">Net Flow</th>
                <th className="border border-gray-300 py-2 px-3 text-right font-semibold">Kumulatif</th>
              </tr>
            </thead>
            <tbody>
              {cashFlowData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 py-2 px-3 font-medium">{row.year}</td>
                  <td className="border border-gray-300 py-2 px-3 text-right">{formatRupiah(row.cash_in)}</td>
                  <td className="border border-gray-300 py-2 px-3 text-right">{formatRupiah(row.cash_out)}</td>
                  <td className={`border border-gray-300 py-2 px-3 text-right font-medium ${row.net_flow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatRupiah(row.net_flow)}
                  </td>
                  <td className={`border border-gray-300 py-2 px-3 text-right font-bold ${row.cumulative >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatRupiah(row.cumulative)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-600 mt-2 italic">
            Tabel di atas menunjukkan proyeksi arus kas dari tahun investasi (T0) hingga tahun operasional ke-3 (T3).
          </p>
        </div>

        {/* PAGE BREAK */}
        <div className="page-break"></div>

        {/* KOMPOSISI PENDAPATAN & BIAYA - TABLE */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-300">KOMPOSISI PENDAPATAN VS BIAYA OPERASIONAL</h3>
          
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 py-2 px-3 text-left font-semibold">Tahun</th>
                <th className="border border-gray-300 py-2 px-3 text-right font-semibold">Pendapatan (Revenue)</th>
                <th className="border border-gray-300 py-2 px-3 text-right font-semibold">Biaya Operasional (OPEX)</th>
                <th className="border border-gray-300 py-2 px-3 text-right font-semibold">Profit Bersih</th>
                <th className="border border-gray-300 py-2 px-3 text-right font-semibold">Margin (%)</th>
              </tr>
            </thead>
            <tbody>
              {financeStructureData.map((row, idx) => {
                const margin = row.revenue > 0 ? ((row.profit / row.revenue) * 100) : 0;
                return (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 py-2 px-3 font-medium">{row.year}</td>
                    <td className="border border-gray-300 py-2 px-3 text-right text-green-700 font-medium">{formatRupiah(row.revenue)}</td>
                    <td className="border border-gray-300 py-2 px-3 text-right text-red-700 font-medium">{formatRupiah(row.opex)}</td>
                    <td className={`border border-gray-300 py-2 px-3 text-right font-bold ${row.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {formatRupiah(row.profit)}
                    </td>
                    <td className="border border-gray-300 py-2 px-3 text-right">{margin.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-gray-600 mt-2 italic">
            Tabel menunjukkan perbandingan antara pendapatan operasional, biaya operasional, dan profit bersih selama periode operasional 3 tahun.
          </p>
        </div>

        {/* KESIMPULAN */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-300">KESIMPULAN & REKOMENDASI</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>1. Kelayakan Finansial:</strong> Proyek ini memiliki skor kelayakan sebesar {summaryMetrics.viability_score}/100, 
              yang mengindikasikan bahwa proyek {summaryMetrics.viability_score > 70 
                ? "sangat layak" 
                : summaryMetrics.viability_score >= 55 
                ? "cukup layak" 
                : "tidak layak"} untuk dilaksanakan dari perspektif finansial.
            </p>
            <p>
              <strong>2. Profitabilitas:</strong> Dengan ROI sebesar {summaryMetrics.roi.toFixed(2)}%, proyek ini diproyeksikan dapat 
              menghasilkan profit bersih sebesar {formatRupiah(summaryMetrics.net_profit_3y)} dalam periode 3 tahun operasional.
            </p>
            <p>
              <strong>3. Periode Pengembalian Modal:</strong> Investasi awal diperkirakan akan kembali dalam waktu{" "}
              {typeof summaryMetrics.payback_period === 'number' 
                ? `${summaryMetrics.payback_period.toFixed(1)} tahun` 
                : "lebih dari 3 tahun"}, 
              yang perlu dipertimbangkan dalam perencanaan cash flow perusahaan.
            </p>
            <p>
              <strong>4. Tren Operasional:</strong> Berdasarkan data arus kas, proyek menunjukkan tren positif dengan peningkatan 
              pendapatan dan profit margin yang konsisten dari tahun ke tahun operasional.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500">
          <p>Dokumen ini digenerate secara otomatis oleh Sistem.</p>
          <p>©Godinov Indonesia - {new Date().getFullYear()} - (Confidential) Sangat Rahasia</p>
        </div>
      </div>

    </div>
  );
}