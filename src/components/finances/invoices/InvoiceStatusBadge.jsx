import React from 'react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Pending':
    case 'Unpaid':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Overdue':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Draft':
        return 'bg-gray-100 text-gray-500 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const InvoiceStatusBadge = ({ status }) => {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default InvoiceStatusBadge;
