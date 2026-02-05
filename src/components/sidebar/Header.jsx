import React, { useState, useRef, useEffect } from "react";
import { Menu, ChevronLeft, LogOut, User } from "lucide-react";
import { handleLogout } from "../../utils/logout";

export default function Header({ collapsed, setCollapsed }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const navigateToProfile = () => {
    setShowProfileDropdown(false);
    window.location.href = "/profile"; // Assuming /profile is your profile page route
  };

  const handleLogoutClick = () => {
    setShowProfileDropdown(false);
    handleLogout();
  };

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
      <div className="ml-auto flex items-center gap-4 relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-2 cursor-pointer transition hover:opacity-80"
          onClick={handleProfileClick}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1169/1169520.png"
            alt="Admin Avatar"
            className="h-10 w-10 rounded-full border border-gray-300 object-cover shadow-sm"
          />
        </div>

        {showProfileDropdown && (
          <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 top-full">
            <div className="py-1">
              <button
                onClick={handleLogoutClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <LogOut className="mr-3 h-4 w-4 text-gray-400" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
