import React, { useState, useEffect } from "react";
import { X, Save, FilePlus2, Mail, Phone } from "lucide-react";
import { toast } from "react-toastify"; 
import api from "../../../api";

export default function CreateInvoiceModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  
  const initialFormData = {
    invoice_id: "",
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: "",
    items: [{ description: '', amount: '' }],
    status: "Unpaid",
    client_email: "",
    client_phone: "",
    project_id: "", 
  };
  
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData); // Reset form on open

      const fetchProjects = async () => {
        try {
          const response = await api.get('/api/projects');
          if (response.data && response.data.data) {
            setProjects(response.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch projects:", error);
          toast.error("Gagal memuat daftar project.");
        }
      };

      fetchProjects();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let newFormData = { ...formData, [name]: value };

    if (name === 'project_id') {
        const selectedProject = projects.find(p => p.id === parseInt(value));
        if (selectedProject) {
            newFormData.invoice_id = `GDNV-${selectedProject.project_code}`;
        } else {
            newFormData.invoice_id = '';
        }
    }
    
    setFormData(newFormData);
  };
  
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...formData.items];
    items[index][name] = value;
    setFormData(prev => ({ ...prev, items }));
  };

  const addItem = () => {
    setFormData(prev => ({
        ...prev,
        items: [...prev.items, { description: '', amount: '' }]
    }));
  };

  const removeItem = (index) => {
    const items = [...formData.items];
    items.splice(index, 1);
    setFormData(prev => ({...prev, items}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      project_id: parseInt(formData.project_id), 
      client_email: formData.client_email,
      client_phone: formData.client_phone,
      invoice_date: formData.invoice_date,
      due_date: formData.due_date,
      payment_status: formData.status,
      invoice_items: formData.items.map(item => ({
        description: item.description,
        rate: parseFloat(item.amount) || 0,
        unit: 1,
        discount: 0,
      })).filter(item => item.description && item.rate > 0), // Ensure items are valid
    };

    if (!payload.project_id || !payload.invoice_date || !payload.due_date || payload.invoice_items.length === 0) {
        toast.error("Harap isi semua field yang wajib diisi dan tambahkan minimal satu item invoice.");
        setLoading(false);
        return;
    }
    
    try {
      await api.post('/api/finance/invoices', payload);
      toast.success("Invoice berhasil dibuat! 🎉");
      onSuccess(); // Trigger refetch in parent
      onClose();   // Close modal
    } catch (error) {
      console.error("Gagal membuat invoice:", error);
      const errorMessage = error.response?.data?.message || "Gagal membuat invoice.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FilePlus2 className="text-blue-600" size={20}/> 
              Buat Invoice Baru
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Buat tagihan baru untuk project yang sudah ada.</p>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="createInvoiceForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* PROJECT SELECTION */}
            <h4 className="text-base font-bold text-gray-800 border-b pb-2">Informasi Project</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project <span className="text-red-500">*</span></label>
                  <select name="project_id" value={formData.project_id} onChange={handleChange} className="w-full input-style" required>
                      <option value="">Pilih Project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name} ({project.client_name})
                        </option>
                      ))}
                  </select>
                </div>
            </div>

            <hr className="border-gray-100" />
            
            {/* INVOICE DETAILS */}
            <h4 className="text-base font-bold text-gray-800 border-b pb-2">Detail Invoice</h4>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Invoice ID</label>
                  <input type="text" name="invoice_id" value={formData.invoice_id} className="w-full input-style bg-gray-100" readOnly />
                </div>
                 <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Invoice <span className="text-red-500">*</span></label>
                  <input type="date" name="invoice_date" value={formData.invoice_date} onChange={handleChange} className="w-full input-style" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jatuh Tempo <span className="text-red-500">*</span></label>
                  <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full input-style" required />
                </div>
             </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5"><Mail size={14}/> Client Email <span className="text-red-500">*</span></label>
                  <input type="email" name="client_email" value={formData.client_email} onChange={handleChange} placeholder="contact@company.com" className="w-full input-style" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5"><Phone size={14}/> Client Phone</label>
                  <input type="tel" name="client_phone" value={formData.client_phone} onChange={handleChange} placeholder="0812-3456-7890" className="w-full input-style" />
                </div>
              </div>
            <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Invoice Items <span className="text-red-500">*</span></label>
                 <div className="space-y-2">
                    {formData.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="text" name="description" value={item.description} onChange={(e) => handleItemChange(index, e)} placeholder="Deskripsi item" className="w-full input-style" required />
                            <input type="number" name="amount" value={item.amount} onChange={(e) => handleItemChange(index, e)} placeholder="Jumlah" className="w-1/3 input-style" required />
                            <button type="button" onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-md">&times;</button>
                        </div>
                    ))}
                 </div>
                 {formData.items.length === 0 && <p className="text-xs text-red-500 mt-1">Harap tambahkan minimal satu item invoice.</p>}
                 <button type="button" onClick={addItem} className="mt-2 text-sm text-blue-600 hover:underline">+ Tambah Item</button>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} disabled={loading} className="px-5 py-2.5 btn-secondary">Batal</button>
          <button type="submit" form="createInvoiceForm" disabled={loading} className="inline-flex items-center gap-2 px-6 py-2.5 btn-primary">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Membuat...</span></>
            ) : (
              <><Save size={16} /> Buat Invoice</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
