import React from "react";
import { LayoutDashboard, Mail, LogOut, NotebookTabs, ListTodo, DollarSign, User } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../api/AuthContext";
import { MENU_ITEMS } from "../../lib/menuItems";

export default function Sidebar({ collapsed }) {
  const { user, loading } = useAuth(); // Ambil data user dari Context
  // Jika sedang loading, menampilkan skeleton atau null
  if (loading) return null;

  //filter role
  const filteredMenu = MENU_ITEMS.filter((item) =>
    item.roles.includes(user?.role)
  );

return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.25 }}
      className="flex h-screen flex-col overflow-hidden border-r border-white/10 bg-[#1b0f4e] p-4"
    >
      {/* Logo */}
      <div className="flex items-center justify-start px-2 py-3">
        <img
          src={logo}
          alt="Logo"
          className={`object-contain transition-all ${collapsed ? "mx-auto h-8" : "h-12"}`}
        />
      </div>

      <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Menu Dinamis */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
        {loading ? (
          // Opsi: Tampilkan loading state sederhana di dalam sidebar
          <div className="text-white/50 text-xs p-3">Loading menu...</div>
        ) : (
          filteredMenu.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              collapsed={collapsed}
            />
          ))
        )}
      </nav>

      {/* Logout  */}
      <SidebarItem 
        icon={LogOut} 
        label="Logout" 
        to="/login" 
        collapsed={collapsed} 
      />

      <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />


    </motion.aside>
  );
}
