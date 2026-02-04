import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import MessagesPage from "../pages/MessagesPage";
import PortfolioPage from "../pages/PortfolioPage";
import MyProfilePage from "../pages/MyProfilePage"; // Import the new page

//Projects Page
import ProjectManagementPage from "../pages/Projects/ProjectManagementPage";
import ProjectDetailPage from "../pages/Projects/ProjectDetailPage";

//Finance Page
import FinancePage from "../pages/Finance/FinancePage";
import InvoicePage from "../pages/Finance/InvoicePage";
import CashFlowPage from "../pages/Finance/CashFlowPage";
import BudgetingPage from "../pages/Finance/BudgetingPage";
import PayrollPage from "../pages/Finance/PayrollPage";
import ExpenseReimbursePage from "../pages/Finance/ExpenseReimbursePage";
import TaxManagementPage from "../pages/Finance/TaxManagementPage";
import AssetManagementPage from "../pages/Finance/AssetManagementPage";
import ProcurementPage from "../pages/Finance/ProcurementPage";
import FinancialReportPage from "../pages/Finance/FinancialReportPage";

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
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/profile" element={<MyProfilePage />} /> {/* Add the new profile page route */}
          <Route path="/projects" element={<ProjectManagementPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
         
         {/* Finance Routes Section */}
          <Route path="finance">
            {/* Menu Utama Finance */}
            <Route index element={<FinancePage />} /> 
            
            {/* Sub-Menu Finance */}
            <Route path="invoices" element={<InvoicePage />} />
            <Route path="cashflow" element={<CashFlowPage />} />
            <Route path="budgeting" element={<BudgetingPage />} />
            <Route path="expenses" element={<ExpenseReimbursePage />} />
            <Route path="assets" element={<AssetManagementPage />} />
            <Route path="payroll" element={<PayrollPage />} /> 
            <Route path="tax" element={<TaxManagementPage />} />     
            <Route path="procurement" element={<ProcurementPage />} />
            <Route path="reports" element={<FinancialReportPage />} /> 
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
