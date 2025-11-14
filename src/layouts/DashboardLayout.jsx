import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/sidebar/Header";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4F5FA]">

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Right Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
