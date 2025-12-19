import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react"; 
import api from "../api";
import PortfolioRow from "../components/portfolios/PortfolioRow";
import PortfolioFormModal from "../components/portfolios/PortfolioFormModal";
import EditPortfolioModal from "../components/portfolios/EditPortfolioModal";
import { H2 } from "../components/ui/Text";

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  {/*Handler Edit */}
  const handleOpenEdit = (item) => {
  setSelectedPortfolio(item);
  setIsEditModalOpen(true);
  };

  
  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/portfolio"); 
      setPortfolios(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching portfolios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  return (
    <div>
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <H2>Daftar Portfolio</H2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
        >
          <Plus size={18} />
          Tambah Portfolio
        </button>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
          Memuat data portfolio...
        </div>
      )}

      {/* CONTENT TABLE */}
      {!loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          
          {/* EMPTY STATE */}
          {portfolios.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Belum ada data portfolio. Silakan tambah baru.
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW */}
              <table className="w-full text-left hidden sm:table table-auto">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-600">
                    <th className="py-3 pl-2">Gambar</th>
                    <th className="py-3">Judul Project</th>
                    <th className="py-3">Deskripsi Singkat</th>
                    <th className="py-3">Link</th>
                    <th className="py-3 text-right pr-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolios.map((item) => (
                    <PortfolioRow
                    key={item.id}
                    isMobile={false}
                    item={item}
                    onOpen={() => handleOpenEdit(item)}
                    onUpdated={fetchPortfolios}
                    />
                  ))}
                </tbody>
              </table>

              {/* MOBILE LIST VIEW */}
              <div className="sm:hidden space-y-3">
                {portfolios.map((item) => (
                  <PortfolioRow
                  key={item.id}
                  item={item}
                  isMobile={true}
                  onOpen={() => handleEditClick(item)}
                  onUpdated={fetchPortfolios}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* MODAL FORM TAMBAH */}
      <PortfolioFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchPortfolios}
      />

      <EditPortfolioModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={fetchPortfolios}
          item={selectedPortfolio}
        />
    </div>
  );
}