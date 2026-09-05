import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import MerchantLayout from "../layouts/MerchantLayout";
import AdminLayout from "../layouts/AdminLayout";
import RoleRoute from "./RoleRoute";

// Public pages
import Home from "../pages/public/Home";
import InsuranceList from "../pages/public/InsuranceList";
import CategoryDetail from "../pages/public/CategoryDetail";
import PlanDetails from "../pages/public/PlanDetails";
import About from "../pages/public/About";
import FAQ from "../pages/public/FAQ";
import Contact from "../pages/public/Contact";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import AdminLogin from "../pages/admin/AdminLogin";

// Merchant pages
import MerchantDashboard from "../pages/merchant/Dashboard";
import MerchantInsurance from "../pages/merchant/MerchantInsurance";
import MerchantPlanList from "../pages/merchant/MerchantPlanList";
import ApplicationForm from "../pages/merchant/ApplicationForm";
import MyApplications from "../pages/merchant/MyApplications";
import ApplicationDetails from "../pages/merchant/ApplicationDetails";
import MyPolicies from "../pages/merchant/MyPolicies";
import PolicyDetails from "../pages/merchant/PolicyDetails";
import Claims from "../pages/merchant/Claims";
import RaiseClaim from "../pages/merchant/RaiseClaim";
import ClaimDetails from "../pages/merchant/ClaimDetails";
import Payments from "../pages/merchant/Payments";
import Notifications from "../pages/merchant/Notifications";
import MerchantProfile from "../pages/merchant/MerchantProfile";
import Support from "../pages/merchant/Support";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminApplications from "../pages/admin/AdminApplications";
import AdminApplicationDetails from "../pages/admin/AdminApplicationDetails";
import AdminPolicies from "../pages/admin/AdminPolicies";
import AdminMerchants from "../pages/admin/AdminMerchants";
import AdminClaims from "../pages/admin/AdminClaims";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminReports from "../pages/admin/AdminReports";
import AdminNotifications from "../pages/admin/AdminNotifications";
import { AdminSettings, AdminProfile } from "../pages/admin/AdminSettingsProfile";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/insurance" element={<InsuranceList />} />
        <Route path="/insurance/:categorySlug" element={<CategoryDetail />} />
        <Route path="/insurance/:categorySlug/:planId" element={<PlanDetails />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ADMIN LOGIN — standalone, no public navbar/footer */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* MERCHANT */}
      <Route element={<RoleRoute role="merchant"><MerchantLayout /></RoleRoute>}>
        <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
        <Route path="/merchant/insurance" element={<MerchantInsurance />} />
        <Route path="/merchant/insurance/apply/:planId" element={<ApplicationForm />} />
        <Route path="/merchant/insurance/:categorySlug" element={<MerchantPlanList />} />
        <Route path="/merchant/applications" element={<MyApplications />} />
        <Route path="/merchant/applications/:applicationId" element={<ApplicationDetails />} />
        <Route path="/merchant/policies" element={<MyPolicies />} />
        <Route path="/merchant/policies/:policyNumber" element={<PolicyDetails />} />
        <Route path="/merchant/claims" element={<Claims />} />
        <Route path="/merchant/claims/new" element={<RaiseClaim />} />
        <Route path="/merchant/claims/:claimId" element={<ClaimDetails />} />
        <Route path="/merchant/payments" element={<Payments />} />
        <Route path="/merchant/notifications" element={<Notifications />} />
        <Route path="/merchant/profile" element={<MerchantProfile />} />
        <Route path="/merchant/support" element={<Support />} />
      </Route>

      {/* ADMIN */}
      <Route element={<RoleRoute role="admin"><AdminLayout /></RoleRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/applications/:applicationId" element={<AdminApplicationDetails />} />
        <Route path="/admin/policies" element={<AdminPolicies />} />
        <Route path="/admin/merchants" element={<AdminMerchants />} />
        <Route path="/admin/claims" element={<AdminClaims />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
