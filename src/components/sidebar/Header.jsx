import React from "react";
import { Menu, ChevronLeft } from "lucide-react";

export default function Header({ collapsed, setCollapsed }) {
  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center px-4">
      
      {/* Sidebar Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {collapsed ? <ChevronLeft size={22} /> : <Menu size={22} />}
      </button>

      {/* Page Title */}
      <h1 className="ml-4 text-lg font-semibold text-gray-700">Dashboard</h1>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-4">
        
        {/* Profile Avatar */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/1169/1169520.png"
          alt="Admin Avatar"
          className="h-10 w-10 object-cover rounded-full border border-gray-300 shadow-sm hover:shadow-md transition"
        />

      </div>
    </header>
  );
}
