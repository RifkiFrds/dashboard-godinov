import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Upload } from "lucide-react";
import { H2 } from "../../components/ui/Text";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import InvoiceTable from "../../components/finances/invoices/InvoiceTable";
import CreateInvoiceModal from "../../components/finances/invoices/CreateInvoiceModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../../api";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchInvoices = async (page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('per_page', 15);
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const [invoiceResponse, projectsResponse] = await Promise.all([
        api.get(`/api/finance/invoices`, { params }),
        api.get(`/api/projects`)
      ]);
      
      const projectsData = projectsResponse.data.data || [];
      const projectCodeMap = new Map(projectsData.map(p => [p.id, p.project_code]));

      const formattedInvoices = invoiceResponse.data.data.map(invoice => {
        const projectCode = projectCodeMap.get(invoice.project_id);
        return {
          id: invoice.id,
          projectCode: projectCode || 'N/A',
          client: invoice.project.name,
          date: format(new Date(invoice.invoice_date), "dd MMMM yyyy", { locale: id }),
          amount: formatCurrency(invoice.total_amount),
          status: invoice.payment_status,
        };
      });

      setInvoices(formattedInvoices);
      setPaginationMeta(invoiceResponse.data.meta);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [searchQuery, statusFilter, currentPage]);

  const handleCreateSuccess = () => {
    toast.success("Invoice berhasil dibuat!");
    // Reset to first page to see the new entry if it's on top
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchInvoices(1);
    }
  };

  const handlePaymentSuccess = () => {
    fetchInvoices(currentPage); 
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  }
  
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on new filter
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  }

  const handleExportCSV = () => {
    if (invoices.length === 0) {
      toast.warn("Tidak ada data untuk diekspor.");
      return;
    }

    const headers = ['INVOICE_ID', 'CLIENT_NAME', 'INVOICE_DATE', 'TOTAL_AMOUNT', 'INVOICE_STATUS'];
    const rows = invoices.map(invoice => [
      invoice.id,
      `"${invoice.client.replace(/"/g, '""')}"`,
      invoice.date,
      `"${invoice.amount}"`,
      invoice.status
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `godinov-invoices-${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Data berhasil diekspor!");
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Breadcrumbs
          items={[
            { label: "Manajemen Invoice", path: "/finance/invoices" }
          ]}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <H2>Manajemen Invoice</H2>
            <p className="text-gray-500 text-sm mt-1">Kelola semua tagihan masuk dan keluar.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              <Upload size={16} /> Export
            </button>
            <button 
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
            >
              <Plus size={16} /> Buat Invoice
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari No. Invoice atau Client..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <select 
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-600"
            value={statusFilter}
            onChange={handleFilterChange}
          >
            <option value="">Semua Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Overdue">Overdue</option>
            <option value="Partially">Partially</option>
          </select>
        </div>

        {/* Table Section */}
        {loading ? (
          <div className="text-center py-10">Memuat data...</div>
        ) : (
          <InvoiceTable 
            invoices={invoices} 
            paginationMeta={paginationMeta}
            onPageChange={handlePageChange}
            onRefresh={handlePaymentSuccess}
          />
        )}
      </div>

      <CreateInvoiceModal 
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}