import React, { useState, useEffect } from "react";
import { X, Save, Link as LinkIcon, Type, AlignLeft } from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";

export default function EditPortfolioModal({ isOpen, onClose, onSuccess, item }) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link_projects: "",
  });

  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        link_projects: item.link_projects || "",
      });
    }
  }, [isOpen, item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
   e.preventDefault();
    setLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await api.put(`/api/portfolio/${item.id}`, {
      title: formData.title,
      description: formData.description,
      link_projects: formData.link_projects
    });

      toast.success("Portfolio berhasil diperbarui!");
      onSuccess(); 
      onClose();   
    } catch (error) {
      console.error("Update error:", error);
      const errorMsg = error.response?.data?.message || "Gagal memperbarui portfolio";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transition-all transform scale-100">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Edit Portfolio</h3>
            <p className="text-xs text-gray-500">ID Project: #{item?.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Input Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Type size={16} /> Judul Project
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masukkan judul baru..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              required
            />
          </div>

          {/* Input Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <AlignLeft size={16} /> Deskripsi
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Update deskripsi project..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none"
              required
            />
          </div>

          {/* Input Link */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <LinkIcon size={16} /> Link Project
            </label>
            <input
              type="url"
              name="link_projects"
              value={formData.link_projects}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200"
            >
              <Save size={18} />
              {loading ? "Memperbarui..." : "Update Portfolio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}