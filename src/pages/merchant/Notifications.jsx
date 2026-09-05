import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useInsurance } from "../../context/InsuranceContext";
import { markAllNotificationsRead, markNotificationRead } from "../../services/mockApi";
import { PageHeader } from "../../components/ui/Misc";
import { LoadingState, EmptyState } from "../../components/ui/States";
import Button from "../../components/ui/Button";
import { formatDate } from "../../utils/format";

export default function Notifications() {
  const { user, role } = useAuth();
  const { notifications, loading, refreshAll, unreadCount } = useInsurance();

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        eyebrow="Stay updated"
        title="Notifications"
        description="Updates on your applications, payments, policies and claims."
        actions={
          unreadCount > 0 && (
            <Button variant="outline" onClick={async () => { await markAllNotificationsRead({ role, userId: user.id }); refreshAll(); }}>
              Mark all read
            </Button>
          )
        }
      />

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="bg-white border border-navy-100 rounded-2xl divide-y divide-navy-50 overflow-hidden">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={async () => { await markNotificationRead(n.id); refreshAll(); }}
              className={`w-full text-left flex gap-3 px-5 py-4 hover:bg-navy-50 ${!n.read ? "bg-emerald-50/40" : ""}`}
            >
              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />}
              <div className={!n.read ? "" : "pl-3.5"}>
                <p className="text-sm font-semibold text-navy-800">{n.title}</p>
                <p className="text-sm text-navy-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-navy-300 mt-1">{formatDate(n.date)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
