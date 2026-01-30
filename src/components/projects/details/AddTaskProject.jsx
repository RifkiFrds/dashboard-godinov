import React, { useState } from 'react';
import api from '../../../api'
import { toast } from "react-toastify";

const AddTaskModal = ({ isOpen, onClose, projectId, onTaskAdded, setIsModalOpen }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    role: 'uiux',
    priority: 'medium',
    assignee: '',
    note: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await api.post(`/api/projects/${projectId}/tasks`, formData);
      onTaskAdded(response.data.data); 
      setFormData({ title: '', role: 'uiux', priority: 'medium', assignee: '', note: '', });
      onClose(); 
      toast.success("Task berhasil dibuat!");
  } catch (error) {
    console.error("Validation Error:", error.response?.data);
    toast.error("Cek kembali inputan anda");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Add New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Design Landing Page"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="uiux">UI/UX</option>
                <option value="backend">Backend</option>
                <option value="frontend">Frontend</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
             <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange}
                className="..."
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
            <input
              required
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <input
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Note"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Footer/Action */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;