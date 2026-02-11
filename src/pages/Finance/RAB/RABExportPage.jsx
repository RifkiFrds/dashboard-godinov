import React, { useState, useRef, useEffect } from "react";
import { 
  FileDown, 
  Printer, 
  Eye, 
  Settings, 
  CheckSquare, 
  Square,
  Type,
  Calendar,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { H2 } from "../../../components/ui/Text";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import api from "../../../api";

export default function RABExportPage() {
  const { projectId } = useParams();
  const componentRef = useRef(null);

  // --- State Data ---
  const [isLoading, setIsLoading] = useState(true);
  
  // Data Proyek & Analisis
  const [projectInfo, setProjectInfo] = useState({});
  const [analysis, setAnalysis] = useState({
    roi: 0,
    npv_value: 0,
    payback_period: 0,
    viability_score: 0,
    net_profit_3y: 0,
    total_capex: 0,
    total_opex_3y: 0
  });

  // Data Proposal (Gabungan)
  const [proposalData, setProposalData] = useState({
    refNumber: "",
    clientName: "",
    projectTitle: "",
    totalCapex: 0,
    features: [],
    yearlyMaintenance: 0,
    validUntil: ""
  });

  const [meta, setMeta] = useState({
    client: "",
    date: new Date().toISOString().split('T')[0],
    preparedBy: "Tim Internal Godinov",
    companyName: "Godinov Indonesia",
    companyAddress: "Kota Tangerang, Banten",
    companyPhone: "+62 851xxxxxxxxx",
    companyEmail: "finance@godinov.id"
  });

  // --- State Konfigurasi ---
  const [config, setConfig] = useState({
    showCover: true,
    showTechSpecs: true,
    showFinancials: true,
    showTimeline: true,
    showTerms: true,
    includeTax: true,
  });

  // --- Fetch Data ---
  useEffect(() => {
    if (projectId) {
      fetchProposalData();
    }
  }, [projectId]);

  const fetchProposalData = async () => {
    try {
      setIsLoading(true);
      
      // Ambil semua data yang diperlukan
      const [resProject, resCapex, resOpex, resAnalysis] = await Promise.all([
        api.get(`/api/projects/${projectId}`),
        api.get(`/api/rab/capex/${projectId}`),
        api.get(`/api/rab/opex/${projectId}`),
        api.get(`/api/rab/analysis/${projectId}`)
      ]);

      if (resProject.data.success) {
        const p = resProject.data.data;
        setProjectInfo(p);
        
        // Update Meta
        setMeta(prev => ({
            ...prev,
            client: p.client_name || "Nama Klien",
        }));

        // Valid Until (+30 hari)
        const validDate = new Date();
        validDate.setDate(validDate.getDate() + 30);
        
        // Process Features (CAPEX)
        let features = [];
        let totalCapex = 0;
        if (resCapex.data.success) {
            features = resCapex.data.data.map(item => ({
                name: item.item_name,
                desc: item.description || "-",
                cost: Number(item.total_cost)
            }));
            totalCapex = features.reduce((acc, curr) => acc + curr.cost, 0);
        }

        // Process OPEX (Year 1)
        let yearlyMaintenance = 0;
        if (resOpex.data.success) {
             yearlyMaintenance = resOpex.data.data.reduce((acc, curr) => acc + (Number(curr.monthly_cost_y1 || 0) * 12), 0);
        }

        // Process Analysis
        if (resAnalysis.data.success) {
            const m = resAnalysis.data.metrics;
            // Hitung ROI manual jika perlu (sama seperti dashboard)
            const roiVal = Number(m.total_capex) > 0 
                ? ((Number(m.net_profit_3y) / Number(m.total_capex)) * 100) 
                : 0;
            
            setAnalysis({
                ...m,
                roi: roiVal,
                net_profit_3y: Number(m.net_profit_3y || 0),
                viability_score: m.viability_score || 0
            });
        }

        setProposalData({
            refNumber: `PROP/${p.project_code || '000'}/${new Date().getFullYear()}`,
            clientName: p.client_name,
            projectTitle: p.name,
            totalCapex: totalCapex,
            features: features,
            yearlyMaintenance: yearlyMaintenance,
            validUntil: validDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})
        });
      }

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---
  const toggleSection = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Proposal_${proposalData.refNumber.replace(/\//g, '_')}`,
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
          break-before: page !important;
        }
        .print-content { 
          padding: 0 !important;
          box-shadow: none !important;
        }
      }
    `
  });

  // Helper Format
  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  const calculateTax = (amount) => config.includeTax ? amount * 0.11 : 0;
  const grandTotal = () => proposalData.totalCapex + calculateTax(proposalData.totalCapex);

  // Logic Status Kelayakan (Sama seperti Dashboard)
  const isFeasible = analysis.viability_score >= 55;
  const isHighlyFeasible = analysis.viability_score > 70;
  const isProfitable = analysis.net_profit_3y > 0;

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Menyiapkan Dokumen Proposal...</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 min-h-screen flex flex-col lg:flex-row gap-6">
      
      {/* --- LEFT PANEL: CONFIGURATION --- */}
      <div className="w-full lg:w-1/3 space-y-6 no-print">
        <Breadcrumbs 
            items={[
              { label: "RAB Center", path: "/rab" },
              { label: "Export Proposal", path: "/rab/export-select" },
            ]} 
          />
        {/* Header */}
        <div>
          <H2>Ekspor Proposal</H2>
          <p className="text-gray-500 text-sm mt-1">Sesuaikan konten proposal.</p>
        </div>

        {/* 1. Meta Data */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-700 flex items-center gap-2"><Type size={16} /> Informasi Dasar</h3>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Nama Klien</label>
            <input type="text" value={meta.client} onChange={(e) => setMeta({...meta, client: e.target.value})} className="w-full p-2 text-sm border border-gray-300 rounded outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
             <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Tanggal</label>
              <input type="date" value={meta.date} onChange={(e) => setMeta({...meta, date: e.target.value})} className="w-full p-2 text-sm border border-gray-300 rounded outline-none" />
            </div>
             <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Dibuat Oleh</label>
              <input type="text" value={meta.preparedBy} onChange={(e) => setMeta({...meta, preparedBy: e.target.value})} className="w-full p-2 text-sm border border-gray-300 rounded outline-none" />
            </div>
          </div>
        </div>

        {/* 2. Toggles */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-700 flex items-center gap-2"><Settings size={16} /> Bagian Proposal</h3>
          <div className="space-y-2">
            <ToggleItem label="Halaman Cover" desc="Judul & Info Dasar" active={config.showCover} onClick={() => toggleSection('showCover')} />
            <ToggleItem label="Rincian Biaya (CAPEX)" desc="Tabel fitur & harga" active={config.showTechSpecs} onClick={() => toggleSection('showTechSpecs')} />
            <ToggleItem label="Analisis Finansial" desc="ROI, NPV & Kelayakan" active={config.showFinancials} onClick={() => toggleSection('showFinancials')} highlight />
            <ToggleItem label="Termasuk PPN 11%" desc="Hitung pajak otomatis" active={config.includeTax} onClick={() => toggleSection('includeTax')} />
            <ToggleItem label="Syarat & Ketentuan" desc="Termin pembayaran" active={config.showTerms} onClick={() => toggleSection('showTerms')} />
          </div>
        </div>

        {/* 3. Actions */}
        <div className="flex flex-col gap-3">
          <button onClick={handlePrint} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center gap-2">
            <Printer size={18} /> Cetak PDF
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: PREVIEW --- */}
      <div className="w-full lg:w-2/3 bg-gray-100 p-4 lg:p-8 rounded-xl border border-gray-200 overflow-y-auto max-h-screen custom-scrollbar">
        <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm font-medium"><Eye size={16} /> Preview (A4)</div>

        {/* DOCUMENT START */}
        <div 
          ref={componentRef}
          className="bg-white mx-auto shadow-2xl min-h-[1000px] w-full max-w-[794px] text-gray-800 font-sans leading-relaxed print-content"
        >
          <div className="p-10">
          {/* LETTERHEAD */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 -m-10 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-1">{meta.companyName}</h1>
                <p className="text-blue-100 text-xs">{meta.companyAddress}</p>
                <p className="text-blue-100 text-xs">Tel: {meta.companyPhone} | Email: {meta.companyEmail}</p>
              </div>
              <div className="bg-white text-blue-700 px-4 py-2 rounded font-bold text-sm">
                PROPOSAL
              </div>
            </div>
          </div>
          {/* HEADER / COVER */}
          {config.showCover && (
            <div className="space-y-6 mb-8">
              {/* Document Info */}
              <div className="grid grid-cols-2 gap-6 text-sm border-b-2 border-gray-200 pb-6">
                <div>
                 {/* <p className="text-gray-500 text-xs font-semibold mb-1">NO. REFERENSI</p>
                  <p className="font-bold text-blue-700">{proposalData.refNumber}</p>*/}
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs font-semibold mb-1">TANGGAL</p>
                  <p className="font-bold">{new Date(meta.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Client Info */}
              <div className="border-l-4 border-blue-700 pl-4">
                <p className="text-gray-500 text-xs font-semibold mb-1">KEPADA YTH.</p>
                <p className="font-bold text-xl text-gray-900">{meta.client}</p>
              </div>

              {/* Project Title */}
              <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
                <p className="text-xs text-blue-600 uppercase font-semibold mb-2">Perihal</p>
                <h2 className="text-2xl font-bold text-gray-900">{proposalData.projectTitle}</h2>
                <p className="text-sm text-gray-600 mt-2">Penawaran Harga & Rencana Anggaran Biaya</p>
              </div>
            </div>
          )}

          {/* OPENING */}
          <div className="mb-8 text-sm text-gray-700 space-y-3">
            <p>Dengan hormat,</p>
            <p>
              Terima kasih atas kesempatan yang diberikan kepada <strong>{meta.companyName}</strong>. 
              Berdasarkan diskusi dan analisis kebutuhan, kami mengajukan penawaran solusi teknologi 
              untuk proyek <strong>{proposalData.projectTitle}</strong> dengan rincian sebagai berikut:
            </p>
          </div>

          {/* EXECUTIVE SUMMARY */}
          <div className="bg-gray-50 border-2 border-gray-300 p-6 rounded-lg mb-8">
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-4 tracking-wider border-b border-gray-300 pb-2">
              Ringkasan Investasi
            </h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="border-r border-gray-300">
                <p className="text-xs text-gray-500 mb-2">Total Investasi</p>
                <p className="text-2xl font-bold text-blue-700">{formatRupiah(grandTotal())}</p>
                {config.includeTax && <p className="text-[10px] text-gray-400 mt-1">*Termasuk PPN 11%</p>}
              </div>
              <div className="border-r border-gray-300">
                <p className="text-xs text-gray-500 mb-2">Maintenance/Tahun</p>
                <p className="text-2xl font-bold text-gray-700">{formatRupiah(proposalData.yearlyMaintenance)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Estimasi Waktu</p>
                <p className="text-2xl font-bold text-gray-700">3-6 Bulan</p>
              </div>
            </div>
          </div>

          {/* TECHNICAL SPECS */}
          {config.showTechSpecs && (
            <div className="mb-8">
              <h3 className="text-base font-bold text-gray-900 border-l-4 border-blue-600 pl-3 uppercase mb-4">
                1. Lingkup Pekerjaan & Biaya
              </h3>
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left w-12">No.</th>
                    <th className="border border-gray-300 p-2 text-left">Item / Fitur</th>
                    <th className="border border-gray-300 p-2 text-right w-40">Biaya (IDR)</th>
                  </tr>
                </thead>
                <tbody>
                  {proposalData.features.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
                      <td className="border border-gray-300 p-2">
                        <span className="font-semibold block">{item.name}</span>
                        <span className="text-xs text-gray-500">{item.desc}</span>
                      </td>
                      <td className="border border-gray-300 p-2 text-right font-mono">{formatRupiah(item.cost)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan="2" className="border border-gray-300 p-2 text-right">Subtotal</td>
                    <td className="border border-gray-300 p-2 text-right">{formatRupiah(proposalData.totalCapex)}</td>
                  </tr>
                  {config.includeTax && (
                    <>
                      <tr>
                        <td colSpan="2" className="border border-gray-300 p-2 text-right text-gray-600">PPN 11%</td>
                        <td className="border border-gray-300 p-2 text-right text-gray-600">{formatRupiah(calculateTax(proposalData.totalCapex))}</td>
                      </tr>
                      <tr className="bg-blue-900 text-white font-bold text-lg">
                        <td colSpan="2" className="border border-blue-900 p-3 text-right">GRAND TOTAL</td>
                        <td className="border border-blue-900 p-3 text-right">{formatRupiah(grandTotal())}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* PAGE BREAK FOR PRINT */}
          <div className="page-break"></div>

          {/* FINANCIAL ANALYSIS (DYNAMIC LOGIC) */}
          {config.showFinancials && (
            <div className="mb-8 mt-8">
               <h3 className="text-base font-bold text-gray-900 border-l-4 border-emerald-600 pl-3 uppercase mb-4">
                 2. Analisis Kelayakan Finansial
               </h3>
               
               {isProfitable ? (
                 // JIKA LAYAK / PROFITABLE
                 <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="text-emerald-600 mt-1" size={24} />
                        <div>
                            <h4 className="font-bold text-emerald-800 text-lg mb-2">Proyeksi: LAYAK & MENGUNTUNGKAN</h4>
                            <p className="text-sm text-emerald-900 leading-relaxed mb-4">
                                Berdasarkan analisis kami, investasi ini diproyeksikan akan memberikan keuntungan positif 
                                dengan total profit bersih (3 Tahun) sebesar <strong>{formatRupiah(analysis.net_profit_3y)}</strong>.
                            </p>
                            
                            <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded border border-emerald-100 shadow-sm">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">ROI</p>
                                    <p className="text-xl font-bold text-emerald-600">{analysis.roi.toFixed(1)}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Payback Period</p>
                                    <p className="text-xl font-bold text-emerald-600">{analysis.payback_period.toFixed(1)} Thn</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Health Score</p>
                                    <p className="text-xl font-bold text-emerald-600">{analysis.viability_score}/100</p>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
               ) : (
                 // JIKA TIDAK LAYAK / RUGI
                 <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="text-orange-600 mt-1" size={24} />
                        <div>
                            <h4 className="font-bold text-orange-800 text-lg mb-2">Catatan Analisis Finansial</h4>
                            <p className="text-sm text-orange-900 leading-relaxed mb-4">
                                Berdasarkan parameter saat ini, proyeksi finansial menunjukkan bahwa investasi belum mencapai titik impas (Break Even) 
                                dalam periode 3 tahun pertama. Disarankan untuk meninjau kembali strategi monetisasi atau efisiensi biaya.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded border border-orange-100 shadow-sm">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Estimasi ROI</p>
                                    <p className="text-lg font-bold text-orange-600">{analysis.roi.toFixed(1)}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Net Cash Flow (3Y)</p>
                                    <p className="text-lg font-bold text-red-600">{formatRupiah(analysis.net_profit_3y)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* TERMS */}
          {config.showTerms && (
            <div className="mb-8">
              <h3 className="text-base font-bold text-gray-900 border-l-4 border-gray-500 pl-3 uppercase mb-4">
                3. Syarat & Ketentuan
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                <li>Harga {config.includeTax ? 'sudah' : 'belum'} termasuk PPN 11%.</li>
                <li>Penawaran berlaku hingga <strong>{proposalData.validUntil}</strong>.</li>
                <li>Pembayaran DP 50% di muka, Pelunasan 50% setelah UAT.</li>
                <li>Biaya di luar scope pekerjaan akan dikenakan *Additional Cost*.</li>
              </ul>
            </div>
          )}

          {/* SIGNATURE */}
          <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-2 gap-20 break-inside-avoid">
             <div className="text-center">
               <p className="text-sm font-bold mb-24">Disetujui Oleh,</p>
               <div className="border-t border-gray-400 pt-2 mx-10">
                 <p className="font-bold">{meta.client}</p>
                 <p className="text-xs text-gray-500">Klien</p>
               </div>
             </div>
             <div className="text-center">
               <p className="text-sm font-bold mb-24">Hormat Kami,</p>
               <div className="border-t border-gray-400 pt-2 mx-10">
                 <p className="font-bold">{meta.preparedBy}</p>
                 <p className="text-xs text-gray-500">{meta.companyName}</p>
               </div>
             </div>
          </div>

          </div>
          {/* End of padding wrapper */}

        </div>
        {/* End of document */}
      </div>

    </div>
  );
}

// Sub-komponen Toggle
function ToggleItem({ label, desc, active, onClick, highlight }) {
  return (
    <div onClick={onClick} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${active ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
      <div className={`mt-1 ${active ? 'text-blue-600' : 'text-gray-300'}`}>{active ? <CheckSquare size={20} /> : <Square size={20} />}</div>
      <div>
        <p className={`text-sm font-bold ${active ? 'text-blue-800' : 'text-gray-600'} ${highlight && active ? 'text-emerald-700' : ''}`}>{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  )
}