import React, { useState } from "react";
import { X, Save, FolderGit2, Calendar, Layout, Server, Code, Clock, AlignLeft } from "lucide-react";
import { toast } from "react-toastify"; 
import api from "../../api"; 

export default function ProjectCreateModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    project_code: "",
    name: "",
    description: "",
    client_name: "",
    service_type: "",
    deadline: "",
    status: "Planning",
    team_count: 0,
    // Progress initial (akan diupdate otomatis berdasarkan tasks)
    progress: {
      uiux: 0,
      backend: 0,
      frontend: 0
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProgressChange = (role, value) => {
    setFormData(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [role]: Number(value)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validasi project_code
      if (!formData.project_code || formData.project_code.trim() === "") {
        toast.error("Project code harus diisi!");
        setLoading(false);
        return;
      }

      // POST ke API
      const response = await api.post("/api/projects", {
        project_code: formData.project_code.toUpperCase(),
        name: formData.name,
        description: formData.description,
        client_name: formData.client_name,
        service_type: formData.service_type,
        deadline: formData.deadline,
        status: formData.status,
        team_count: Number(formData.team_count) || 0,
        progress: formData.progress
      });
      
      if (response.data.success) {
        toast.success("Project baru berhasil dibuat! 🎉");
        onSuccess(); // Refresh list di halaman utama
        onClose();   // Tutup modal
        
        // Reset Form
        setFormData({
          project_code: "",
          name: "",
          description: "",
          client_name: "",
          service_type: "",
          deadline: "",
          status: "Planning",
          team_count: 0,
          progress: { uiux: 0, backend: 0, frontend: 0 }
        });
      }
    } catch (error) {
      console.error("Create project error:", error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 422) {
        // Validation errors
        const errors = error.response.data.errors;
        Object.values(errors).flat().forEach(err => toast.error(err));
      } else {
        toast.error("Gagal membuat project. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FolderGit2 className="text-blue-600" size={20}/> 
              Create New Project
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Definisikan scope, deadline, dan alokasi tim.</p>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="createProjectForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* SECTION 1: GENERAL INFO */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Project Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="project_code"
                    value={formData.project_code}
                    onChange={handleChange}
                    placeholder="e.g., GDN-IND1945"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all uppercase"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Kode unik untuk client tracking</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nama Project <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E-Commerce Platform"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    placeholder="PT. Technology Indonesia"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  >
                    <option value="">Pilih Service</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Enterprise System">Enterprise System</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    <Calendar size={14}/> Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Team Size</label>
                  <input
                    type="number"
                    name="team_count"
                    value={formData.team_count}
                    onChange={handleChange}
                    min="0"
                    placeholder="5"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <AlignLeft size={14}/> Deskripsi Project <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Jelaskan tujuan project dan deliverable utamanya..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all resize-none"
                  required
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* SECTION 2: INITIAL PROGRESS (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Clock size={16} className="text-gray-500"/> Initial Progress (Optional)
                </h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* UI/UX Input */}
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <label className="flex items-center gap-2 text-xs font-bold text-purple-700 mb-2">
                    <Layout size={14}/> UI/UX Design
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress.uiux}
                    onChange={(e) => handleProgressChange('uiux', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500/20 outline-none text-sm font-semibold text-gray-700"
                  />
                  <span className="text-xs text-purple-600 mt-1 block">%</span>
                </div>

                {/* Backend Input */}
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <label className="flex items-center gap-2 text-xs font-bold text-orange-700 mb-2">
                    <Server size={14}/> Backend Dev
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress.backend}
                    onChange={(e) => handleProgressChange('backend', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500/20 outline-none text-sm font-semibold text-gray-700"
                  />
                  <span className="text-xs text-orange-600 mt-1 block">%</span>
                </div>

                {/* Frontend Input */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <label className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-2">
                    <Code size={14}/> Frontend Dev
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress.frontend}
                    onChange={(e) => handleProgressChange('frontend', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-semibold text-gray-700"
                  />
                  <span className="text-xs text-blue-600 mt-1 block">%</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 italic">
                *Progress akan otomatis ter-update saat task diselesaikan
              </p>
            </div>

          </form>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-gray-200 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            form="createProjectForm"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:transform active:scale-95 transition-all shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save size={16} /> Create Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}