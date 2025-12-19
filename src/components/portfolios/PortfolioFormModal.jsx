import React, { useState, useEffect } from "react";
import { X, Upload, Save, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";

export default function PortfolioFormModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link_projects: "",
    image: null,
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({ title: "", description: "", link_projects: "", image: null });
      setPreview(null);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    if (formData.link_projects) {
      payload.append("link_projects", formData.link_projects);
    }
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {

      const response = await api.post("/api/uploadPortfolio", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Portfolio berhasil ditambahkan");
      onSuccess(); 
      onClose();  
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan portfolio");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Tambah Portfolio Baru</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Project</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Contoh: Redesign Website E-Commerce"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan detail project..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              required
            />
          </div>

          {/* Link Project Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Project (Opsional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon size={16} className="text-gray-400" />
              </div>
              <input
                type="url"
                name="link_projects"
                value={formData.link_projects}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Cover</label>
            
            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Klik untuk upload gambar</p>
                  <p className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={handleImageChange}
                  required
                />
              </label>
            ) : (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => { setPreview(null); setFormData(prev => ({ ...prev, image: null })) }}
                    className="bg-white text-red-600 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:bg-gray-100"
                  >
                    Ganti Gambar
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>Saving...</>
            ) : (
              <>
                <Save size={16} /> Simpan Portfolio
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}