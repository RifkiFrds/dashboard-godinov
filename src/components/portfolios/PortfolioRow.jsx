import React, { useState } from "react";
import { Pencil, Trash2, ExternalLink, ImageIcon } from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";
import ConfirmModal from "../ui/ConfirmModal";

export default function PortfolioRow({ item, onOpen, onUpdated, isMobile }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/portfolio/${item.id}`);
      toast.success("Portfolio berhasil dihapus");
      onUpdated();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus data");
    } finally {
      setIsDeleting(false);
      setOpenConfirm(false);
    }
  };


  if (isMobile) {
    return (
      <div className="border rounded-xl p-4 mb-3 shadow-sm bg-white flex gap-4 items-start">
       {/* --- MOBILE VIEW --- */}
      <div className="sm:hidden border rounded-xl p-4 mb-3 shadow-sm bg-white flex gap-4 items-start">
        {/* Gambar Mobile (Kiri) */}
        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon size={24} />
            </div>
          )}
        </div>

        {/* Detail Mobile (Kanan) */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">{item.title}</h4>
          <p className="text-gray-500 text-xs line-clamp-2 mt-1 mb-2">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between mt-3">
             {/* Link Mobile */}
            <div>
                {item.link_projects && (
                    <a href={item.link_projects} target="_blank" rel="noreferrer" className="text-blue-600 bg-blue-50 p-1.5 rounded-md">
                        <ExternalLink size={14} />
                    </a>
                )}
            </div>

            {/* Tombol Aksi Mobile */}
            <div className="flex gap-2">
              <button
                onClick={onOpen}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
              >
                Edit
              </button>
              <button
                onClick={() => setOpenConfirm(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
         {/* --- MODAL KONFIRMASI HAPUS --- */}
      <ConfirmModal
        open={openConfirm}
        title="Hapus Portfolio"
        message={`Apakah Anda yakin ingin menghapus portfolio "${item.title}"? Tindakan ini tidak dapat dibatalkan.`}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      </div>
    );
  }

  return (
    <>
      {/* --- DESKTOP VIEW --- */}
      <tr className="hidden sm:table-row border-b border-gray-200 text-sm hover:bg-gray-50 transition group">
        
        {/* Kolom Gambar */}
        <td className="py-3 pl-2 w-16">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
            {item.image_url ? (
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon size={18} className="text-gray-400" />
            )}
          </div>
        </td>

        {/* Kolom Judul */}
        <td className="py-3 font-medium text-gray-900">
          {item.title}
        </td>

        {/* Kolom Deskripsi*/}
        <td className="py-3 text-gray-600 max-w-xs truncate" title={item.description}>
          {item.description}
        </td>

        {/* Kolom Link Project */}
        <td className="py-3">
          {item.link_projects ? (
            <a 
              href={item.link_projects} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded text-xs font-medium transition"
            >
              Kunjungi <ExternalLink size={12} />
            </a>
          ) : (
            <span className="text-gray-400 text-xs italic">Tidak ada link</span>
          )}
        </td>

        {/* Kolom Aksi */}
        <td className="py-3 text-right pr-2 whitespace-nowrap">
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={onOpen}
              className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              title="Edit Data"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setOpenConfirm(true)}
              className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
              title="Hapus Data"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

     

      {/* --- MODAL KONFIRMASI HAPUS --- */}
      <ConfirmModal
        open={openConfirm}
        title="Hapus Portfolio"
        message={`Apakah Anda yakin ingin menghapus portfolio "${item.title}"? Tindakan ini tidak dapat dibatalkan.`}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  );
}