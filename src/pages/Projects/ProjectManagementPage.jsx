import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Layout, 
  Server, 
  Code, 
  Calendar, 
  Clock, 
  MoreVertical, 
  Play, 
  Pause, 
  CheckCircle,
  Search,
  Filter,
  Users
} from "lucide-react";
import { H2 } from "../../components/ui/Text";
import ProjectCreateModal from "../../components/projects/ProjectCreateModal";
import ProjectCard from "../../components/projects/ProjectCard";
import { toast } from "react-toastify";
import api from "../../api";





// --- MAIN PAGE COMPONENT ---
export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Projects dari API
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/projects");
      
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Gagal memuat data projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteSuccess = (deletedId) => {
    // Filter projects untuk menghapus project dengan ID yang baru saja didelete
    setProjects((prevProjects) => prevProjects.filter(p => p.id !== deletedId));
  };

  const handleUpdateSuccess = (updatedProject) => {
    setProjects((prevProjects) => 
      prevProjects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  const tabs = ["All", "In Progress", "Review", "Planning", "Completed"];
  
  // Filter berdasarkan tab dan search query
  const filteredProjects = projects.filter(project => {
    const matchesTab = activeTab === "All" || project.status === activeTab;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="relative min-h-screen pb-24"> 
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <H2>Project Management</H2>
        </div>
        
        <div className="flex gap-2">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Cari project..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>
          </div>
           
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-lg"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Project Baru</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
              activeTab === tab 
              ? "bg-gray-900 text-white border-gray-900" 
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Filter size={24} />
              </div>
              <p className="text-gray-500">
                {searchQuery 
                  ? `Tidak ada project yang cocok dengan "${searchQuery}"`
                  : `Tidak ada project dengan status "${activeTab}"`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onSelect={(p) => console.log("Navigating to:", p.name)}
                onDeleteSuccess={handleDeleteSuccess}
                onUpdateSuccess={handleUpdateSuccess}
              />
            ))}
            </div>
          )}
        </>
      )}

      <ProjectCreateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
}