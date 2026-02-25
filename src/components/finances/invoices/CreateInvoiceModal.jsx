import React, { useState, useEffect } from "react";
import { X, Save, FilePlus2, Mail, Phone, Database, Trash2, PlusCircle } from "lucide-react";
import { toast } from "react-toastify"; 
import api from "../../../api";

export default function CreateInvoiceModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  
  // State untuk Integrasi RAB
  const [availableRabItems, setAvailableRabItems] = useState([]);
  const [selectedRabIds, setSelectedRabIds] = useState([]);
  
  const initialFormData = {
    invoice_id: "",
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: "",
    items: [], // Mulai dengan array kosong
    status: "Unpaid",
    client_email: "",
    client_phone: "",
    project_id: "", 
  };
  
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setAvailableRabItems([]);
      setSelectedRabIds([]);

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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === 'project_id') {
        const selectedProject = projects.find(p => p.id === parseInt(value));
        if (selectedProject) {
            newFormData.invoice_id = `GDNV-${selectedProject.project_code}`;
            // Fetch RAB Items saat project dipilih
            fetchRabItems(selectedProject.project_code);
        } else {
            newFormData.invoice_id = '';
            setAvailableRabItems([]);
        }
    }
    
    setFormData(newFormData);
  };

  const fetchRabItems = async (projectCode) => {
    try {
        const response = await api.get(`/api/finance/invoices/projects/${projectCode}/invoice-items`);
        setAvailableRabItems(response.data.data || []);
    } catch (error) {
        console.warn("Gagal mengambil data RAB untuk project ini.");
        setAvailableRabItems([]);
    }
  };

  const toggleRabItem = (rabItem) => {
    if (selectedRabIds.includes(rabItem.id)) {
        setSelectedRabIds(prev => prev.filter(id => id !== rabItem.id));
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(i => i._rabId !== rabItem.id)
        }));
    } else {
        setSelectedRabIds(prev => [...prev, rabItem.id]);
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { 
                description: rabItem.description, 
                amount: rabItem.rate, 
                _rabId: rabItem.id, // Flag untuk membedakan item RAB
                isRab: true 
            }]
        }));
    }
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
        items: [...prev.items, { description: '', amount: '', isRab: false }]
    }));
  };

  const removeItem = (index) => {
    const itemToRemove = formData.items[index];
    if (itemToRemove._rabId) {
        setSelectedRabIds(prev => prev.filter(id => id !== itemToRemove._rabId));
    }
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
      })).filter(item => item.description && item.rate > 0),
    };

    if (!payload.project_id || !payload.invoice_date || !payload.due_date || payload.invoice_items.length === 0) {
        toast.error("Harap isi semua field wajib dan minimal satu item.");
        setLoading(false);
        return;
    }
    
    try {
      await api.post('/api/finance/invoices', payload);
      toast.success("Invoice berhasil dibuat! 🎉");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat invoice.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FilePlus2 className="text-blue-600" size={20}/> 
              Buat Invoice Baru
            </h3>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 text-gray-400 hover:text-red-500 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-6">
          <form id="createInvoiceForm" onSubmit={handleSubmit} className="flex-grow space-y-6">
            
            {/* INFORMASI PROJECT & CLIENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project *</label>
                  <select name="project_id" value={formData.project_id} onChange={handleChange} className="w-full input-style" required>
                      <option value="">Pilih Project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name} ({project.client_name})</option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Invoice *</label>
                  <input type="date" name="invoice_date" value={formData.invoice_date} onChange={handleChange} className="w-full input-style" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jatuh Tempo *</label>
                  <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full input-style" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Client Email *</label>
                  <input type="email" name="client_email" value={formData.client_email} onChange={handleChange} className="w-full input-style" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Client Phone</label>
                  <input type="tel" name="client_phone" value={formData.client_phone} onChange={handleChange} className="w-full input-style" />
                </div>
            </div>

            {/* INVOICE ITEMS LIST */}
            <div>
                 <label className="block text-sm font-bold text-gray-800 mb-3 pb-2 border-b">Invoice Items *</label>
                 <div className="space-y-3">
                    {formData.items.map((item, index) => (
                        <div key={index} className={`flex items-start gap-2 p-3 rounded-lg border ${item.isRab ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                            <div className="flex-grow">
                                <textarea 
                                    name="description" 
                                    value={item.description} 
                                    onChange={(e) => handleItemChange(index, e)} 
                                    rows={2}
                                    placeholder="Deskripsi" 
                                    className={`w-full text-sm bg-transparent border-none focus:ring-0 p-0 resize-none ${item.isRab ? 'cursor-not-allowed text-blue-800' : ''}`} 
                                    readOnly={item.isRab}
                                    required 
                                />
                                <input 
                                    type="number" 
                                    name="amount" 
                                    value={item.amount} 
                                    onChange={(e) => handleItemChange(index, e)} 
                                    placeholder="Amount" 
                                    className={`w-full mt-1 text-sm font-bold bg-transparent border-none focus:ring-0 p-0 ${item.isRab ? 'cursor-not-allowed text-blue-900' : ''}`} 
                                    readOnly={item.isRab}
                                    required 
                                />
                            </div>
                            <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 p-1">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                 </div>
                 {/*<button type="button" onClick={addItem} className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-800">
                    <PlusCircle size={16}/> Tambah Custom Item
                 </button>*/}
            </div>
          </form>

          {/* SIDEBAR: IMPORT RAB */}
          <div className="w-full md:w-80 border-l pl-0 md:pl-6">
              <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
                  <Database size={16} className="text-blue-600"/> Import dari RAB
              </h4>
              {availableRabItems.length > 0 ? (
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                      {availableRabItems.map(item => (
                          <label key={item.id} className={`block p-3 rounded-lg border cursor-pointer transition-all ${selectedRabIds.includes(item.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                              <input 
                                  type="checkbox" 
                                  className="hidden" 
                                  checked={selectedRabIds.includes(item.id)}
                                  onChange={() => toggleRabItem(item)}
                              />
                              <p className="text-xs font-bold leading-tight mb-1">{item.description}</p>
                              <div className="flex justify-between items-center mt-2">
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${selectedRabIds.includes(item.id) ? 'bg-blue-500' : 'bg-gray-100 text-gray-600'}`}>{item.type}</span>
                                  <span className="text-xs font-mono">Rp {item.rate.toLocaleString('id-ID')}</span>
                              </div>
                          </label>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-xs text-gray-400">Pilih project untuk melihat data RAB</p>
                  </div>
              )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} disabled={loading} className="px-5 py-2.5 btn-secondary">Batal</button>
          <button type="submit" form="createInvoiceForm" disabled={loading} className="px-6 py-2.5 btn-primary flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            Buat Invoice
          </button>
        </div>
      </div>
    </div>
  );
}