import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { handleLogout } from "../../utils/logout";

export default function SidebarItem({ icon: Icon, label, to, collapsed }) {
  const isLogout = label === "Logout";

  const handleClick = (e) => {
    if (isLogout) {
      e.preventDefault();
      handleLogout();
    }
  };

  return (
    <NavLink
      to={to}
      onClick={handleClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-white/10 hover:text-white",
          isActive ? "bg-white/20 text-white" : "text-white/70"
        )
      }
    >
      <Icon size={20} />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
