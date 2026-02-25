import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bankAccounts } from '../../../lib/bankAccounts';
import api from '../../../api'; // Pastikan path import api benar
import { toast } from 'react-toastify'; // Menggunakan toast untuk feedback

const RegisterPaymentModal = ({ isOpen, onClose, projectCode, onSuccess, onRefresh}) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');
  const [paymentType, setPaymentType] = useState('full');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

 const handleRegisterPayment = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    
    // Tentukan status berdasarkan tipe pembayaran
    const status = paymentType === 'partial' ? 'Partially' : 'Paid';
    formData.append('payment_status', status);
    
    // Kirim data tambahan sesuai kebutuhan backend
    formData.append('payment_method', paymentMethod);
    if (paymentMethod === 'bank_transfer') {
      formData.append('bank_account_id', bankAccountId);
    }
    if (paymentType === 'partial') {
      formData.append('amount_paid', amountPaid);
    }
    if (paymentProof) {
      formData.append('payment_proof', paymentProof);
    }

    // Gunakan _method spoofing agar Laravel membaca PATCH melalui POST
    formData.append('_method', 'PATCH');

    try {
      const response = await api.post(`/api/finance/invoices/${projectCode}/status`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message || 'Berhasil mendaftarkan pembayaran!');
      if (onRefresh) onRefresh(); // Refresh data tabel di halaman utama
      onClose();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Gagal mendaftarkan pembayaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setPaymentProof(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Register Payment for #{projectCode}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Payment Method Dropdown */}
                <div>
                  <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700 mb-1 block">Payment Method</label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="" disabled>Select a method</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="qris">QRIS</option>
                  </select>
                </div>

                {/* Bank Account Dropdown */}
                {paymentMethod === 'bank_transfer' && (
                  <div>
                    <label htmlFor="bankAccount" className="text-sm font-medium text-gray-700 mb-1 block">Recipient Account</label>
                    <select
                      id="bankAccount"
                      value={bankAccountId}
                      onChange={(e) => setBankAccountId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="" disabled>Select an account</option>
                      {bankAccounts.map(account => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Payment Type Radio */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Type</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="paymentType" value="full" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Full Payment</span>
                    </label>
                   {/* <label className="flex items-center cursor-pointer">
                      <input type="radio" name="paymentType" value="partial" checked={paymentType === 'partial'} onChange={() => setPaymentType('partial')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Partial Payment</span>
                    </label>*/}
                  </div>
                </div>

                {/* Amount Paid */}
                {paymentType === 'partial' && (
                  <div>
                    <label htmlFor="amountPaid" className="text-sm font-medium text-gray-700 mb-1 block">Amount Paid</label>
                    <input
                      type="number"
                      id="amountPaid"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="e.g., 500000"
                    />
                  </div>
                )}

                {/* Attachment */}
                {paymentMethod && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Proof</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                      <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" />
                          </label>
                          <p className="pl-1 text-gray-500">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                        {paymentProof && <p className="text-sm text-emerald-600 font-medium pt-2 italic">File: {paymentProof.name}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2 rounded-b-lg">
              <button 
                onClick={onClose} 
                disabled={isSubmitting}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-wait"
                disabled={
                  isSubmitting ||
                  !paymentMethod ||
                  (paymentMethod === 'bank_transfer' && !bankAccountId) ||
                  (paymentType === 'partial' && (!amountPaid || parseFloat(amountPaid) <= 0))
                }
              >
                {isSubmitting ? 'Registering...' : 'Register Payment'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RegisterPaymentModal;