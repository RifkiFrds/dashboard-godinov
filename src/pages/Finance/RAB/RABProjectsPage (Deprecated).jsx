import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  MoreVertical,
  ArrowRight,
  FileBarChart
} from "lucide-react";
import { H2 } from "../../../components/ui/Text";

// Mock Data (Nanti diganti dengan API Call)
const initialProjects = [
  {
    id: 1,
    name: "Sistem Informasi HRIS Enterprise",
    client: "PT. Maju Mundur",
    created_date: "2024-01-15",
    status: "Draft",
    estimated_capex: 150000000,
    roi_projection: "2.5 Tahun",
  },
  {
    id: 2,
    name: "Aplikasi E-Commerce Mobile (Android/iOS)",
    client: "Toko Serba Ada",
    created_date: "2024-02-10",
    status: "Final",
    estimated_capex: 85500000,
    roi_projection: "1.8 Tahun",
  },
  {
    id: 3,
    name: "Website Company Profile & SEO",
    client: "Internal Project",
    created_date: "2024-03-01",
    status: "Review",
    estimated_capex: 25000000,
    roi_projection: "N/A",
  }
];

export default function RABProjectsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState(initialProjects);

  // Helper untuk format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Filter Logic
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Final": return "bg-green-100 text-green-700 border-green-200";
      case "Review": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 min-h-screen">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gray-100 pb-4 gap-4">
        <div>
          <H2>Daftar Proyek RAB</H2>
          <p className="text-gray-500 mt-1 text-sm">
            Kelola estimasi biaya, hitung ROI, dan pantau status setiap proyek.
          </p>
        </div>
        <button 
          onClick={() => navigate("/rab/projects/new")}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Buat Proyek Baru
        </button>
      </div>

      {/* --- FILTER & SEARCH --- */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari nama proyek atau klien..."
          className="pl-10 pr-4 py-2.5 w-full sm:w-1/2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- PROJECT GRID --- */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Briefcase size={20} />
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                  <span className="font-medium text-gray-600">{project.client}</span>
                </p>

                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <FileBarChart size={14} /> Est. CAPEX
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatRupiah(project.estimated_capex)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <TrendingUp size={14} /> Proyeksi ROI
                    </span>
                    <span className="font-medium text-emerald-600">
                      {project.roi_projection}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Calendar size={14} /> Dibuat
                    </span>
                    <span className="text-gray-600">
                      {project.created_date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer / Action */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center">
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <MoreVertical size={18} />
                </button>
                <button 
                  onClick={() => navigate(`/rab/projects/${project.id}`)}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Detail & Edit <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
            <Search className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Tidak ada proyek ditemukan</h3>
          <p className="mt-1 text-gray-500">Coba kata kunci lain atau buat proyek baru.</p>
        </div>
      )}
    </div>
  );
}