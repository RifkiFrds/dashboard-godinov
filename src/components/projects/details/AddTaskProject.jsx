import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { toast } from "react-toastify";
import { X, Loader2, Target, User, MessageSquare, ListTodo } from "lucide-react";
import { useAuth } from "../../../api/AuthContext";

const AddTaskModal = ({ isOpen, onClose, projectId, onTaskAdded }) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [usersList, setUsersList] = useState([]); // Daftar user dari API
  
  const [formData, setFormData] = useState({
    title: '',
    role: 'uiux',
    priority: 'Medium',
    assignee: '', // Ini akan menyimpan NAMA user
    note: '',
  });

  // 1. Fetch daftar user saat modal dibuka
  useEffect(() => {
    const fetchUsers = async () => {
      setFetchingUsers(true);
      try {
        // Sesuaikan endpoint ini dengan API Anda (misal mengambil semua staff)
        const response = await api.get('/api/auth/users'); 
        const data = response.data?.data || response.data;
        // Filter agar tidak muncul Admin di daftar tugas jika perlu
        setUsersList(data);
      } catch (error) {
        console.error("Gagal mengambil daftar user:", error);
      } finally {
        setFetchingUsers(false);
      }
    };

    if (isOpen) fetchUsers();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 2. Logika Otomatis: Jika Assignee dipilih, Role menyesuaikan
    if (name === 'assignee') {
      const selectedUser = usersList.find(u => u.name === value);
      setFormData(prev => ({
        ...prev,
        assignee: value,
        // Jika user ditemukan, ambil rolenya. Jika tidak, tetap prev.
        role: selectedUser ? selectedUser.role : prev.role 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assignee) return toast.error("Pilih penanggung jawab!");
    
    setLoading(true);
    try {
      const response = await api.post(`/api/projects/${projectId}/tasks`, formData);
      
      if (response.data.success) {
        const newTaskWithAssigner = {
          ...response.data.data,
          assigned_by_name: currentUser.name 
        };

        onTaskAdded(newTaskWithAssigner);
        //reset form
        setFormData({
          title: '',
          role: '',
          priority: 'Medium',
          assignee: '',
          note: '',
        });
        onClose();
        toast.success("Task berhasil didelegasikan!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-blue-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <ListTodo size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Delegasi Task</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Judul Task */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1.5">
              <Target size={14} /> Judul Task
            </label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Misal: Perbaiki struktur database"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm transition-all"
            />
          </div>

          {/* Assignee Selection (Dropdown) */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1.5">
              <User size={14} /> Pilih Penanggung Jawab
            </label>
            <div className="relative">
              <select
                required
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm appearance-none bg-white cursor-pointer"
              >
                <option value="">-- Pilih Anggota Tim --</option>
                {usersList.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.role?.toUpperCase()})
                  </option>
                ))}
              </select>
              {fetchingUsers && (
                <Loader2 size={16} className="absolute right-10 top-3 animate-spin text-blue-500" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Role - Auto Updated */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Role Terdeteksi</label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 font-medium">
                {formData.role || '-'}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Prioritas</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-1.5">
              <MessageSquare size={14} /> Instruksi Khusus
            </label>
            <textarea
              name="note"
              rows="3"
              value={formData.note}
              onChange={handleChange}
              placeholder="Jelaskan detail tugas yang harus dikerjakan..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm resize-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || fetchingUsers}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Mengirim...</>
              ) : (
                'Delegasikan Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;