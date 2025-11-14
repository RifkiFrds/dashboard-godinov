import React from "react";
import { LayoutDashboard, Mail, LogOut } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";

export default function Sidebar({ collapsed }) {
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

      {/* Divider */}
      <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Menu */}
      <nav className="flex flex-1 flex-col gap-1">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" collapsed={collapsed} />
        <SidebarItem icon={Mail} label="Pesan" to="/inbox" collapsed={collapsed} />
      </nav>

      {/* Bottom Divider */}
      <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Logout */}
      <SidebarItem icon={LogOut} label="Logout" to="/logout" collapsed={collapsed} />
    </motion.aside>
  );
}
