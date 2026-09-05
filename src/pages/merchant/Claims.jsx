import { Link } from "react-router-dom";
import { ClipboardList, Plus } from "lucide-react";
import { useInsurance } from "../../context/InsuranceContext";
import { PageHeader } from "../../components/ui/Misc";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import { formatINR, formatDate } from "../../utils/format";

export default function Claims() {
  const { claims, policies, loading } = useInsurance();

  if (loading) return <LoadingState />;

  const activePolicies = policies.filter((p) => p.status === "ACTIVE");

  return (
    <div>
      <PageHeader
        eyebrow="File & track"
        title="Claims"
        description="Raise claims against your active policies and track their progress."
        actions={
          <Button as={Link} to="/merchant/claims/new" variant="emerald" icon={Plus} disabled={activePolicies.length === 0}>
            Raise Claim
          </Button>
        }
      />

      {claims.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No claims filed"
          description={activePolicies.length === 0 ? "You need an active policy before you can raise a claim." : "Raise a claim against any of your active policies."}
          action={activePolicies.length > 0 && <Button as={Link} to="/merchant/claims/new">Raise a Claim</Button>}
        />
      ) : (
        <div className="space-y-3">
          {claims.map((c) => (
            <Link key={c.id} to={`/merchant/claims/${c.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-navy-100 rounded-xl px-5 py-4 hover:shadow-card transition-shadow">
              <div>
                <p className="text-sm font-semibold text-navy-800">{c.claimType} <span className="text-navy-400 font-normal">· {c.categoryName}</span></p>
                <p className="text-xs text-navy-400 mt-1 font-mono">{c.id} · {c.policyNumber}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-navy-700">{formatINR(c.claimAmount)}</p>
                  <p className="text-xs text-navy-400">{formatDate(c.submittedDate)}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
