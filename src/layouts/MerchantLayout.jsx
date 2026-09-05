import { useState } from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, ShieldPlus, FileText, FileStack, ClipboardList, Wallet, Bell, User, HelpCircle } from "lucide-react";
import DashboardSidebar from "../components/layout/DashboardSidebar";
import DashboardTopbar from "../components/layout/DashboardTopbar";

const NAV_ITEMS = [
  { to: "/merchant/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/merchant/insurance", label: "All Insurance", icon: ShieldPlus },
  { to: "/merchant/applications", label: "My Applications", icon: FileText },
  { to: "/merchant/policies", label: "My Policies", icon: FileStack },
  { to: "/merchant/claims", label: "Claims", icon: ClipboardList },
  { to: "/merchant/payments", label: "Payments", icon: Wallet },
  { to: "/merchant/notifications", label: "Notifications", icon: Bell },
  { to: "/merchant/profile", label: "Profile", icon: User },
  { to: "/merchant/support", label: "Help & Support", icon: HelpCircle },
];

export default function MerchantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-sand-50">
      <DashboardSidebar items={NAV_ITEMS} open={sidebarOpen} onClose={() => setSidebarOpen(false)} brandLabel="MERCHANT PORTAL" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} notifRoute="/merchant/notifications" />
        <main className="flex-1 p-4 md:p-7 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
