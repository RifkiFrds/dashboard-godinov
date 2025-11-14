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
      className="h-screen bg-[#1b0f4e] border-r border-white/10 p-4 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="px-2 py-3 flex items-center justify-start">
        <img
          src={logo}
          className={`object-contain transition-all ${
            collapsed ? "h-8 mx-auto" : "h-12"
          }`}
        />
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

      {/* Menu */}
      <nav className="flex flex-col gap-1 flex-1">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" collapsed={collapsed} />
        <SidebarItem icon={Mail} label="Pesan" to="/inbox" collapsed={collapsed} />
      </nav>

      {/* Bottom Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

      {/* Logout */}
      <SidebarItem icon={LogOut} label="Logout" to="/logout" collapsed={collapsed} />

    </motion.aside>
  );
}
