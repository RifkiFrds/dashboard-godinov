import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/LoginPage";
import Dashboard from "../pages/DashboardPage";
import Messages from "../pages/MessagesPage";
import DashboardLayout from "../layouts/DashboardLayout";

export default function AppRouter() {

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
  
    // Jika token tidak ada, arahkan ke login
    return token ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/inbox" element={<Messages />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
