import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Download, Settings, User, Landmark, Trash2, PlusCircle, Loader, ZoomIn, ZoomOut, Maximize, Database } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import InvoicePreview from './previews/InvoicePreview';
import { toast } from 'react-toastify';
import api from '../../../api';
import { bankAccounts } from '../../../lib/bankAccounts';

const getEmailTemplate = (status, invoice) => {
    const clientName = invoice?.client || 'Client';
    const invoiceId = invoice?.projectCode || invoice?.id || 'your invoice';
    switch (status) {
        case 'Unpaid':
        case 'Pending':
            return `Dear ${clientName},\n\nHope you are doing well.\n\nThis is a friendly reminder that your invoice ${invoiceId} is due. You can find the invoice attached to this email. Please let us know if you have any questions.\n\nBest regards,\nGodinov Team`;
        case 'Overdue':
            return `Dear ${clientName},\n\nThis is an urgent reminder that your invoice ${invoiceId} is now overdue. Please make the payment as soon as possible to avoid any service interruptions. The invoice is attached for your reference.\n\nBest regards,\nGodinov Team`;
        case 'Paid':
            return `Dear ${clientName},\n\nThank you for your payment for invoice ${invoiceId}. We have received it and appreciate your business. A copy of the paid invoice is attached for your records.\n\nBest regards,\nGodinov Team`;
        default:
            return `Dear ${clientName},\n\nPlease find your invoice ${invoiceId} attached.\n\nBest regards,\nGodinov Team`;
    }
}


const initialInvoiceState = {
    id: '',
    projectCode: '',
    client: '',
    clientAddress: '',
    projectDescription: '',
    items: [],
    tax: 0,
    payment: {},
    qrUrl: '',
    status: '',
};

const partnershipItems = (domainTld) => [
    { 
        description: `UI/UX Design\nKonsep Editorial, Layouting, Aset Grafis`, 
        rate: 1500000, 
        unit: 1, 
        discount: 1500000 
    },
    { 
        description: `Frontend Development\nReact js, Mobile Responsive`, 
        rate: 3500000, 
        unit: 1, 
        discount: 3500000 
    },
    { 
        description: `Deployment\nSetup Server, Domain Connect, Basic SEO`, 
        rate: 500000, 
        unit: 1, 
        discount: 500000 
    },
    { 
        description: `Domain TLD (${domainTld}) & Cloud Hosting Starter \nSewa Alamat & Server Website 1 Tahun`, 
        rate: 535000, 
        unit: 1, 
        discount: 0 
    },
];

export default function SendEmailModal({ isOpen, onClose, invoice }) {
    const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
    const [styleConfig, setStyleConfig] = useState({ accentColor: '#1F2937', logo: '/images/logo.png' });
    const [invoiceData, setInvoiceData] = useState(initialInvoiceState);
    const [originalItems, setOriginalItems] = useState([]);
    const [loadingInvoice, setLoadingInvoice] = useState(false);
    
    // State untuk integrasi RAB
    const [availableRabItems, setAvailableRabItems] = useState([]);
    const [selectedRabIds, setSelectedRabIds] = useState([]);

    const [isPartnership, setIsPartnership] = useState(false);
    const [domainTld, setDomainTld] = useState('.id');
    const [zoom, setZoom] = useState(0.8);
    
    const previewRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: previewRef, // Untuk react-to-print V3
        content: () => previewRef.current, // Fallback untuk react-to-print V2
        documentTitle: `Invoice-${invoiceData?.projectCode || invoiceData?.id || 'Godinov'}`,
    });

    const handleAccountSelect = (e) => {
        const selectedAcc = bankAccounts.find(acc => acc.id === e.target.value);
        if (selectedAcc) {
            // Regex untuk menangkap: [1]Bank, [2]Nomor, [3]Nama
            const match = selectedAcc.name.match(/(.*?)\s*-\s*([\d\w]+)\s*\((.*?)\)/);
            
            if (match) {

                const accountNumberStr = match[2].trim();

                setInvoiceData(prev => ({
                    ...prev,
                    qrUrl: accountNumberStr,
                    payment: {
                        bank: match[1].trim(),
                        accountNumber: match[2].trim(),
                        accountName: match[3].trim()
                    }
                }));
            } else {
                toast.warn("Format data bank tidak dikenali. Harap isi manual.");
            }
        }
    };

    useEffect(() => {
        if (isOpen && invoice?.id) {
            setZoom(0.8);
            const fetchFullInvoice = async () => {
                setLoadingInvoice(true);
                setIsPartnership(false);
                setSelectedRabIds([]); // Reset seleksi RAB saat modal dibuka
                setAvailableRabItems([]);

           try {
                    // 1. FETCH DETAIL INVOICE (Menggunakan projectCode atau id)
                    const invoiceIdentifier = invoice.projectCode || invoice.id;
                    const response = await api.get(`/api/finance/invoices/${invoiceIdentifier}`);
                    
                    const fetchedInvoice = response.data.data;
                    const items = fetchedInvoice.invoice_items || [];

                    setOriginalItems(items);

                    const finalInvoiceData = {
                        ...initialInvoiceState,
                        ...invoice, 
                        items: items,
                        clientEmail: fetchedInvoice.client_email,
                        status: fetchedInvoice.payment_status,
                    };
                    
                    setInvoiceData(finalInvoiceData);

                    setEmailData({
                        to: finalInvoiceData.clientEmail || 'client@example.com',
                        subject: `Invoice [${invoice.projectCode || invoice.id}] from Godinov`,
                        body: getEmailTemplate(finalInvoiceData.status, finalInvoiceData)
                    });

                    // 2. FETCH DATA RAB (Capex & Opex) SECARA TERPISAH
                    const targetProjectId = fetchedInvoice.project_id || fetchedInvoice.project?.id;
                    
                    if (targetProjectId) {
                        try {
                            const rabResponse = await api.get(`/api/finance/invoices/projects/${targetProjectId}/invoice-items`);
                            setAvailableRabItems(rabResponse.data.data || []);
                        } catch (rabError) {
                            console.warn("RAB Data not available for this project.", rabError);
                        }
                    }

                } catch (error) {
                    console.error("Failed to fetch full invoice details:", error);
                    toast.error("Could not load invoice details.");
                    onClose();
                } finally {
                    setLoadingInvoice(false);
                }
            };
            
            fetchFullInvoice();
        }
    }, [isOpen, invoice, onClose]);
    
    useEffect(() => {
        if (!isOpen) return;

        if (isPartnership) {
            setInvoiceData(prev => ({ ...prev, items: partnershipItems(domainTld) }));
            setSelectedRabIds([]); // Reset RAB saat masuk mode partnership
        } else {
            // Kembalikan ke item asli jika mode kemitraan dimatikan
            setInvoiceData(prev => ({ ...prev, items: originalItems }));
            setSelectedRabIds([]); // Reset seleksi RAB untuk mencegah duplikasi
        }
    }, [isPartnership, domainTld, originalItems, isOpen]);

    // Fungsi untuk menambah/menghapus item RAB dari list Invoice
    const toggleRabItem = (rabItem) => {
        if (selectedRabIds.includes(rabItem.id)) {
            // Hapus dari state seleksi dan hapus dari array items
            setSelectedRabIds(prev => prev.filter(id => id !== rabItem.id));
            setInvoiceData(prev => ({
                ...prev,
                items: prev.items.filter(i => i._rabId !== rabItem.id)
            }));
        } else {
            // Tambahkan ke state seleksi dan sisipkan ke array items
            setSelectedRabIds(prev => [...prev, rabItem.id]);
            setInvoiceData(prev => ({
                ...prev,
                items: [
                    ...prev.items, 
                    { 
                        description: rabItem.description, 
                        rate: rabItem.rate, 
                        unit: rabItem.unit, 
                        discount: rabItem.discount, 
                        _rabId: rabItem.id 
                    }
                ]
            }));
        }
    };

    const handleInvoiceChange = (field, value) => {
        const keys = field.split('.');
        if (keys.length > 1) {
            setInvoiceData(prev => ({ ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: value } }));
        } else {
            setInvoiceData(prev => ({ ...prev, [field]: value }));
        }
    };
    
    const handleItemChange = (index, field, value) => {
        const newItems = [...invoiceData.items];
        newItems[index][field] = value;
        handleInvoiceChange('items', newItems);
    };

    const addItem = () => handleInvoiceChange('items', [...invoiceData.items, { description: '', rate: 0, unit: 1, discount: 0 }]);
    
    const removeItem = (index) => {
        const itemToRemove = invoiceData.items[index];
        // Jika item yang dihapus adalah dari RAB, hilangkan centang di checkbox
        if (itemToRemove._rabId) {
            setSelectedRabIds(prev => prev.filter(id => id !== itemToRemove._rabId));
        }
        handleInvoiceChange('items', invoiceData.items.filter((_, i) => i !== index));
    };

    const handleSendEmail = () => {
        toast.info("Simulating email send...");
        setTimeout(() => { toast.success(`Email with invoice ${invoiceData.id} sent to ${emailData.to}`); onClose(); }, 1500);
    }
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-100 rounded-xl shadow-2xl w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Send className="text-blue-600" size={20}/>Send Invoice via Email</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><X size={20} /></button>
                </div>

                {loadingInvoice ? (
                    <div className="flex-grow flex items-center justify-center"><Loader className="animate-spin text-blue-600" size={48} /></div>
                ) : (
                    <div className="flex flex-grow min-h-0">
                        <div className="w-1/3 bg-white border-r border-gray-200 p-6 flex flex-col space-y-6 overflow-y-auto custom-scrollbar">
                            
                            {/* PENGATURAN KEMITRAAN */}
                            <div>
                                <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-3"><Settings size={16}/> Invoice Settings</h4>
                                <div className="space-y-3">
                                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-sm font-semibold text-yellow-800">Partnership Mode</span>
                                            <input type="checkbox" checked={isPartnership} onChange={(e) => setIsPartnership(e.target.checked)} className="form-checkbox h-5 w-5 text-yellow-600 rounded" />
                                        </label>
                                        <p className="text-xs text-yellow-700 mt-1">Automatically fills invoice with partnership program items and discounts.</p>
                                    </div>
                                    {isPartnership && (
                                        <div>
                                            <label className="text-xs font-medium text-gray-500">Domain TLD</label>
                                            <select value={domainTld} onChange={e => setDomainTld(e.target.value)} className="w-full input-style mt-1">
                                                <option value=".id">.id</option><option value=".com">.com</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* IMPORT DATA RAB (Capex & Opex) */}
                            {!isPartnership && availableRabItems.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-3"><Database size={16}/> Import dari Data RAB</h4>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                                        {availableRabItems.map(item => (
                                            <label key={item.id} className={`flex items-start gap-3 cursor-pointer p-2 rounded border shadow-sm transition-colors ${selectedRabIds.includes(item.id) ? 'bg-blue-100 border-blue-300' : 'bg-white border-blue-100 hover:bg-blue-50'}`}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedRabIds.includes(item.id)}
                                                    onChange={() => toggleRabItem(item)}
                                                    className="mt-1 form-checkbox text-blue-600 rounded focus:ring-blue-500"
                                                />
                                                <div className="flex-grow">
                                                    <p className="text-xs font-semibold text-gray-800 leading-tight">{item.description}</p>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.type === 'CAPEX' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                                                            {item.type}
                                                        </span>
                                                        <span className="text-xs font-medium text-gray-600">Rp {item.rate.toLocaleString('id-ID')}</span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* DETAIL KLIEN & PEMBAYARAN */}
                            <div>
                                <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-3"><User size={16}/> Client & Project</h4>
                                <div className="space-y-2">
                                    <Input 
                                        label="Client Name" 
                                        value={invoiceData.client} 
                                        onChange={e => handleInvoiceChange('client', e.target.value)} 
                                    />
                                    <Input 
                                        label="Client Address" 
                                        value={invoiceData.clientAddress} 
                                        onChange={e => handleInvoiceChange('clientAddress', e.target.value)} 
                                        placeholder="e.g. Jl. Jenderal Sudirman No. 5, Jakarta" 
                                    />
                                    <Input 
                                        type="textarea"
                                        label="Invoice Description" 
                                        value={invoiceData.projectDescription} 
                                        onChange={e => handleInvoiceChange('projectDescription', e.target.value)} 
                                        placeholder="e.g. Development of Company Profile Website" 
                                    />
                            </div>
                            </div>

                            {/* DETAIL BANK */}
                            <div>
                                <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-3"><Landmark size={16}/> Payment Details</h4>
                                <div className="space-y-3">
                                    {/* DROPDOWN PILIH REKENING */}
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-blue-600 mb-1">Pilih Rekening Tersimpan</label>
                                        <select 
                                            onChange={handleAccountSelect}
                                            defaultValue=""
                                            className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm cursor-pointer"
                                        >
                                            <option value="" disabled>-- Pilih Rekening --</option>
                                            {bankAccounts.map(acc => (
                                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="pt-2 border-t border-gray-100 space-y-2">
                                        <Input 
                                            disabled 
                                            label="Bank Name" 
                                            value={invoiceData.payment.bank} 
                                            onChange={e => handleInvoiceChange('payment.bank', e.target.value)} 
                                        />
                                        <Input 
                                            disabled 
                                            label="Account Name" 
                                            value={invoiceData.payment.accountName} 
                                            onChange={e => handleInvoiceChange('payment.accountName', e.target.value)} 
                                        />
                                        <Input 
                                            disabled 
                                            label="Account Number" 
                                            value={invoiceData.payment.accountNumber} 
                                            onChange={e => handleInvoiceChange('payment.accountNumber', e.target.value)} 
                                        />
                                        <Input 
                                            disabled 
                                            label="QR Code URL" 
                                            value={invoiceData.payment.accountNumber} 
                                            onChange={e => handleInvoiceChange('qrUrl', e.target.value)} 
                                        />
                                </div>
                                </div>
                            </div>

                            {/* INVOICE ITEMS EDITOR */}
                            <div>
                                <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-3">Invoice Items</h4>
                                <div className="space-y-3">
                                    {invoiceData.items.map((item, index) => (
                                    <div key={index} className={`p-3 rounded-lg border relative ${isPartnership ? 'bg-gray-100' : (item._rabId ? 'bg-blue-50 border-blue-300' : 'bg-white')}`}>
                                        { !isPartnership && <button onClick={() => removeItem(index)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600"><Trash2 size={14}/></button> }
                                        { item._rabId && <span className="absolute top-2 right-8 text-[10px] text-blue-600 font-bold italic">Auto-Synced</span> }
                                        
                                        <textarea placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className={`w-full p-1 border-b text-sm mb-2 resize-none ${isPartnership ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`} rows={2} disabled={isPartnership}/>
                                        <div className="flex gap-2">
                                            <Input label="Rate" type="number" value={item.rate} disabled={isPartnership} onChange={e => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} containerClassName={isPartnership ? 'cursor-not-allowed' : ''} />
                                            <Input label="Discount" type="number" value={item.discount} disabled={isPartnership} onChange={e => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)} containerClassName={isPartnership ? 'cursor-not-allowed' : ''} />
                                            <Input label="Unit" type="number" value={item.unit} disabled={isPartnership} onChange={e => handleItemChange(index, 'unit', parseInt(e.target.value) || 0)} containerClassName={`w-20 ${isPartnership ? 'cursor-not-allowed' : ''}`} />
                                        </div>
                                    </div>
                                    ))}
                                    {!isPartnership && <button onClick={addItem} className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"><PlusCircle size={16}/> Add Custom Item</button> }
                                </div>
                            </div>
                        </div>

                       {/* LIVE PREVIEW AREA */}
                        <div className="w-2/3 p-4 sm:p-8 overflow-y-auto custom-scrollbar bg-gray-200">
                            <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-200 py-2 z-10 -mx-4 px-4 sm:-mx-8 sm:px-8">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-700">Live Preview</h4>
                                    <div className="flex items-center gap-1 rounded-lg bg-white border border-gray-300 p-1">
                                        <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"><ZoomOut size={16}/></button>
                                        <button onClick={() => setZoom(0.8)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"><Maximize size={16}/></button>
                                        <button onClick={() => setZoom(z => z + 0.1)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"><ZoomIn size={16}/></button>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handlePrint()} 
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm"
                                    >
                                        <Download size={14} /> Download PDF
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex justify-center pt-4">
                                {/* Zoom Wrapper: Hanya untuk tampilan UI layar, tidak terpengaruh saat print */}
                                <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top' }}>
                                   
                                   {/* PRINT TARGET: Tambahkan div pembungkus dengan ref di sini */}
                                   <div ref={previewRef} className="bg-white">
                                        <InvoicePreview 
                                            invoice={invoiceData} 
                                            styleConfig={styleConfig} 
                                        />
                                   </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="px-6 py-3 bg-white border-t border-gray-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 btn-secondary border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Batal</button>
                    <button onClick={handleSendEmail} disabled={loadingInvoice} className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
                        <Send size={16} /> Send Email
                    </button>
                </div>
            </div>
        </div>
    );
}


const Input = ({ label, containerClassName, value, type, ...props }) => (
    <div className={`flex flex-col ${containerClassName || ''}`}>
        <label className="text-xs font-medium text-gray-500 mb-1">{label}</label>
        
        {type === 'textarea' ? (
            <textarea
                {...props}
                value={value ?? ''}
                rows={4} // Menentukan tinggi 4 baris
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none ${
                    props.disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'
                }`}
            />
        ) : (
            <input 
                {...props} 
                type={type}
                value={value ?? ''} 
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${
                    props.disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'
                }`} 
            />
        )}
    </div>
);