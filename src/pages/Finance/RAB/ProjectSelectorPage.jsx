import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Briefcase, 
  ArrowRight, 
  PlusCircle, 
  Clock,
  FolderOpen,
  AlertCircle,
  Loader2
} from "lucide-react";
import { H2 } from "../../../components/ui/Text";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import api from "../../../api";

export default function ProjectSelectorPage({ 
  pageTitle = "Pilih Proyek", 
  description = "Silakan pilih proyek untuk melanjutkan.",
  basePath = "/rab/projects" 
}) {
  const navigate = useNavigate();
  
  // State Management
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. Fetch Data dari API ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/projects");
        
        if (response.data.success) {
          setProjects(response.data.data);
        } else {
          // Fallback jika success false tapi tidak error HTTP
          setProjects(response.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Gagal memuat data proyek. Periksa koneksi internet atau server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // --- 2. Filter Logic ---
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.client_name && p.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (projectId) => {
    navigate(`${basePath}/${projectId}`);
  };

  // Helper untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  // Helper warna status
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("progress")) return "bg-blue-500";
    if (s.includes("done") || s.includes("finish")) return "bg-emerald-500";
    if (s.includes("cancel")) return "bg-red-500";
    return "bg-gray-400"; // Default (Draft/New)
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 min-h-screen">
       <Breadcrumbs 
          items={[
            { label: "RAB Center", path: "/rab" },
            { label: pageTitle, path: "#" }, 
          ]} 
      />
      
      {/* Header Dinamis */}
      <div className="mb-6 border-b border-gray-100 pb-4 flex flex-col sm:flex-row justify-between items-end gap-4">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs font-bold uppercase tracking-wider">
            <FolderOpen size={14} /> Project Selector
          </div>
          <H2>{pageTitle}</H2>
          <p className="text-gray-500 mt-1 text-sm">{description}</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama proyek..."
            className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      
      {/* 1. Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
          <p>Sedang memuat daftar proyek...</p>
        </div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={24} />
          <div>
            <p className="font-bold">Terjadi Kesalahan</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* 3. Data Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card Loop */}
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => handleSelect(project.id)}
              className="group bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-gray-200 flex items-center gap-1">
                  <Briefcase size={10} />
                  {project.client_name || "Internal"}
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(project.status)}`} title={project.status}></span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                {project.name}
              </h3>
              
              <div className="text-xs text-gray-500 mb-4 line-clamp-1">
                Kode: <span className="font-mono bg-gray-50 px-1 rounded">{project.project_code || "-"}</span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> Deadline: {formatDate(project.deadline)}
                </span>
                <span className="text-sm font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Pilih <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}

          {/* Empty State (Jika tidak ada hasil search) */}
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <FolderOpen size={48} className="mx-auto mb-2 opacity-20" />
              <p>Tidak ada proyek yang ditemukan.</p>
            </div>
          )}

          {/* Create New Project Shortcut */}
          <div 
            onClick={() => navigate('/projects')}
            className="border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-all min-h-[160px]"
          >
            <PlusCircle size={28} className="mb-2 opacity-50" />
            <span className="font-medium text-sm">Buat Proyek Baru</span>
          </div>

        </div>
      )}
    </div>
  );
}