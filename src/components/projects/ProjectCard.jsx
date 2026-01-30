import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { 
  Layout, Server, Code, Calendar, MoreVertical, 
  Users, Edit2, Trash2, X 
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api";
import RoleProgressBar from "./ProjectProgressBar";
import { getDynamicStatus, getStatusColor } from "./utils/projectHelpers";

const ProjectCard = ({ project, onSelect, onDeleteSuccess, onUpdateSuccess }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ ...project });
  const [loading, setLoading] = useState(false);
  
  const menuRef = useRef(null);
  const displayStatus = getDynamicStatus(project);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Hapus proyek "${project.name}"?`)) {
      try {
       const response = await api.delete(`/api/projects/${project.id}`);
        if (response.status === 200 || response.data?.success){
        toast.success("Berhasil dihapus");
        }
        if (onDeleteSuccess) {
          onDeleteSuccess(project.id);
        }
      } catch (err) { 
          toast.error("Gagal menghapus");
          console.error(err); 
      }
    }
    setShowMenu(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    
    try {
      const response = await api.put(`/api/projects/${project.id}`, formData);
      
      if (response.data.success) {
        toast.success("Proyek diperbarui!");
        setShowEditModal(false);
        
        if (onUpdateSuccess) {
          onUpdateSuccess(response.data.data); 
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui proyek");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <Link to={`/projects/${project.id}`}>
          <div 
            onClick={() => onSelect(project)}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(displayStatus)}`}>
                  {displayStatus}
                </span>
                <h3 className="mt-2 text-lg font-bold text-gray-800 group-hover:text-blue-600">{project.name}</h3>
                <h4 className="text-sm text-gray-400">{project.client_name}</h4>
              </div>
              
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                >
                  <MoreVertical size={18} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-50">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEditModal(true); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-50"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3 mb-6 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
               <RoleProgressBar label="UI/UX" percentage={project.progress?.uiux || 0} icon={Layout} colorClass="bg-purple-500" bgClass="bg-purple-100" />
               <RoleProgressBar label="Backend" percentage={project.progress?.backend || 0} icon={Server} colorClass="bg-orange-500" bgClass="bg-orange-100" />
               <RoleProgressBar label="Frontend" percentage={project.progress?.frontend || 0} icon={Code} colorClass="bg-blue-500" bgClass="bg-blue-100" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-[10px] text-gray-500">
              <div className="flex items-center gap-1"><Calendar size={12}/> {project.deadline}</div>
              <div className="flex items-center gap-1"><Users size={12}/> {project.team_count} Members</div>
            </div>
          </div>
        </Link>
      </div>

      {/* MODAL EDIT */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Edit Project</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Client Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none h-24"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;