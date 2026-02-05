import React from "react";
import { Play } from "lucide-react";

const ConfirmStartModal = ({ isOpen, task, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <Play size={32} fill="currentColor" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Mulai Kerjakan Task?</h3>
        <p className="text-gray-500 text-sm text-center mb-6">
          Sistem akan mulai menghitung durasi pengerjaan untuk task <span className="font-semibold text-gray-700">"{task?.title}"</span>. Pastikan Anda sudah siap.
        </p>

        <div className="space-y-3">
          <button 
            onClick={onConfirm}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Ya, Saya Siap!
          </button>
          <button 
            onClick={onCancel}
            className="w-full bg-white text-gray-500 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmStartModal;