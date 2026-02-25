import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import InvoiceActionMenu from './InvoiceActionMenu';
import RegisterPaymentModal from './RegisterPaymentModal';
import AttachTimesheetModal from './AttachTimesheetModal';
import SendEmailModal from './SendEmailModal';

const ROWS_PER_PAGE = 15;

const InvoiceTable = ({ invoices, paginationMeta, onPageChange, projectCode, onRefresh }) => {
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [isTimesheetModalOpen, setTimesheetModalOpen] = useState(false);
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);

    const handleRegisterPayment = (invoice) => {
        setSelectedInvoice(invoice);
        setPaymentModalOpen(true);
    };

    const handleSendEmail = (invoice) => {
        setSelectedInvoice(invoice);
        setEmailModalOpen(true);
    };
    
    const emptyRows = Math.max(0, ROWS_PER_PAGE - (invoices?.length || 0));

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">No. Invoice</th>
                                <th className="px-6 py-4 font-semibold">Client</th>
                                <th className="px-6 py-4 font-semibold">Tanggal</th>
                                <th className="px-6 py-4 font-semibold">Jumlah</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {invoices && invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors h-[60px]">
                                    {/* Gunakan inv.projectCode, BUKAN inv.id untuk tampilan visual */}
                                    <td className="px-6 py-4 font-medium text-gray-900">{inv.projectCode}</td>
                                    <td className="px-6 py-4 text-gray-600">{inv.client}</td>
                                    <td className="px-6 py-4 text-gray-500">{inv.date}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{inv.amount}</td>
                                    <td className="px-6 py-4">
                                        <InvoiceStatusBadge status={inv.status} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <InvoiceActionMenu 
                                            invoice={inv}
                                            onRegisterPayment={() => handleRegisterPayment(inv)}
                                            onAttachTimesheet={() => handleAttachTimesheet(inv)}
                                            onSendEmail={() => handleSendEmail(inv)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {/* Render empty rows to maintain table height */}
                            {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, index) => (
                                <tr key={`empty-${index}`} className="h-[60px]">
                                    <td colSpan="6" className="px-6 py-4">&nbsp;</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                {paginationMeta && paginationMeta.total > paginationMeta.per_page && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-white">
                        <span className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{paginationMeta.from}</span> to <span className="font-semibold">{paginationMeta.to}</span> of <span className="font-semibold">{paginationMeta.total}</span> results
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onPageChange(paginationMeta.current_page - 1)}
                                disabled={paginationMeta.current_page <= 1}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>
                            <button
                                onClick={() => onPageChange(paginationMeta.current_page + 1)}
                                disabled={paginationMeta.current_page >= paginationMeta.last_page}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

         {selectedInvoice && (
                <>
                    <RegisterPaymentModal 
                        isOpen={isPaymentModalOpen}
                        onClose={() => setPaymentModalOpen(false)}
                        projectCode={selectedInvoice.projectCode} 
                        onRefresh={onRefresh}
                    />
                    <SendEmailModal
                        isOpen={isEmailModalOpen}
                        onClose={() => setEmailModalOpen(false)}
                        // Kirim seluruh object invoice
                        invoice={selectedInvoice} 
                    />
                </>
            )}
         </>
         );
};

export default InvoiceTable;
