import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Send, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InvoiceActionMenu = ({ invoice, onRegisterPayment, onSendEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action) => {
    if (action) action();
    setIsOpen(false);
  }

  // Definisikan menuItems secara dinamis berdasarkan status invoice
  const menuItems = [
    { label: 'Send/Email', icon: <Send size={16} />, action: () => handleAction(onSendEmail) },
    // Item ini hanya muncul jika status BUKAN 'Paid'
    ...(invoice.status !== 'Paid' ? [
      { label: 'Register Payment', icon: <CreditCard size={16} />, action: () => handleAction(onRegisterPayment) }
    ] : []),
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-blue-600 p-1 rounded-full transition-colors">
        <MoreHorizontal size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 origin-top-right"
          >
            <div className="p-2">
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-gray-400 text-center italic">No actions available</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvoiceActionMenu;