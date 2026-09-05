import { useNavigate } from "react-router-dom";
import { LogOut, KeyRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useInsurance } from "../../context/InsuranceContext";
import { PageHeader } from "../../components/ui/Misc";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useToast } from "../../context/NotificationContext";

export default function MerchantProfile() {
  const { user, logout } = useAuth();
  const { policies, notifications } = useInsurance();
  const navigate = useNavigate();
  const { toast } = useToast();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="Account" title="My Profile" />

      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <span className="w-16 h-16 rounded-full bg-navy-800 text-white flex items-center justify-center text-xl font-bold">
            {user?.name?.[0]}
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-navy-900">{user?.name}</h3>
            <p className="text-sm text-navy-400">{user?.id}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm border-t border-navy-100 pt-5">
          <div><p className="text-navy-400 text-xs mb-1">Email</p><p className="font-medium text-navy-800">{user?.email}</p></div>
          <div><p className="text-navy-400 text-xs mb-1">Mobile</p><p className="font-medium text-navy-800">{user?.mobile}</p></div>
          <div><p className="text-navy-400 text-xs mb-1">City</p><p className="font-medium text-navy-800">{user?.city}, {user?.state}</p></div>
          <div><p className="text-navy-400 text-xs mb-1">KYC Status</p><p className="font-medium text-navy-800">{user?.kycVerified ? "Verified" : "Pending"}</p></div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="text-center"><p className="font-display text-2xl font-semibold text-navy-900">{policies.length}</p><p className="text-xs text-navy-400 mt-1">Policies</p></Card>
        <Card className="text-center"><p className="font-display text-2xl font-semibold text-navy-900">{notifications.length}</p><p className="text-xs text-navy-400 mt-1">Notifications</p></Card>
        <Card className="text-center"><p className="font-display text-2xl font-semibold text-navy-900">{policies.filter(p=>p.status==="ACTIVE").length}</p><p className="text-xs text-navy-400 mt-1">Active</p></Card>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" icon={KeyRound} onClick={() => toast("Password change flow coming soon.", { type: "info" })}>
            Change Password
          </Button>
          <Button variant="danger" icon={LogOut} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
