import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useInsurance } from "../../context/InsuranceContext";
import { markNotificationRead, markAllNotificationsRead } from "../../services/mockApi";

export default function DashboardTopbar({ onMenuClick, notifRoute }) {
  const { user, role, logout } = useAuth();
  const { notifications, unreadCount, refreshAll } = useInsurance();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="h-16 bg-white border-b border-navy-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-navy-600" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-10 h-10 rounded-full hover:bg-navy-50 flex items-center justify-center text-navy-500"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-navy-100 rounded-xl shadow-lifted overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-navy-100">
                <p className="font-semibold text-sm text-navy-800">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    className="text-xs text-emerald-700 font-medium"
                    onClick={async () => {
                      await markAllNotificationsRead({ role, userId: user.id });
                      refreshAll();
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto thin-scroll">
                {notifications.length === 0 ? (
                  <p className="text-sm text-navy-400 text-center py-8">No notifications yet.</p>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <button
                      key={n.id}
                      onClick={async () => {
                        await markNotificationRead(n.id);
                        refreshAll();
                        setNotifOpen(false);
                        if (notifRoute) navigate(notifRoute);
                      }}
                      className={`w-full text-left px-4 py-3 border-b border-navy-50 hover:bg-navy-50 flex gap-2 ${
                        !n.read ? "bg-emerald-50/40" : ""
                      }`}
                    >
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />}
                      <div className={!n.read ? "" : "pl-3.5"}>
                        <p className="text-sm font-medium text-navy-800">{n.title}</p>
                        <p className="text-xs text-navy-400 mt-0.5">{n.message}</p>
                        <p className="text-[11px] text-navy-300 mt-1">{n.date}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              {notifRoute && (
                <Link
                  to={notifRoute}
                  onClick={() => setNotifOpen(false)}
                  className="block text-center text-xs font-semibold text-emerald-700 py-2.5 hover:bg-navy-50"
                >
                  View all notifications
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setUserOpen((o) => !o)} className="flex items-center gap-2 pl-2">
            <span className="w-9 h-9 rounded-full bg-navy-800 text-white flex items-center justify-center text-xs font-bold">
              {user?.name?.[0] || "U"}
            </span>
            <span className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-navy-800">{user?.name}</span>
              <span className="text-[11px] text-navy-400 capitalize">{role}</span>
            </span>
            <ChevronDown size={14} className="text-navy-400 hidden sm:block" />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-navy-100 rounded-xl shadow-lifted overflow-hidden">
              <Link
                to={role === "admin" ? "/admin/profile" : "/merchant/profile"}
                onClick={() => setUserOpen(false)}
                className="block px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
