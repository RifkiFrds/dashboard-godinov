import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/sidebar/Header";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
  <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* SIDEBAR*/}
      <Sidebar collapsed={collapsed} />

      {/* AREA KANAN */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        
        {/* HEADER*/}
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* CONTENT*/}
        <main className="p-6 transition-all duration-300">
           <div className="mx-auto max-w-7xl">
              <Outlet /> 
           </div>
        </main>
        
      </div>
    </div>
)}
