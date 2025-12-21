import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { 
  ChevronRight, 
  Home, 
  Plus, 
  Layout, 
  Server, 
  Code, 
  Calendar, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  Circle,
  AlertCircle,
  Filter
} from "lucide-react";
import { H2 } from "../components/ui/Text";




const PROJECTS_LIST = [
  {
    id: 1,
    name: "E-Commerce Revamp 2024",
    status: "In Progress",
    deadline: "20 Dec 2024",
    description: "Redesign total platform e-commerce dengan microservices architecture.",
    stats: {
      uiux: 100,
      backend: 100,
      frontend: 100
    },
    tasks: [
      { id: 101, title: "Wireframe Homepage", role: "uiux", status: "Done", priority: "High", assignee: "Sarah" },
      { id: 102, title: "Design System Tokens", role: "uiux", status: "In Progress", priority: "Medium", assignee: "Sarah" },
      { id: 103, title: "Setup Database Schema", role: "backend", status: "Done", priority: "High", assignee: "Budi" },
      { id: 104, title: "API Authentication (Sanctum)", role: "backend", status: "In Progress", priority: "High", assignee: "Budi" },
      { id: 105, title: "Product List API", role: "backend", status: "Todo", priority: "Medium", assignee: "Joko" },
      { id: 106, title: "Setup React Router", role: "frontend", status: "Done", priority: "High", assignee: "Andi" },
      { id: 107, title: "Component Library Setup", role: "frontend", status: "Todo", priority: "Low", assignee: "Andi" },
    ]
  },
  {
    id: 2,
    name: "Mobile POS System Retail",
    status: "Planning",
    deadline: "15 Feb 2025",
    description: "Pengembangan aplikasi kasir berbasis Android untuk toko retail modern.",
    stats: {
      uiux: 33,
      backend: 0,
      frontend: 0
    },
    tasks: [
      { id: 201, title: "User Flow Analysis", role: "uiux", status: "Done", priority: "High", assignee: "Rina" },
      { id: 202, title: "High-Fidelity Mobile Design", role: "uiux", status: "In Progress", priority: "High", assignee: "Rina" },
      { id: 203, title: "Prototyping Checkout Flow", role: "uiux", status: "Todo", priority: "Medium", assignee: "Rina" },
      { id: 204, title: "System Architecture Design", role: "backend", status: "In Progress", priority: "High", assignee: "Fahmi" },
      { id: 205, title: "Integrasi SDK Barcode Scanner", role: "frontend", status: "Todo", priority: "High", assignee: "Eko" }
    ]
  }
];





// --- SUB-COMPONENTS ---

const Breadcrumbs = ({ projectName }) => (
  <nav className="flex items-center text-sm text-gray-500 mb-6 animate-fade-in">
    <ChevronRight size={14} className="mx-2 text-gray-300" />
    <a href="/projects" className="hover:text-blue-600 transition-colors">
      Projects
    </a>
    <ChevronRight size={14} className="mx-2 text-gray-300" />
    <span className="font-semibold text-gray-800 truncate max-w-[200px]">{projectName}</span>
  </nav>
);

const TaskCard = ({ task }) => {
  const getPriorityColor = (p) => {
    switch (p) {
      case 'High': return 'bg-red-50 text-red-600 border-red-100';
      case 'Medium': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getStatusIcon = (s) => {
    if (s === 'Done') return <CheckCircle2 size={16} className="text-green-500" />;
    if (s === 'In Progress') return <Clock size={16} className="text-blue-500" />;
    return <Circle size={16} className="text-gray-400" />;
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group mb-3">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <button className="text-gray-300 group-hover:text-gray-500">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      <h4 className="text-sm font-semibold text-gray-800 mb-3 leading-snug">{task.title}</h4>
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          {getStatusIcon(task.status)}
          <span>{task.status}</span>
        </div>
        
        {/* Avatar Assignee */}
        <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold" title={`Assigned to ${task.assignee}`}>
          {task.assignee.charAt(0)}
        </div>
      </div>
    </div>
  );
};

const RoleColumn = ({ title, icon: Icon, tasks, colorTheme, onAddTask, project }) => {
  return (
    <div className="flex-1 min-w-[300px] flex flex-col h-full">
      {/* Column Header */}
      <div className={`p-4 rounded-t-xl border-t border-x ${colorTheme.border} ${colorTheme.bg} flex justify-between items-center`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-white/60 ${colorTheme.text}`}>
            <Icon size={16} />
          </div>
          <span className={`font-bold ${colorTheme.text}`}>{title}</span>
          <span className="bg-white/50 px-2 py-0.5 rounded text-xs font-bold text-gray-700">
            {tasks.length}
          </span>
        </div>
        {project?.status !== 'Completed' &&(
          <button 
            onClick={onAddTask}
            className={`p-1.5 rounded-lg hover:bg-white/50 transition-colors ${colorTheme.text}`}
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Column Body */}
      <div className={`flex-1 p-3 bg-gray-50/50 border-x border-b ${colorTheme.border} rounded-b-xl overflow-y-auto max-h-[600px] custom-scrollbar`}>
        {tasks.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            <span className="text-xs">No tasks yet</span>
          </div>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function ProjectDetailPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

// Simulasi Fetch Data Berdasarkan ID 
  useEffect(() => {
    setLoading(true);
    
    //simulasi loading API
    const timer = setTimeout(() => {
      const foundProject = PROJECTS_LIST.find(p => p.id == id);
      
      if (foundProject) {
        setProject(foundProject);
      } else {
        console.error("Project tidak ditemukan");
      }
      
      setLoading(false);
    },);

    return () => clearTimeout(timer);
  }, [id]); 

  const handleAddTask = (role) => {
    console.log(`Open modal to add task for role: ${role}`);
  };

  if (loading) return (
    <div className="p-10 text-center flex flex-col items-center justify-center h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 animate-pulse">Memuat detail project...</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-10">
      
      {/* 1. BREADCRUMBS */}
      <Breadcrumbs projectName={project.name} />

      {/* 2. HEADER DETAIL */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <H2 className="text-2xl">{project.name}</H2>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                {project.status}
              </span>
            </div>
            <p className="text-gray-500 max-w-2xl">{project.description}</p>
            
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-500"/>
                <span className="font-medium">Due: {project.deadline}</span>
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-purple-500"/>
                <span className="font-medium">Total Tasks: {project.tasks.length}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-2 md:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
              <AlertCircle size={18} /> Issues
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition shadow-lg shadow-gray-200">
              <Plus size={18} /> Add Member
            </button>
          </div>
        </div>
      </div>

      {/* 3. TASK BOARD (3 ROLES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* UI/UX COLUMN */}
        <RoleColumn 
          title="UI/UX Design" 
          icon={Layout} 
          tasks={project.tasks.filter(t => t.role === 'uiux')}
          onAddTask={() => handleAddTask('uiux')}
          colorTheme={{
            bg: "bg-purple-50",
            text: "text-purple-700",
            border: "border-purple-100"
          }}
        />

        {/* BACKEND COLUMN */}
        <RoleColumn 
          title="Backend Development" 
          icon={Server} 
          tasks={project.tasks.filter(t => t.role === 'backend')}
          onAddTask={() => handleAddTask('backend')}
          colorTheme={{
            bg: "bg-orange-50",
            text: "text-orange-700",
            border: "border-orange-100"
          }}
        />

        {/* FRONTEND COLUMN */}
        <RoleColumn 
          title="Frontend Development" 
          icon={Code} 
          tasks={project.tasks.filter(t => t.role === 'frontend')}
          onAddTask={() => handleAddTask('frontend')}
          colorTheme={{
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-100"
          }}
        />

      </div>
    </div>
  );
}