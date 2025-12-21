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
import { H2 } from "../components/ui/Text"; // Asumsi komponen ini ada dari file sebelumnya
import ProjectCreateModal from "../components/projects/ProjectCreateModal";





// --- MOCK DATA (Untuk Visualisasi Awal) ---
const MOCK_PROJECTS = [
  {
    id: 1,
    name: "E-Commerce Revamp 2024",
    description: "Redesign total platform e-commerce dengan microservices architecture.",
    deadline: "2024-12-20",
    status: "Completed",
    team_count: 8,
    progress: {
      uiux: 100,
      backend: 100,
      frontend: 100
    }
  },
  {
    id: 2,
    name: "Internal HR Dashboard",
    description: "Sistem manajemen karyawan dan payroll terintegrasi.",
    deadline: "2024-11-15",
    status: "Review",
    team_count: 5,
    progress: {
      uiux: 100,
      backend: 85,
      frontend: 80
    }
  },
  {
    id: 3,
    name: "Mobile App POS System",
    description: "Aplikasi kasir berbasis Android untuk klien retail.",
    deadline: "2025-01-10",
    status: "Planning",
    team_count: 4,
    progress: {
      uiux: 10,
      backend: 0,
      frontend: 0
    }
  }
];

// --- SUB-COMPONENT: ROLE PROGRESS BAR ---
const RoleProgressBar = ({ icon: Icon, label, percentage, colorClass, bgClass, textClass }) => (
  <div className="flex items-center gap-3 text-sm">
    <div className={`p-1.5 rounded-md ${bgClass} ${textClass}`}>
      <Icon size={14} />
    </div>
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className="text-xs font-bold text-gray-800">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full ${colorClass} transition-all duration-500`} 
          style={{ width: `${percentage}%` }} 
        ></div>
      </div>
    </div>
  </div>
);

// --- SUB-COMPONENT: PROJECT CARD ---
const ProjectCard = ({ project, onSelect }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Review': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Planning': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <Link to={`/projects/${project.id}`}>
    <div 
      onClick={() => onSelect(project)}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
    >
      {/* Header Card */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          <h3 className="mt-2 text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={18} />
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6 line-clamp-2 h-10">
        {project.description}
      </p>

      {/* 3-Role Progress Section */}
      <div className="space-y-3 mb-6 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
        <RoleProgressBar 
          icon={Layout} 
          label="UI/UX Design" 
          percentage={project.progress.uiux} 
          colorClass="bg-purple-500" 
          bgClass="bg-purple-100"
          textClass="text-purple-600"
        />
        <RoleProgressBar 
          icon={Server} 
          label="Backend API" 
          percentage={project.progress.backend} 
          colorClass="bg-orange-500" 
          bgClass="bg-orange-100"
          textClass="text-orange-600"
        />
        <RoleProgressBar 
          icon={Code} 
          label="Frontend UI" 
          percentage={project.progress.frontend} 
          colorClass="bg-blue-500" 
          bgClass="bg-blue-100"
          textClass="text-blue-600"
        />
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Calendar size={14} />
          <span>{project.deadline}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Users size={14} />
          <span>{project.team_count} Members</span>
        </div>
      </div>
    </div>
    </Link>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Simulasi Fetch Data
  useEffect(() => {
    setTimeout(() => {
      setProjects(MOCK_PROJECTS);
      setLoading(false);
    }, 1000);
  }, []);

  const tabs = ["All", "In Progress", "Review", "Planning", "Completed"];
  

  const filteredProjects = activeTab === "All" 
    ? projects 
    : projects.filter(p => p.status === activeTab);

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
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64"
             />
             <Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>
           </div>
           
           <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center ... dst"
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
               <p className="text-gray-500">Tidak ada project dengan status "{activeTab}"</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onSelect={(p) => console.log("Selected:", p.name)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ProjectCreateModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
             // fetchProjects(); 
          }} 
        />

    </div>
  );
}