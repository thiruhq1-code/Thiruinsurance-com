import { Link } from "react-router-dom";
import { FileStack, ShieldPlus } from "lucide-react";
import { useInsurance } from "../../context/InsuranceContext";
import { PageHeader } from "../../components/ui/Misc";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import { formatINR, formatCoverage, formatDate } from "../../utils/format";
import { getIcon } from "../../utils/iconMap";
import { getCategoryBySlug } from "../../services/productsStore";

export default function MyPolicies() {
  const { policies, loading } = useInsurance();

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        eyebrow="Your protection"
        title="My Policies"
        description="All your active and past insurance policies."
        actions={<Button as={Link} to="/merchant/insurance" variant="emerald" icon={ShieldPlus}>Buy Insurance</Button>}
      />

      {policies.length === 0 ? (
        <EmptyState icon={FileStack} title="No policies yet" description="Once your first payment succeeds, your policy appears here." action={<Button as={Link} to="/merchant/insurance">Browse Insurance</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {policies.map((p) => {
            const cat = getCategoryBySlug(p.categorySlug);
            const Icon = getIcon(cat?.icon);
            return (
              <Link key={p.policyNumber} to={`/merchant/policies/${p.policyNumber}`} className="bg-white border border-navy-100 rounded-2xl p-5 hover:shadow-card transition-shadow policy-paper">
                <div className="flex items-start justify-between mb-4">
                  <span className="w-11 h-11 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center">
                    <Icon size={19} />
                  </span>
                  <StatusBadge status={p.status} />
                </div>
                <h3 className="font-display font-semibold text-navy-900">{p.planName}</h3>
                <p className="text-xs text-navy-400 mb-4">{p.categoryName}</p>
                <div className="grid grid-cols-2 gap-2 text-sm border-t border-dashed border-navy-200 pt-3">
                  <p><span className="text-navy-400 block text-xs">Coverage</span><span className="font-medium text-navy-800">{formatCoverage(p.coverage)}</span></p>
                  <p><span className="text-navy-400 block text-xs">Premium</span><span className="font-medium text-navy-800">{formatINR(p.premium)}</span></p>
                  <p><span className="text-navy-400 block text-xs">Valid till</span><span className="font-medium text-navy-800">{formatDate(p.endDate)}</span></p>
                  <p><span className="text-navy-400 block text-xs font-mono">Policy No.</span><span className="font-medium text-navy-800 font-mono text-xs">{p.policyNumber}</span></p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
