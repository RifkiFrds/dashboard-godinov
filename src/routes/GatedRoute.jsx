import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../api/AuthContext";

export const GatedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Jika user tidak login atau role tidak ada di daftar yang diizinkan
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};