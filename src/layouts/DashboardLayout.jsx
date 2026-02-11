import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/sidebar/Header";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Untuk mobile toggle

  return (
    // 1. CONTAINER UTAMA: Kunci setinggi layar & matikan scroll window browser
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* --- SIDEBAR (KIRI) --- */}
      {/* Sidebar biasanya menangani state collapsed di dalamnya atau via props */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* --- WRAPPER KANAN --- */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-auto">


        {/* 3. AREA KONTEN */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 scroll-smooth">
          <div className="mx-auto max-w-7xl">
            {/* Tempat halaman-halaman (Dashboard, Settings, dll) di-render */}
            <Outlet />
          </div>
        </main>
        
      </div>
    </div>
  );
}
        // {/* 2. HEADER: Fixed di atas (Tidak ikut scroll) */}
        // <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />