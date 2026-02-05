import React, { useState, useEffect } from 'react';
import { AlertCircle, Timer, RefreshCw, ShieldCheck, X } from "lucide-react";

const OtpVerificationModal = ({ isOpen, onCancel, onVerify, onResend }) => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Logika Hitung Mundur
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendClick = () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(15);
    onResend(); // Memanggil fungsi API di parent
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 relative">
        
        {/* Tombol Close di pojok kanan atas */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Icon Section */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-orange-100 rounded-3xl rotate-12 animate-pulse"></div>
            <div className="relative w-full h-full bg-orange-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-orange-200">
              <ShieldCheck size={40} />
            </div>
          </div>

          {/* Text Section */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Verifikasi OTP</h3>
            <p className="text-sm text-gray-500 leading-relaxed px-4">
              Meloncati proses memerlukan otorisasi. Masukkan kode yang dikirimkan ke <span className="font-bold text-gray-700">Project Manager</span>.
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-6">
            <div className="relative group">
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={8}
                placeholder="00000000"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-center text-3xl tracking-[0.5em] font-black text-orange-600 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-gray-200"
              />
            </div>

            {/* Resend Button */}
            <button
              onClick={handleResendClick}
              disabled={!canResend}
              className={`flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all
                ${canResend 
                  ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 active:scale-95' 
                  : 'text-gray-400 bg-gray-50 opacity-70'}`}
            >
              {canResend ? (
                <>
                  <RefreshCw size={14} /> Kirim Ulang Kode
                </>
              ) : (
                <>
                  <Timer size={14} className="animate-spin-slow" /> Tunggu {countdown} Detik
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 space-y-3">
            <button 
              onClick={() => onVerify(otp)}
              className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Verifikasi & Selesaikan
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Batalkan Otorisasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;