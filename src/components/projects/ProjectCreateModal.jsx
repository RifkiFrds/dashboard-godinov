import React, { useState, useEffect } from "react";
import { X, Save, FolderGit2, Calendar, Layout, Server, Code, Clock, AlignLeft } from "lucide-react";
import { toast } from "react-toastify"; 
import api from "../../api"; 

export default function ProjectCreateModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: "",
    status: "Planning",
    budget: "",
    // Estimasi jam kerja per role (penting untuk tracking progress)
    estimates: {
      uiux: 0,
      backend: 0,
      frontend: 0
    }
  });

  // Total jam otomatis dihitung untuk estimasi scope project
  const totalHours = Number(formData.estimates.uiux) + Number(formData.estimates.backend) + Number(formData.estimates.frontend);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEstimateChange = (role, value) => {
    setFormData(prev => ({
      ...prev,
      estimates: {
        ...prev.estimates,
        [role]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulasi API Call ke Laravel
      // POST /api/projects
      // Payload akan dikirim beserta 'estimates' agar Backend bisa generate task placeholder
      await api.post("/api/projects", formData);
      
      toast.success("Project baru berhasil dibuat!");
      onSuccess(); // Refresh list di halaman utama
      onClose();   // Tutup modal
      
      // Reset Form
      setFormData({
        name: "", description: "", deadline: "", status: "Planning", budget: "",
        estimates: { uiux: 0, backend: 0, frontend: 0 }
      });
    } catch (error) {
      console.error("Create project error:", error);
      toast.error("Gagal membuat project.");
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
              Initiate New Project
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Definisikan scope, deadline, dan alokasi tim.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="createProjectForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* SECTION 1: GENERAL INFO */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Project</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Super App Finance 2.0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    <Calendar size={14}/> Deadline Target
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                    required
                  />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estimasi Budget (IDR)</label>
                   <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Opsional"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <AlignLeft size={14}/> Deskripsi & Scope
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

            {/* SECTION 2: RESOURCE ESTIMATION*/}
            <div>
              <div className="flex items-center justify-between mb-3">
                 <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                   <Clock size={16} className="text-gray-500"/> Resource Estimation (Hours)
                 </h4>
                 <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                   Total Scope: {totalHours} Jam
                 </span>
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
                    value={formData.estimates.uiux}
                    onChange={(e) => handleEstimateChange('uiux', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500/20 outline-none text-sm font-semibold text-gray-700"
                  />
                </div>

                {/* Backend Input */}
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <label className="flex items-center gap-2 text-xs font-bold text-orange-700 mb-2">
                    <Server size={14}/> Backend Dev
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimates.backend}
                    onChange={(e) => handleEstimateChange('backend', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500/20 outline-none text-sm font-semibold text-gray-700"
                  />
                </div>

                {/* Frontend Input */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <label className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-2">
                    <Code size={14}/> Frontend Dev
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimates.frontend}
                    onChange={(e) => handleEstimateChange('frontend', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-semibold text-gray-700"
                  />
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 italic">
                *Estimasi ini akan digunakan untuk mengukur persentase progres di dashboard.
              </p>
            </div>

          </form>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-gray-200"
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
              <span className="animate-pulse">Menyimpan...</span>
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