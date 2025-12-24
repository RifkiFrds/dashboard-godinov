import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
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
  Filter,
  ArrowLeft,
  Play
} from "lucide-react";
import { H2 } from "../components/ui/Text";
import AddTaskModal from '../components/projects/details/AddTaskProject';
import { toast } from "react-toastify";
import api from "../api";
import { getDynamicStatus } from "../components/projects/utils/projectHelpers";
import { getStatusColor } from "../components/projects/utils/projectHelpers";



// --- SUB-COMPONENTS ---


const Breadcrumbs = ({ projectName }) => (
  <nav className="flex items-center text-sm text-gray-500 mb-6 animate-fade-in">
    <Link to="/projects" className="hover:text-blue-600 transition-colors flex items-center gap-2">
      <ArrowLeft size={16} />
      Projects
    </Link>
    <ChevronRight size={14} className="mx-2 text-gray-300" />
    <span className="font-semibold text-gray-800 truncate max-w-[200px]">{projectName}</span>
  </nav>
);

const TaskCard = ({ task, onStatusChange, projectStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getPriorityColor = (p) => {
    switch (p) {
      case 'High': 
      case 'Critical': 
        return 'bg-red-50 text-red-600 border-red-100';
      case 'Medium': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };


  const getStatusIcon = (s) => {
    if (s === 'Done') return <CheckCircle2 size={16} className="text-green-500" />;
    if (s === 'In Progress') return <Clock size={16} className="text-blue-500" />;
    if (s === 'Blocked') return <AlertCircle size={16} className="text-red-500" />;
    return <Circle size={16} className="text-gray-400" />;
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
  try {
    // Update ke API
    await api.patch(`/api/tasks/${taskId}/status`, { status: newStatus });

    setProject(prevProject => ({
      ...prevProject,
      tasks: prevProject.tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    }));
    
    toast.success(`Status diperbarui menjadi ${newStatus}`);
  } catch (error) {
    toast.error("Gagal memperbarui status");
  }
};

  const handleStatusClick = async () => {
    if (projectStatus === 'Completed') return; // Prevent changes on completed projects

    const statuses = ['Todo', 'In Progress', 'Done'];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    setIsUpdating(true);
    await onStatusChange(task.id, nextStatus);
    setIsUpdating(false);
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
        <button
          onClick={handleStatusClick}
          disabled={isUpdating || projectStatus === 'Completed'}
          className="flex items-center gap-2 text-xs text-gray-500 font-medium hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          ) : (
            getStatusIcon(task.status)
          )}
          <span>{task.status}</span>
        </button>
        <div className="flex justify-between items-center mt-4">
      </div>
        
        {/* Avatar Assignee */}
        <div 
          className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold" 
          title={`Assigned to ${task.assignee}`}
        >
          {task.assignee?.charAt(0) || 'U'}
        </div>
      </div>
    </div>
  );
};

const RoleColumn = ({ title, icon: Icon, tasks, colorTheme, onAddTask, project, onTaskStatusChange }) => {
  // Helper untuk memfilter task berdasarkan status di dalam role ini
  const todoTasks = tasks.filter(t => t.status === 'Todo');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  const StatusSection = ({ label, count, taskList, bgColor }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className={`text-[10px] uppercase font-bold tracking-wider ${colorTheme.text} opacity-70`}>
          {label}
        </span>
        <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
          {count}
        </span>
      </div>
      <div className="space-y-3">
        {taskList.length > 0 ? (
          taskList.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={onTaskStatusChange}
              projectStatus={project?.status}
            />
          ))
        ) : (
          <div className="py-4 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-[10px] text-gray-400">Empty</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 min-w-[320px] flex flex-col h-full">
      {/* Column Header */}
      <div className={`p-4 rounded-t-xl border-t border-x ${colorTheme.border} ${colorTheme.bg} flex justify-between items-center shadow-sm`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-white/60 ${colorTheme.text}`}>
            <Icon size={16} />
          </div>
          <span className={`font-bold ${colorTheme.text}`}>{title}</span>
        </div>
          <button 
            className={`p-1.5 rounded-lg hover:bg-white/50 transition-colors ${colorTheme.text}`}
            onClick={onAddTask}
          >
            <Plus size={18} />
          </button>
      </div>

      {/* Column Body - Berisi 3 Sub-Section */}
      <div className={`flex-1 p-3 bg-gray-50/50 border-x border-b ${colorTheme.border} rounded-b-xl overflow-y-auto max-h-[700px] custom-scrollbar`}>
        <StatusSection label="To Do" count={todoTasks.length} taskList={todoTasks} />
        <StatusSection label="In Progress" count={inProgressTasks.length} taskList={inProgressTasks} />
        <StatusSection label="Done" count={doneTasks.length} taskList={doneTasks} />
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function ProjectDetailPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('uiux');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const { id } = useParams();
  const currentCalculatedStatus = project ? getDynamicStatus(project) : null;

  useEffect(() => {
    const syncStatusToDatabase = async () => {
      // Jika project belum ada atau status sudah sama dengan DB, jangan lakukan apa-apa
      if (!project || currentCalculatedStatus === project.status) return;

      try {
        console.log(`Syncing status: ${project.status} -> ${currentCalculatedStatus}`);
        
        await api.put(`/api/projects/${project.id}`, {
          status: currentCalculatedStatus
        });

        setProject(prev => ({ ...prev, status: currentCalculatedStatus }));
        
      } catch (error) {
        console.error("Gagal sinkronisasi status ke server:", error);
      }
    };

    syncStatusToDatabase();
  }, [currentCalculatedStatus, project?.status]); // Berjalan jika hasil hitung atau status DB berubah

  // Fetch Project Detail dari API
  const fetchProjectDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/projects/${id}`);
      
      if (response.data.success) {
        setProject(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching project detail:", error);
      toast.error("Gagal memuat detail project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const handleTaskAdded = (newTask) => {
    setProject(prevProject => ({
      ...prevProject,
      tasks: [...(prevProject.tasks || []), newTask]
    }));
    fetchProjectDetail();
    toast.success("Task baru berhasil ditambahkan");
  };



  // Handle Task Status Update
  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const response = await api.patch(`/api/projects/${id}/tasks/${taskId}`, {
        status: newStatus
      });

      if (response.data.success) {
        toast.success("Task status updated!");
        // Refresh project detail to get updated progress
        fetchProjectDetail();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Gagal mengupdate task status");
    }
  };

const handleAddTask = (role) => {
  setSelectedRole(role);
  setIsModalOpen(true);
};



  if (loading) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 animate-pulse">Memuat detail project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-[50vh]">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-gray-500">Project tidak ditemukan</p>
        <Link to="/projects" className="mt-4 text-blue-600 hover:underline">
          Kembali ke Projects
        </Link>
      </div>
    );
  }



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
              {/* Label Status Dinamis */}
               <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(currentCalculatedStatus)}`}>
              {currentCalculatedStatus}
            </span>
            </div>
            <p className="text-gray-500 max-w-2xl">{project.client_name}</p>
            <p className="text-brown-500 max-w-2xl">{project.description}</p>
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-500"/>
                <span className="font-medium">
                  Deadline : {new Date(project.deadline).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-purple-500"/>
                <span className="font-medium">Total Tasks: {project.tasks?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TASK BOARD (3 ROLES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  
        {/* UI/UX COLUMN */}
        <RoleColumn 
          title="UI/UX Design" 
          icon={Layout} 
          // Hapus filter status, biarkan RoleColumn yang mengelola inside
          tasks={project.tasks?.filter(t => t.role === 'uiux') || []}
          onAddTask={() => handleAddTask('uiux')}
          project={project}
          onTaskStatusChange={handleTaskStatusChange}
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
          tasks={project.tasks?.filter(t => t.role === 'backend') || []}
          onAddTask={() => handleAddTask('backend')}
          project={project}
          onTaskStatusChange={handleTaskStatusChange}
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
          tasks={project.tasks?.filter(t => t.role === 'frontend') || []}
          onAddTask={() => handleAddTask('frontend')}
          project={project}
          onTaskStatusChange={handleTaskStatusChange}
          colorTheme={{
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-100"
          }}
        />
      </div>
      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project.id}
        setSelectedRole={selectedRole}
        onTaskAdded={handleTaskAdded}
      />
    </div>

  );

}