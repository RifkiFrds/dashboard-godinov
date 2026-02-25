import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  // Jangan render apapun jika tidak ada data atau hanya ada satu halaman
  if (!pagination || pagination.last_page <= 1) {
    return null;
  }

  const { current_page, last_page, from, to, total } = pagination;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= last_page && page !== current_page) {
      onPageChange(page);
    }
  };
  
  // Logika untuk membuat nomor halaman dengan elipsis (...)
  const pageNumbers = () => {
    const pages = [];
    const spread = 2; // Jumlah halaman yang ditampilkan di sekitar halaman saat ini

    // Selalu tampilkan halaman pertama
    if (last_page > 1) pages.push(1);

    // Tampilkan halaman di sekitar halaman saat ini
    for (let i = Math.max(2, current_page - spread); i <= Math.min(last_page - 1, current_page + spread); i++) {
        if (!pages.includes(i)) {
            pages.push(i);
        }
    }

    // Selalu tampilkan halaman terakhir
    if (last_page > 1 && !pages.includes(last_page)) {
        pages.push(last_page);
    }

    const pagesWithDots = [];
    let lastPage = 0;
    for (const page of pages) {
        if (lastPage !== 0 && page - lastPage > 1) {
            pagesWithDots.push('...');
        }
        pagesWithDots.push(page);
        lastPage = page;
    }

    return pagesWithDots;
  };

  const pages = pageNumbers();

  return (
    <div className="flex items-center justify-between bg-white border-t border-gray-200 px-4 py-3 sm:px-6 rounded-b-xl">
      {/* Tampilan mobile (simple prev/next) */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => handlePageClick(current_page - 1)}
          disabled={current_page === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageClick(current_page + 1)}
          disabled={current_page === last_page}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Tampilan desktop */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Menampilkan <span className="font-medium">{from}</span> sampai <span className="font-medium">{to}</span> dari{' '}
            <span className="font-medium">{total}</span> hasil
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageClick(current_page - 1)}
              disabled={current_page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {pages.map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => handlePageClick(page)}
                  aria-current={current_page === page ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    current_page === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              )
            )}

            <button
              onClick={() => handlePageClick(current_page + 1)}
              disabled={current_page === last_page}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
