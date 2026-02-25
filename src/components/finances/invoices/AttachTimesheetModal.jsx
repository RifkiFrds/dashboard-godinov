import React from 'react';
import { X, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockTimesheets = [
    { id: 'TS-01', description: 'Initial design mockups', hours: 8, date: '2023-09-15' },
    { id: 'TS-02', description: 'Frontend component development', hours: 16, date: '2023-09-18' },
    { id: 'TS-03', description: 'API integration', hours: 12, date: '2023-09-22' },
];

const AttachTimesheetModal = ({ isOpen, onClose, invoiceId }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Attach Timesheet to {invoiceId}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
                <div className="space-y-3">
                    {mockTimesheets.map(ts => (
                        <div key={ts.id} className="p-3 border rounded-lg flex items-start justify-between bg-gray-50/70">
                           <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100/50 rounded-md">
                                    <Paperclip size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{ts.description}</p>
                                    <p className="text-xs text-gray-500">ID: {ts.id} &bull; Hours: {ts.hours}h &bull; Date: {ts.date}</p>
                                </div>
                           </div>
                           <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2 rounded-b-lg">
                <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                    Attach Selected
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AttachTimesheetModal;
