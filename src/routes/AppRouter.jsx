import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import MessagesPage from "../pages/MessagesPage";

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
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="/inbox" element={<MessagesPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
