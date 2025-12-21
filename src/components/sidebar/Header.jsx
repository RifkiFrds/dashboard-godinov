import React from "react";
import { Menu, ChevronLeft } from "lucide-react";

export default function Header({ collapsed, setCollapsed }) {
  return (
   <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 shadow-sm">
      {/* Sidebar Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="rounded-lg p-2 transition-colors hover:bg-gray-100"
      >
        {collapsed ? <ChevronLeft size={22} /> : <Menu size={22} />}
      </button>

      {/* Page Title */}
      <h1 className="ml-4 text-lg font-semibold text-gray-700">Dashboard</h1>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1169/1169520.png"
          alt="Admin Avatar"
          className="h-10 w-10 rounded-full border border-gray-300 object-cover shadow-sm transition hover:shadow-md"
        />
      </div>
    </header>
  );
}
