import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import { GatedRoute } from "./GatedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// --- Pages Imports ---
// Public & Core Pages
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import MessagesPage from "../pages/MessagesPage";
import PortfolioPage from "../pages/PortfolioPage";
import MyProfilePage from "../pages/MyProfilePage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ProjectManagementPage from "../pages/Projects/ProjectManagementPage";
import ProjectDetailPage from "../pages/Projects/ProjectDetailPage";

// Authorizations Pages
import AuthorizationPage from "../pages/Authorizations/AuthorizationPage";
import ProjectOtpPage from "../pages/Authorizations/ProjectOtpPage";
import BudgetApprovalPage from "../pages/Authorizations/BudgetApprovalPage";
import ReimburseApprovalPage from "../pages/Authorizations/ReimburseApprovalPage";
import RoleManagementPage from "../pages/Authorizations/RoleManagementPage";
import SecurityAuditPage from "../pages/Authorizations/SecurityAuditPage";

// Finance Pages
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

// Submission Pages
import SubmissionPage from "../pages/Submission/SubmissionPage";
import ReimbursementPage from "../pages/Submission/ReimbursementPage";

// RAB Pages
import RABManagementPage from "../pages/Finance/RAB/RABManagementPage";
import ProjectSelectorPage from "../pages/Finance/RAB/ProjectSelectorPage";
import CAPEXModulesPage from "../pages/Finance/RAB/CAPEXModulesPage";
import OPEXModulesPage from "../pages/Finance/RAB/OPEXModulesPage";
import RevenueAssumptionsPage from "../pages/Finance/RAB/RevenueAssumptionsPage";
import ROICalculationPage from "../pages/Finance/RAB/ROICalculationPage";
import BreakEvenPage from "../pages/Finance/RAB/BreakEvenPage";
import RABDashboardPage from "../pages/Finance/RAB/RABDashboardPage";
import RABExportPage from "../pages/Finance/RAB/RABExportPage";
import RABSettingsPage from "../pages/Finance/RAB/RABSettingsPage";


// --- Route Configurations ---

const coreRoutes = [
  { path: "/", element: <DashboardPage />, index: true },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/authorization", element: <AuthorizationPage /> },
  { path: "/inbox", element: <MessagesPage /> },
  { path: "/portfolio", element: <PortfolioPage /> },
  { path: "/profile", element: <MyProfilePage /> },
  { path: "/projects", element: <ProjectManagementPage /> },
  { path: "/projects/:id", element: <ProjectDetailPage /> },
];

const authRoutes = [
  { path: "", element: <AuthorizationPage />, index: true },
  { path: "project-otp", element: <ProjectOtpPage /> },
  { path: "budget-otp", element: <BudgetApprovalPage /> },
  { path: "reimburse-otp", element: <ReimburseApprovalPage /> },
  { path: "roles", element: <RoleManagementPage /> },
  { path: "audit", element: <SecurityAuditPage /> },
];

const financeRoutes = [
  { path: "", element: <FinancePage />, index: true },
  { path: "invoices", element: <InvoicePage /> },
  { path: "cashflow", element: <CashFlowPage /> },
  { path: "budgeting", element: <BudgetingPage /> },
  { path: "expenses", element: <ExpenseReimbursePage /> },
  { path: "assets", element: <AssetManagementPage /> },
  { path: "payroll", element: <PayrollPage /> },
  { path: "tax", element: <TaxManagementPage /> },
  { path: "procurement", element: <ProcurementPage /> },
  { path: "reports", element: <FinancialReportPage /> },
];

const submissionRoutes = [
  { path: "", element: <SubmissionPage />, index: true },
  { path: "reimburse", element: <ReimbursementPage /> },
  { path: "medical", element: <CashFlowPage /> },
  { path: "cash-advance", element: <BudgetingPage /> },
  { path: "leave", element: <ExpenseReimbursePage /> },
  { path: "overtime", element: <AssetManagementPage /> },
  { path: "business-trip", element: <PayrollPage /> },
  { path: "inventory", element: <TaxManagementPage /> },
  { path: "update-profile", element: <ProcurementPage /> },
  { path: "certificate", element: <FinancialReportPage /> },
];

const rabSelectorRoutes = [
  { path: "capex-select", title: "Pilih Proyek untuk CAPEX", desc: "Pilih proyek untuk mengelola modul dan biaya development.", basePath: "/rab/capex-modules" },
  { path: "opex-select", title: "Pilih Proyek untuk OPEX", desc: "Kelola biaya operasional rutin (bulanan/tahunan).", basePath: "/rab/opex-components" },
  { path: "revenue-select", title: "Pilih Proyek untuk Simulasi Revenue", desc: "Atur asumsi volume pengguna dan tarif layanan.", basePath: "/rab/revenue-assumptions" },
  { path: "roi-select", title: "Analisis ROI & NPV", desc: "Lihat hasil kalkulasi profitabilitas proyek.", basePath: "/rab/roi-analysis" },
  { path: "break-select", title: "Break Even Point", desc: "Lihat titik impas berdasarkan biaya tetap dan margin kontribusi.", basePath: "/rab/break-even" },
  { path: "dashboard-select", title: "Metrics Summary", desc: "Lihat dashboard.", basePath: "/rab/dashboard" },
  { path: "export-select", title: "Export Proposal", desc: "export dokumen data project.", basePath: "/rab/export" },
];

const rabDetailRoutes = [
  { path: "", element: <RABManagementPage />, index: true },
  { path: "capex-modules/:projectId", element: <CAPEXModulesPage /> },
  { path: "opex-components/:projectId", element: <OPEXModulesPage /> },
  { path: "revenue-assumptions/:projectId", element: <RevenueAssumptionsPage /> },
  { path: "roi-analysis/:projectId", element: <ROICalculationPage /> },
  { path: "break-even/:projectId", element: <BreakEvenPage /> },
  { path: "dashboard/:projectId", element: <RABDashboardPage /> },
  { path: "export/:projectId", element: <RABExportPage /> },
  { path: "settings", element: <RABSettingsPage /> },
];


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// Helper component untuk merender array dari object route
const renderRoutes = (routes) => 
  routes.map(({ path, element, index }, i) => (
    <Route key={i} path={index ? undefined : path} index={index} element={element} />
  ));


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          
          {/* Core Routes */}
          {renderRoutes(coreRoutes)}

          {/* Authorizations Routes */}
          <Route element={<GatedRoute allowedRoles={['pm', 'admin', 'cfo']} />}>
            <Route path="authorization">
              {renderRoutes(authRoutes)}
            </Route>
          </Route>

          {/* Finance Routes */}
          <Route element={<GatedRoute allowedRoles={['finance', 'admin']} />}>
            <Route path="finance">
              {renderRoutes(financeRoutes)}
            </Route>
          </Route>

          {/* Submission Routes */}
          <Route element={<GatedRoute allowedRoles={['finance', 'frontend', 'backend', 'uiux', 'pm', 'admin']} />}>
            <Route path="submissions">
              {renderRoutes(submissionRoutes)}
            </Route>
          </Route>

          {/* RAB Routes */}
          <Route element={<GatedRoute allowedRoles={['finance', 'pm', 'admin']} />}>
            <Route path="rab">
              {/* Selector Routes using map for cleaner code */}
              {rabSelectorRoutes.map((route, i) => (
                <Route 
                  key={i} 
                  path={route.path} 
                  element={
                    <ProjectSelectorPage 
                      pageTitle={route.title} 
                      description={route.desc} 
                      basePath={route.basePath} 
                    />
                  } 
                />
              ))}

              {/* RAB Detail & Settings Routes */}
              {renderRoutes(rabDetailRoutes)}
            </Route>
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}