import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import { GatedRoute } from "./GatedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import MessagesPage from "../pages/MessagesPage";
import PortfolioPage from "../pages/PortfolioPage";
import MyProfilePage from "../pages/MyProfilePage";
import UnauthorizedPage from "../pages/UnauthorizedPage";


//Otorisasi Pages
import AuthorizationPage from "../pages/Authorizations/AuthorizationPage";
import ProjectOtpPage from "../pages/Authorizations/ProjectOtpPage";
import BudgetApprovalPage from "../pages/Authorizations/BudgetApprovalPage";
import ReimburseApprovalPage from "../pages/Authorizations/ReimburseApprovalPage";
import RoleManagementPage from "../pages/Authorizations/RoleManagementPage";
import SecurityAuditPage from "../pages/Authorizations/SecurityAuditPage";

//Projects Pages
import ProjectManagementPage from "../pages/Projects/ProjectManagementPage";
import ProjectDetailPage from "../pages/Projects/ProjectDetailPage";

//Finance Pages
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

//RAB Pages
import RABManagementPage from "../pages/Finance/RAB/RABManagementPage";
import ProjectSelectorPage from "../pages/Finance/RAB/ProjectSelectorPage";
// import RABProjectsPage from "../pages/Finance/RAB/RABProjectsPage";
import CAPEXModulesPage from "../pages/Finance/RAB/CAPEXModulesPage";
import OPEXModulesPage from "../pages/Finance/RAB/OPEXModulesPage";
import RevenueAssumptionsPage from "../pages/Finance/RAB/RevenueAssumptionsPage";
import ROICalculationPage from "../pages/Finance/RAB/ROICalculationPage";
import BreakEvenPage from "../pages/Finance/RAB/BreakEvenPage";
import RABDashboardPage from "../pages/Finance/RAB/RABDashboardPage";
import RABExportPage from "../pages/Finance/RAB/RABExportPage";
import RABSettingsPage from "../pages/Finance/RAB/RABSettingsPage";


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
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/authorization" element={<AuthorizationPage />} />
          <Route path="/inbox" element={<MessagesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/profile" element={<MyProfilePage />} /> {/* Add the new profile page route */}
          <Route path="/projects" element={<ProjectManagementPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />

          {/* Authorizations Routes Section */}
          <Route element={<GatedRoute allowedRoles={['pm', 'admin', 'cfo']} />}>
              <Route path="authorization">
                {/*Menu Utama Authorizations*/}
                <Route index element={<AuthorizationPage />} />

                 {/* Sub-Menu Authorizations */}
                <Route path="project-otp" element={<ProjectOtpPage />} />
                <Route path="budget-otp" element={<BudgetApprovalPage />} />
                <Route path="reimburse-otp" element={<ReimburseApprovalPage />} />
                <Route path="roles" element={<RoleManagementPage />} />
                <Route path="audit" element={<SecurityAuditPage />} /> 
              </Route>
          </Route>

           {/* Finance Routes Section */}
          <Route element={<GatedRoute allowedRoles={['finance', 'admin']} />}>
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
            <Route element={<GatedRoute allowedRoles={['finance', 'pm', 'admin']} />} />
              <Route path="rab">
                  {/* 1. Menu CAPEX */}
                  <Route 
                    path="/rab/capex-select" 
                    element={
                      <ProjectSelectorPage 
                        pageTitle="Pilih Proyek untuk CAPEX" 
                        description="Pilih proyek untuk mengelola modul dan biaya development."
                        basePath="/rab/capex-modules" 
                      />
                    } 
                  />

                  {/* 2. Menu OPEX */}
                  <Route 
                    path="/rab/opex-select" 
                    element={
                      <ProjectSelectorPage 
                        pageTitle="Pilih Proyek untuk OPEX" 
                        description="Kelola biaya operasional rutin (bulanan/tahunan)."
                        basePath="/rab/opex-components" 
                      />
                    } 
                  />

                  {/* 3. Menu Asumsi Pendapatan */}
                  <Route 
                    path="/rab/revenue-select" 
                    element={
                      <ProjectSelectorPage 
                        pageTitle="Pilih Proyek untuk Simulasi Revenue" 
                        description="Atur asumsi volume pengguna dan tarif layanan."
                        basePath="/rab/revenue-assumptions" 
                      />
                    } 
                  />

                  {/* 4. Menu ROI Analysis */}
                  <Route 
                    path="/rab/roi-select" 
                    element={
                      <ProjectSelectorPage 
                        pageTitle="Analisis ROI & NPV" 
                        description="Lihat hasil kalkulasi profitabilitas proyek."
                        basePath="/rab/roi-analysis" 
                      />
                    } 
                  />

                  {/* 5. Menu Break Even */}
                  <Route 
                    path="/rab/break-select" 
                    element={
                      <ProjectSelectorPage 
                        pageTitle="Break Even Point" 
                        description="Lihat titik impas berdasarkan biaya tetap dan margin kontribusi."
                        basePath="/rab/break-even" 
                      />
                    } 
                  />

                   {/* 6. Menu Dashboard */}
                  <Route 
                    path="/rab/dashboard-select" 
                    element={
                      <ProjectSelectorPage 
                        pageTitle="Metrics Summary" 
                        description="Lihat dashboard."
                        basePath="/rab/dashboard" 
                      />
                    } 
                  />

                  {/* 7. Menu Export */}
                  <Route 
                    path="/rab/export-select" 
                    element={
                      <ProjectSelectorPage 
                        pageTitle="Export Proposal" 
                        description="export dokumen data project."
                        basePath="/rab/export" 
                      />
                    } 
                  />

                <Route index element={<RABManagementPage />} />
                {/*<Route path="projects/:projectId" element={<RABProjectsPage />} />*/}
                <Route path="capex-modules/:projectId" element={<CAPEXModulesPage />} />
                <Route path="opex-components/:projectId" element={<OPEXModulesPage />} />
                <Route path="revenue-assumptions/:projectId" element={<RevenueAssumptionsPage />} />
                <Route path="roi-analysis/:projectId" element={<ROICalculationPage />} />
                <Route path="break-even/:projectId" element={<BreakEvenPage />} /> 
                <Route path="dashboard/:projectId" element={<RABDashboardPage />} />     
                <Route path="export/:projectId" element={<RABExportPage />} />
                <Route path="settings" element={<RABSettingsPage />} /> 
              </Route>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

