import React, { useState, useEffect, useMemo } from "react";
import { X, Save, FilePlus2, Database, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify"; 
import api from "../../../api";

// Konfigurasi Standar Termin
const TERMIN_OPTIONS = [
  { id: 't1', label: 'Termin I (DP 30%)', percentage: 0.30, desc: 'Pembayaran Termin I (Down Payment 30%)' },
  { id: 't2', label: 'Termin II (Progress 30%)', percentage: 0.30, desc: 'Pembayaran Termin II (Development Progress 40%)' },
  { id: 't3', label: 'Termin III (Pelunasan 40%)', percentage: 0.40, desc: 'Pembayaran Termin III (Final Handover 30%)' },
  { id: 'full', label: 'Full Payment (100%)', percentage: 1.00, desc: 'Pembayaran Penuh (100%)' },
  { id: 'custom', label: 'Custom Item', percentage: 0, desc: '' }
];

export default function CreateInvoiceModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  
  // State RAB
  const [availableRabItems, setAvailableRabItems] = useState([]);
  const [selectedRabIds, setSelectedRabIds] = useState([]);
  
  // State Termin Mode & Riwayat Penagihan
  const [selectedTermin, setSelectedTermin] = useState('t1');
  const [billedTermins, setBilledTermins] = useState([]); // Menyimpan ID termin yang sudah pernah ditagihkan

  const initialFormData = {
    invoice_id: "",
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: "",
    items: [], 
    status: "Unpaid",
    client_email: "",
    client_phone: "",
    project_id: "", 
  };
  
  const [formData, setFormData] = useState(initialFormData);

  // Menghitung total nilai RAB yang dipilih
  const totalRabSelected = useMemo(() => {
    return availableRabItems
      .filter(item => selectedRabIds.includes(item.id))
      .reduce((sum, item) => sum + item.rate, 0);
  }, [availableRabItems, selectedRabIds]);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setAvailableRabItems([]);
      setSelectedRabIds([]);
      setSelectedTermin('t1'); 
      setBilledTermins([]);

      const fetchProjects = async () => {
        try {
          const response = await api.get('/api/projects');
          if (response.data?.data) {
            setProjects(response.data.data);
          }
        } catch (error) {
          toast.error("Gagal memuat daftar project.");
        }
      };
      fetchProjects();
    }
  }, [isOpen]);

  // Efek untuk memperbarui Invoice Items setiap kali RAB atau Termin berubah
  useEffect(() => {
    if (selectedTermin === 'custom') return; 

    if (selectedRabIds.length === 0) {
        setFormData(prev => ({ ...prev, items: [] }));
        return;
    }

    const terminConfig = TERMIN_OPTIONS.find(t => t.id === selectedTermin);
    if (terminConfig && totalRabSelected > 0) {
        const calculatedAmount = totalRabSelected * terminConfig.percentage;
        setFormData(prev => ({
            ...prev,
            items: [{
                description: terminConfig.desc,
                amount: calculatedAmount,
                isRab: true 
            }]
        }));
    }
  }, [totalRabSelected, selectedTermin]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === 'project_id') {
        const selectedProject = projects.find(p => p.id === parseInt(value));
        if (selectedProject) {
            newFormData.invoice_id = `GDNV-${selectedProject.project_code}`;
            // 1. Fetch RAB Items
            fetchRabItems(selectedProject.project_code);
            // 2. Cek histori invoice sebelumnya untuk mendeteksi termin yang sudah lewat
            fetchBilledHistory(selectedProject.id);
        } else {
            newFormData.invoice_id = '';
            setAvailableRabItems([]);
            setBilledTermins([]);
        }
    }
    setFormData(newFormData);
  };

  const fetchRabItems = async (projectCode) => {
    try {
        const response = await api.get(`/api/finance/invoices/projects/${projectCode}/invoice-items`);
        const fetchedItems = response.data.data || [];
        
        // 1. Simpan data RAB ke state
        setAvailableRabItems(fetchedItems);
        
        // 2. OTOMATIS CENTANG SEMUA: Ekstrak semua ID dan masukkan ke state selected
        const allItemIds = fetchedItems.map(item => item.id);
        setSelectedRabIds(allItemIds);

    } catch (error) {
        console.warn("Gagal mengambil data RAB untuk project ini.");
        setAvailableRabItems([]);
        setSelectedRabIds([]); // Pastikan reset jika gagal
    }
  };

  const fetchBilledHistory = async (projectId) => {
    try {
        // Asumsi rute index invoice mendukung filter berdasarkan project_id
        const response = await api.get(`/api/finance/invoices?project_id=${projectId}`);
        const pastInvoices = response.data.data || [];
        
        let billed = [];
        pastInvoices.forEach(inv => {
            const items = inv.invoice_items || [];
            items.forEach(item => {
                const desc = (item.description || '').toLowerCase();
                // Deteksi cerdas berdasarkan kata kunci
                if (desc.includes('termin i') && !desc.includes('termin ii') && !desc.includes('termin iii')) billed.push('t1');
                if (desc.includes('termin ii') && !desc.includes('termin iii')) billed.push('t2');
                if (desc.includes('termin iii')) billed.push('t3');
                if (desc.includes('penuh') || desc.includes('100%')) billed.push('full');
            });
        });
        
        setBilledTermins(billed);

        // Jika termin 1 sudah, geser otomatis pilihan awal ke termin berikutnya
        if (billed.includes('t1') && !billed.includes('t2')) setSelectedTermin('t2');
        else if (billed.includes('t2') && !billed.includes('t3')) setSelectedTermin('t3');
        else if (billed.includes('t3') || billed.includes('full')) setSelectedTermin('custom');

    } catch (error) {
        console.warn("Gagal mengecek histori termin.", error);
    }
  };

  const toggleRabItem = (id) => {
    setSelectedRabIds(prev => 
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...formData.items];
    items[index][name] = value;
    setFormData(prev => ({ ...prev, items }));
  };

  const addCustomItem = () => {
    setSelectedTermin('custom'); 
    setFormData(prev => ({
        ...prev,
        items: [...prev.items, { description: '', amount: '', isRab: false }]
    }));
  };

  const removeItem = (index) => {
    const items = [...formData.items];
    items.splice(index, 1);
    setFormData(prev => ({...prev, items}));
    
    if (items.length === 0) setSelectedTermin('custom');
  };

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

    if (!payload.project_id || payload.invoice_items.length === 0) {
        toast.error("Harap isi project dan pastikan minimal ada 1 item invoice.");
        setLoading(false);
        return;
    }
    
    try {
      await api.post('/api/finance/invoices', payload);
      toast.success("Invoice berhasil dibuat!");
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FilePlus2 className="text-blue-600" size={20}/> 
              Buat Tagihan (Termin)
            </h3>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 text-gray-400 hover:text-red-500 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-0 overflow-hidden flex flex-col md:flex-row h-full">
          
          {/* BAGIAN KIRI: IMPORT RAB */}
          <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200 p-6 flex flex-col overflow-y-auto custom-scrollbar">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Database size={16} className="text-blue-600"/> 1. Pilih Item dari RAB
              </h4>
              
              <select name="project_id" value={formData.project_id} onChange={handleChange} className="w-full input-style mb-4 font-semibold" required>
                  <option value="">-- Pilih Project --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
              </select>

              {availableRabItems.length > 0 ? (
                  <div className="flex-grow space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                      {availableRabItems.map(item => (
                          <label key={item.id} className={`block p-3 rounded-lg border cursor-pointer transition-all ${selectedRabIds.includes(item.id) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                              <input 
                                  type="checkbox" 
                                  className="hidden" 
                                  checked={selectedRabIds.includes(item.id)}
                                  onChange={() => toggleRabItem(item.id)}
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
                  <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg text-gray-400 text-xs">
                      Silakan pilih project untuk memuat RAB
                  </div>
              )}

              {/* TOTAL ESTIMASI */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Total Nilai Terpilih</p>
                  <p className="text-xl font-bold text-gray-800 tracking-tight">Rp {totalRabSelected.toLocaleString('id-ID')}</p>
              </div>
          </div>

          {/* BAGIAN KANAN: FORM INVOICE & TERMIN */}
          <div className="w-full md:w-2/3 p-6 overflow-y-auto custom-scrollbar bg-white">
            <form id="createInvoiceForm" onSubmit={handleSubmit} className="space-y-6">
              
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2 pb-2 border-b">
                  2. Atur Skema Penagihan
              </h4>

              {/* TERMIN SELECTOR */}
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                  <label className="block text-xs font-bold text-blue-800 mb-3 uppercase tracking-wider">Pilih Skema Pembayaran</label>
                  <div className="flex flex-wrap gap-2">
                      {TERMIN_OPTIONS.map(opt => {
                          // Logika Kunci Button
                          const isBilled = billedTermins.includes(opt.id);
                          const isFullBilled = billedTermins.includes('full');
                          const hasAnyTerminBilled = billedTermins.includes('t1') || billedTermins.includes('t2') || billedTermins.includes('t3');
                          
                          let isDisabled = totalRabSelected === 0 && opt.id !== 'custom';
                          if (isBilled) isDisabled = true;
                          if (opt.id === 'full' && hasAnyTerminBilled) isDisabled = true; // Jika termin sudah dicicil, jgn boleh full
                          if (opt.id !== 'custom' && opt.id !== 'full' && isFullBilled) isDisabled = true; // Jika sudah dibayar full, jgn boleh termin

                          return (
                              <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => setSelectedTermin(opt.id)}
                                  disabled={isDisabled}
                                  className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                                      selectedTermin === opt.id 
                                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                      : isBilled 
                                          ? 'bg-green-50 text-green-700 border-green-200 opacity-80 cursor-not-allowed'
                                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                                  }`}
                              >
                                  {isBilled && <CheckCircle2 size={14} className="text-green-600" />}
                                  {isBilled ? 'Sudah Ditagihkan' : opt.label}
                              </button>
                          );
                      })}
                  </div>
                  {totalRabSelected === 0 && selectedTermin !== 'custom' && (
                      <p className="text-xs text-red-500 mt-2 italic">*Pilih item RAB di sebelah kiri terlebih dahulu.</p>
                  )}
              </div>

              {/* INVOICE ITEMS */}
              <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Item Tagihan</label>
                   <div className="space-y-3">
                      {formData.items.length === 0 ? (
                          <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">
                              Item tagihan kosong.
                          </div>
                      ) : (
                          formData.items.map((item, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 rounded-xl border bg-white shadow-sm focus-within:ring-1 focus-within:ring-blue-400">
                                  <div className="flex-grow space-y-2">
                                      <textarea 
                                          name="description" 
                                          value={item.description} 
                                          onChange={(e) => handleItemChange(index, e)} 
                                          rows={2}
                                          placeholder="Deskripsi penagihan..." 
                                          className="w-full text-sm font-medium text-gray-800 bg-transparent border-none focus:ring-0 p-0 resize-none" 
                                          required 
                                      />
                                      <div className="flex items-center gap-2 border-t pt-2">
                                          <span className="text-xs font-bold text-gray-400">Rp</span>
                                          <input 
                                              type="number" 
                                              name="amount" 
                                              value={item.amount} 
                                              onChange={(e) => handleItemChange(index, e)} 
                                              placeholder="0" 
                                              className="w-full text-base font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0" 
                                              required 
                                          />
                                      </div>
                                  </div>
                                  <button type="button" onClick={() => removeItem(index)} className="mt-1 text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-50 rounded-md hover:bg-red-50">
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          ))
                      )}
                   </div>
                   {selectedTermin === 'custom' && (
                       <button type="button" onClick={addCustomItem} className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800">
                          + Tambah Baris Manual
                       </button>
                   )}
              </div>

              <hr className="border-gray-100" />

              {/* DETAILS KLIEN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Invoice *</label>
                    <input type="date" name="invoice_date" value={formData.invoice_date} onChange={handleChange} className="w-full input-style text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jatuh Tempo *</label>
                    <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full input-style text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Client Email *</label>
                    <input type="email" name="client_email" value={formData.client_email} onChange={handleChange} className="w-full input-style text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Client Phone</label>
                    <input type="tel" name="client_phone" value={formData.client_phone} onChange={handleChange} className="w-full input-style text-sm" />
                  </div>
              </div>

            </form>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3 rounded-b-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <button onClick={onClose} disabled={loading} className="px-5 py-2 btn-secondary text-sm">Batal</button>
          <button type="submit" form="createInvoiceForm" disabled={loading} className="px-6 py-2 btn-primary flex items-center gap-2 text-sm">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            Simpan & Buat
          </button>
        </div>

      </div>
    </div>
  );
}