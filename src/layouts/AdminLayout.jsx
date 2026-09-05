import { useState } from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, FileStack, Users, ClipboardList, Package, Wallet, BarChart3, Bell, Settings, User } from "lucide-react";
import DashboardSidebar from "../components/layout/DashboardSidebar";
import DashboardTopbar from "../components/layout/DashboardTopbar";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/applications", label: "Applications", icon: FileText },
  { to: "/admin/policies", label: "Policies", icon: FileStack },
  { to: "/admin/merchants", label: "Merchants", icon: Users },
  { to: "/admin/claims", label: "Claims", icon: ClipboardList },
  { to: "/admin/products", label: "Insurance Products", icon: Package },
  { to: "/admin/payments", label: "Payments", icon: Wallet },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/profile", label: "Admin Profile", icon: User },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-sand-50">
      <DashboardSidebar items={NAV_ITEMS} open={sidebarOpen} onClose={() => setSidebarOpen(false)} brandLabel="ADMIN PANEL" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} notifRoute="/admin/notifications" />
        <main className="flex-1 p-4 md:p-7 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
