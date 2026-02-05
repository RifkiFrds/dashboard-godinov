import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { 
  ChevronRight, Plus, Calendar, Filter, ArrowLeft, 
  CheckCircle2, Clock, Circle, AlertCircle, Layout, Code, Server, 
  MoreHorizontal, Trash2 
} from "lucide-react";
import { H2 } from "../../components/ui/Text";
import AddTaskModal from '../../components/projects/details/AddTaskProject';
import TimerModal from '../../components/projects/details/TimerModal';
import ConfirmStartModal from '../../components/projects/details/ConfirmStartModal';
import OtpVerificationModal from '../../components/projects/details/OtpVerificationModal';
import TaskCard from '../../components/projects/details/TaskCard';
import { toast } from "react-toastify";
import api from "../../api";
import { useAuth } from "../../api/AuthContext"; // Import Auth
import { getDynamicStatus, getStatusColor } from "../../components/projects/utils/projectHelpers";

// --- SUB-COMPONENTS ---

const KanbanColumn = ({ status, tasks, icon: Icon, colorClass, project, onTaskStatusChange, onAddTask, onOpenOtp }) => {
  const { user } = useAuth();//ambil data user
  const canCreateTask = user?.role === 'admin' || user?.role === 'pm';//validasi role

  return (
    <div className="flex-1 min-w-[300px] flex flex-col bg-gray-50/50 rounded-2xl border border-gray-200 h-full min-h-[500px]">
      {/* Header Kolom */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${colorClass}`}>
            <Icon size={18} />
          </div>
          <span className="font-bold text-gray-700">{status}</span>
          <span className="ml-2 bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        {status === "Todo" && canCreateTask && (
           <button 
             onClick={onAddTask} 
             className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-blue-600 transition-colors"
             title="Tambah Task Baru"
           >
             <Plus size={20} />
           </button>
        )}
      </div>

      {/* Area Droppable */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`p-3 flex-1 transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/30' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index} 
                projectStatus={project?.status}
                onOpenOtp={onOpenOtp}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};



// --- MAIN COMPONENT ---
export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //timer state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  //pending task state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingTaskMove, setPendingTaskMove] = useState(null);
  const [activeTaskForOtp, setActiveTaskForOtp] = useState(null);

  const canCreateTask = user?.role === 'admin' || user?.role === 'pm';
  const isManager = user?.role === 'admin' || user?.role === 'pm';

  const fetchProjectDetail = async () => {
    try {
      const response = await api.get(`/api/projects/${id}`);
      if (response.data.success) setProject(response.data.data);
    } catch (error) {
      toast.error("Gagal memuat detail project");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => { fetchProjectDetail(); }, [id]);

  const handleTaskFinish = async (taskId, totalSeconds) => {
    try {
      const response = await api.post(`/api/projects/${id}/tasks/${taskId}/complete`, {
        duration: totalSeconds,
        status: 'Done'
      });

      if (response.data.success) {
        toast.success(`Berhasil! Waktu kerja: ${totalSeconds} detik`);
        setIsTimerModalOpen(false);
        await fetchProjectDetail();
      }
    } catch (error) {
      toast.error("Gagal menyimpan progress", error);
    }
  };

const handleOtpVerify = async (otpCode) => {

  // Cek apakah data sudah ada
  if (!pendingTaskMove || !pendingTaskMove.taskId) {
    toast.error("Data task tidak ditemukan, silakan coba klik lagi tombol di card.");
    return;
  }

  try {
    // Pastikan URL menggunakan pendingTaskMove.taskId
    const response = await api.post(`/api/projects/${id}/tasks/${pendingTaskMove.taskId}/verify-otp`, {
      otp: otpCode,
    });

    if (response.data.success) {
      toast.success("Otorisasi Berhasil!");
      setIsOtpModalOpen(false);
      setPendingTaskMove(null); // Bersihkan state setelah berhasil
      fetchProjectDetail(); // Refresh Kanban
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Kode OTP Salah!");
  }
};

const handleResendOtp = async () => {
  if (!pendingTaskMove?.taskId) return;
  
  try {
    await api.post(`/api/projects/${id}/tasks/${pendingTaskMove.taskId}/request-otp`);
    toast.info("Kode OTP baru telah dikirim ke PM.");
  } catch (error) {
    toast.error("Gagal mengirim ulang OTP");
  }
};

  const openOtpModal = (task) => {
    setPendingTaskMove({ 
      taskId: task.id, 
      toStatus: 'Done' 
    });

    setIsOtpModalOpen(true);
  };

  if (loading || authLoading) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Menyiapkan dashboard anda...</p>
      </div>
    );
  }

  if (!user) {
   return <div className="p-10 text-center">Silahkan login kembali.</div>;
  }

  const onDragEnd = async (result) => {
   const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    // AMBIL DATA TASK DARI STATE PROJECT
    const draggedTask = project.tasks.find(t => t.id.toString() === draggableId);

    // PROTEKSI: Jika status saat ini adalah Blocked, batalkan drag
    if (draggedTask?.status === 'Blocked') {
      toast.warning("Task ini sedang terkunci. Masukkan OTP untuk melanjutkan.");
      return;
    }

    const sourceStatus = source.droppableId;
    const newStatus = destination.droppableId;
    const isManager = user?.role === 'admin' || user?.role === 'pm';
    
    // Logika Skip Step (Todo -> Done)
    if (sourceStatus === 'Todo' && newStatus === 'Done' && !isManager) {
        setPendingTaskMove({ taskId: draggableId, toStatus: 'Done' });
        // Request OTP ke server
        await api.post(`/api/projects/${id}/tasks/${draggableId}/request-otp`);
        setIsOtpModalOpen(true);
        fetchProjectDetail(); // Refresh agar status berubah jadi 'Blocked' di UI
        return;
    }

    // Cek: Jika ditarik ke "In Progress" DAN yang narik adalah Staff (Bukan PM/Admin)
    if (newStatus === 'In Progress' && !isManager) {
        const task = project.tasks.find(t => t.id.toString() === draggableId);
        setActiveTask(task);
        setIsConfirmModalOpen(true);
        return;
    }

    // --- Sisanya untuk update status normal (Todo ke Done atau sebaliknya oleh Admin) ---
    const updatedTasks = project.tasks.map(t => 
      t.id.toString() === draggableId ? { ...t, status: newStatus } : t
    );
    setProject({ ...project, tasks: updatedTasks });

    try {
      await api.patch(`/api/projects/${id}/tasks/${draggableId}`, { status: newStatus });
      toast.success(`Status diperbarui ke ${newStatus}`, { autoClose: 1000 });
      // Update progress project secara otomatis setelah pindah status
      fetchProjectDetail(); 
    } catch (error) {
      toast.error("Gagal sinkronisasi ke server");
      fetchProjectDetail();
    }
  };

  if (loading) return <div className="p-10 text-center">Memuat...</div>;
  if (!project) return <div className="p-10 text-center">Project tidak ditemukan.</div>;

 // 1. Kelompokkan tugas berdasarkan Assignee (Untuk Admin/PM)
  const groupedByAssignee = project?.tasks?.reduce((acc, task) => {
    if (!acc[task.assignee]) acc[task.assignee] = [];
    acc[task.assignee].push(task);
    return acc;
  }, {}) || {};


  const myTasks = user?.role === 'admin' 
    ? project?.tasks 
    : project?.tasks?.filter(t => t.role === user.role) || [];

  return (
    <div className="min-h-screen pb-10">
      {/* Breadcrumbs & Header */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/projects" className="hover:text-blue-600 flex items-center gap-2">
          <ArrowLeft size={16} /> Projects
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="font-semibold text-gray-800">{project.name}</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <H2>{project.name}</H2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(getDynamicStatus(project))}`}>
                {getDynamicStatus(project)}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">{project.client_name}</p>
            <div className="flex gap-4 mt-4 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(project.deadline).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Filter size={14}/> Role Anda: <span className="text-blue-600 uppercase">{user.role}</span></span>
            </div>
          </div>
          
          {/* Icon Role Display */}
          <div className="hidden md:flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            {user.role === 'uiux' && <Layout className="text-purple-500 mb-1" />}
            {user.role === 'backend' && <Server className="text-orange-500 mb-1" />}
            {user.role === 'frontend' && <Code className="text-blue-500 mb-1" />}
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.role} Board</span>
          </div>
        </div>
      </div>

    {isManager ? (
        /* --- VIEW ADMIN / PM: Berdasarkan Personel --- */
        <div className="space-y-8">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Layout size={20} className="text-blue-600" />
              Monitoring Semua Tim
            </h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              <Plus size={18} /> Tambah Task Tim
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {Object.keys(groupedByAssignee).map((assigneeName) => (
              <div key={assigneeName} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {assigneeName.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-700">{assigneeName}</span>
                    <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full uppercase">
                      {groupedByAssignee[assigneeName][0]?.role}
                    </span>
                  </div>
                </div>
                
                {/* Mini Kanban per Personel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50/30">
                  {['Todo', 'In Progress', 'Done'].map(status => (
                    <div key={status} className="bg-white p-3 rounded-xl border border-gray-100 min-h-[150px]">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex justify-between">
                        {status}
                        <span>{groupedByAssignee[assigneeName].filter(t => t.status === status).length}</span>
                      </h4>
                      <div className="space-y-3">
                      {groupedByAssignee[assigneeName]
                        .filter(t => t.status === status)
                        .map((task, idx) => (
                          <TaskCard 
                             key={task.id} 
                             task={task} 
                             index={idx} 
                             isDraggable={false}
                             onOpenOtp={openOtpModal}
                          />
                        ))
                      }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* --- VIEW STAFF: Kanban Board Biasa --- */
        <DragDropContext onDragEnd={onDragEnd}>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
          <KanbanColumn 
            status="Todo" 
            tasks={myTasks.filter(t => t.status === 'Todo' || t.status === 'Blocked')}
            icon={Circle} 
            colorClass="bg-gray-100 text-gray-500"
            project={project}
            onAddTask={() => setIsModalOpen(true)}
            onOpenOtp={openOtpModal}
          />
          <KanbanColumn 
            status="In Progress" 
            tasks={myTasks.filter(t => t.status === 'In Progress')} 
            icon={Clock} 
            colorClass="bg-blue-50 text-blue-600"
            project={project}
            onOpenOtp={openOtpModal}
          />
          <KanbanColumn 
            status="Done" 
            tasks={myTasks.filter(t => t.status === 'Done')} 
            icon={CheckCircle2} 
            colorClass="bg-green-50 text-green-600"
            project={project}
            onOpenOtp={openOtpModal}
          />
        </div>
        </DragDropContext>
      )}

      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project.id}
        setSelectedRole={user.role} // Otomatis set role sesuai user
        onTaskAdded={fetchProjectDetail}
      />

      <ConfirmStartModal 
        isOpen={isConfirmModalOpen}
        task={activeTask}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setActiveTask(null);
        }}
        onConfirm={() => {
          setIsConfirmModalOpen(false); // Tutup peringatan
          setIsTimerModalOpen(true);    // Buka timer
        }}
      />

     <OtpVerificationModal 
        isOpen={isOtpModalOpen}
        onCancel={() => {
          setIsOtpModalOpen(false);
          setPendingTaskMove(null); // Reset data task yang tertunda
        }}
        onVerify={handleOtpVerify}
        onResend={handleResendOtp}
      />

      <TimerModal 
        isOpen={isTimerModalOpen}
        task={activeTask} 
        onClose={() => {
          setIsTimerModalOpen(false);
          setActiveTask(null);
        }}
        onFinish={handleTaskFinish} // Fungsi untuk kirim data ke Laravel
      />
    </div>
  );
}