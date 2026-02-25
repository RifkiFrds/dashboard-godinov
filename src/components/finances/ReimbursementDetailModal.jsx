import React, { useState } from 'react';
import { X, Paperclip, Download, MessageSquare, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Paid': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
};

export default function ReimbursementDetailModal({ isOpen, onClose, submission, onApprove, onReject }) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!isOpen || !submission) return null;

  const handleRejectClick = () => {
    if (!isRejecting) {
      setIsRejecting(true);
    } else {
      onReject(submission.id, rejectionReason);
    }
  };

  const handleClose = () => {
    setIsRejecting(false);
    setRejectionReason('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Detail Klaim: #{submission.id}</h3>
              {/* Menggunakan user.name sesuai relasi backend */}
              <p className="text-sm text-gray-500">Diajukan oleh: {submission.user?.name || 'User'}</p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Jumlah</label>
                  {/* Menggunakan amountFormatted dari mapping frontend */}
                  <p className="text-2xl font-bold text-gray-800">{submission.amountFormatted}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                  <p className={`mt-1 text-sm font-bold w-min whitespace-nowrap px-3 py-1 rounded-full ${getStatusStyle(submission.status)}`}>{submission.status}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Tanggal Pengeluaran</label>
                  {/* Menggunakan dateFormatted */}
                  <p className="text-sm text-gray-700">{submission.dateFormatted}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
                  <p className="text-sm text-gray-700">{submission.category}</p>
                </div>
              </div>

              {/* Right Details */}
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Keterangan</label>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border">{submission.description}</p>
                    <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md border">{submission.notes}</p>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Lampiran (Nota)</label>
                    <div className="mt-2">
                        {/* Menggunakan receipt_url sesuai database/backend */}
                        {submission.receipt_url ? (
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
                                <div className="flex items-center gap-2">
                                    <Paperclip size={16} className="text-gray-500"/>
                                    <span className="text-sm text-gray-700 font-medium">Dokumen Nota</span>
                                </div>
                                <div className="flex gap-2">
                                    <a 
                                        href={submission.receipt_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md flex items-center gap-1 text-xs font-bold"
                                    >
                                        <ExternalLink size={14}/> Buka
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-md border">Tidak ada lampiran nota.</p>
                        )}
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Form Alasan Penolakan */}
            {isRejecting && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <label htmlFor="rejectionReason" className="text-xs font-bold text-red-600 uppercase flex items-center gap-2 mb-2">
                        <MessageSquare size={14}/> Alasan Penolakan
                    </label>
                    <textarea 
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Tuliskan alasan penolakan agar karyawan dapat memahami..."
                        className="w-full p-2 border border-red-200 rounded-md focus:ring-2 focus:ring-red-200 focus:outline-none text-sm"
                        rows={3}
                    />
                </div>
            )}
          </div>

          {/* Footer Actions */}
          {submission.status === 'Pending' && (
            <div className="p-4 bg-gray-50 border-t flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={handleRejectClick}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-red-300 transition-all"
                disabled={isRejecting && !rejectionReason}
              >
                {isRejecting ? 'Konfirmasi Tolak' : 'Tolak'}
              </button>
              <button 
                onClick={() => onApprove(submission.id)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
              >
                Setujui
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}