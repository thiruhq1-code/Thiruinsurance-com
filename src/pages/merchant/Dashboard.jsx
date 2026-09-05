import { Link } from "react-router-dom";
import { FileStack, FileClock, ClipboardList, Wallet, TrendingUp, ArrowRight, ShieldPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useInsurance } from "../../context/InsuranceContext";
import { PageHeader, StatCard } from "../../components/ui/Misc";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { formatINR, formatDate } from "../../utils/format";

export default function MerchantDashboard() {
  const { user } = useAuth();
  const { applications, policies, claims, loading } = useInsurance();

  if (loading) return <LoadingState label="Loading your dashboard..." />;

  const activePolicies = policies.filter((p) => p.status === "ACTIVE");
  const pendingApplications = applications.filter((a) => ["SUBMITTED", "PENDING_APPROVAL"].includes(a.status));
  const pendingClaims = claims.filter((c) => !["SETTLED", "REJECTED"].includes(c.status));
  const totalPremium = policies.reduce((sum, p) => sum + (p.premium || 0), 0);

  return (
    <div>
      <PageHeader
        eyebrow="Welcome back"
        title={`Hi ${user?.name?.split(" ")[0]}, here's your coverage overview`}
        actions={
          <Button as={Link} to="/merchant/insurance" variant="emerald" icon={ShieldPlus}>
            Buy Insurance
          </Button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Policies" value={policies.length} icon={FileStack} tone="navy" />
        <StatCard label="Active Policies" value={activePolicies.length} icon={ShieldPlus} tone="emerald" />
        <StatCard label="Pending Applications" value={pendingApplications.length} icon={FileClock} tone="amber" />
        <StatCard label="Total Premium Paid" value={formatINR(totalPremium)} icon={TrendingUp} tone="navy" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card padded={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100">
            <h3 className="font-display font-semibold text-navy-900">Recent Applications</h3>
            <Link to="/merchant/applications" className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {applications.length === 0 ? (
            <EmptyState title="No applications yet" description="Start by browsing insurance plans." icon={FileClock} />
          ) : (
            <div className="divide-y divide-navy-50">
              {applications.slice(0, 4).map((a) => (
                <Link key={a.id} to={`/merchant/applications/${a.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-navy-50">
                  <div>
                    <p className="text-sm font-medium text-navy-800">{a.planName} <span className="text-navy-400 font-normal">· {a.categoryName}</span></p>
                    <p className="text-xs text-navy-400 mt-0.5">{a.id} · {formatDate(a.submittedDate)}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100">
            <h3 className="font-display font-semibold text-navy-900">Active Policies</h3>
            <Link to="/merchant/policies" className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {activePolicies.length === 0 ? (
            <EmptyState title="No active policies" description="Once your payment succeeds, policies show up here." icon={FileStack} />
          ) : (
            <div className="divide-y divide-navy-50">
              {activePolicies.slice(0, 4).map((p) => (
                <Link key={p.policyNumber} to={`/merchant/policies/${p.policyNumber}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-navy-50">
                  <div>
                    <p className="text-sm font-medium text-navy-800">{p.planName} <span className="text-navy-400 font-normal">· {p.categoryName}</span></p>
                    <p className="text-xs text-navy-400 mt-0.5 font-mono">{p.policyNumber}</p>
                  </div>
                  <p className="text-xs text-navy-400">Till {formatDate(p.endDate)}</p>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100">
            <h3 className="font-display font-semibold text-navy-900">Recent Claims</h3>
            <Link to="/merchant/claims" className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {claims.length === 0 ? (
            <EmptyState title="No claims filed" description="Claims for your active policies will appear here." icon={ClipboardList} />
          ) : (
            <div className="divide-y divide-navy-50">
              {claims.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-navy-800">{c.claimType} <span className="text-navy-400 font-normal">· {formatINR(c.claimAmount)}</span></p>
                    <p className="text-xs text-navy-400 mt-0.5">{c.id} · {formatDate(c.submittedDate)}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100">
            <h3 className="font-display font-semibold text-navy-900">Quick Actions</h3>
          </div>
          <div className="p-5 space-y-3">
            <Button as={Link} to="/merchant/insurance" variant="outline" className="w-full justify-start" icon={ShieldPlus}>
              Buy Insurance
            </Button>
            <Button as={Link} to="/merchant/policies" variant="outline" className="w-full justify-start" icon={FileStack}>
              View Policies
            </Button>
            <Button as={Link} to="/merchant/claims" variant="outline" className="w-full justify-start" icon={ClipboardList}>
              Raise Claim
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
