import { useState } from "react";
import { FileStack, Search } from "lucide-react";
import { useInsurance } from "../../context/InsuranceContext";
import { useToast } from "../../context/NotificationContext";
import { PageHeader } from "../../components/ui/Misc";
import { Input } from "../../components/ui/Input";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import { formatINR, formatCoverage, formatDate } from "../../utils/format";
import { getFrequency } from "../../utils/premiumFrequency";

export default function AdminPolicies() {
  const { policies, loading } = useInsurance();
  const { toast } = useToast();
  const [query, setQuery] = useState("");

  if (loading) return <LoadingState />;

  const filtered = policies.filter(
    (p) => p.merchantName.toLowerCase().includes(query.toLowerCase()) || p.policyNumber.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageHeader eyebrow="Manage cover" title="Policies" description="All issued policies across the platform." />
      <div className="max-w-sm mb-5">
        <Input icon={Search} placeholder="Search by merchant or policy number" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileStack} title="No policies found" />
      ) : (
        <div className="bg-white border border-navy-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto thin-scroll">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-navy-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Policy No.</th>
                  <th className="text-left px-5 py-3 font-semibold">Merchant</th>
                  <th className="text-left px-5 py-3 font-semibold">Insurance</th>
                  <th className="text-left px-5 py-3 font-semibold">Coverage</th>
                  <th className="text-left px-5 py-3 font-semibold">Premium</th>
                  <th className="text-left px-5 py-3 font-semibold">Frequency</th>
                  <th className="text-left px-5 py-3 font-semibold">Ends</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((p) => (
                  <tr key={p.policyNumber} className="hover:bg-navy-50/50">
                    <td className="px-5 py-3.5 font-mono text-xs text-navy-600">{p.policyNumber}</td>
                    <td className="px-5 py-3.5 text-navy-700">{p.merchantName}</td>
                    <td className="px-5 py-3.5 text-navy-600">{p.planName}</td>
                    <td className="px-5 py-3.5 text-navy-600">{formatCoverage(p.coverage)}</td>
                    <td className="px-5 py-3.5 font-medium text-navy-800">{formatINR(p.premium)}</td>
                    <td className="px-5 py-3.5 text-navy-500">{getFrequency(p.premiumFrequency).label}</td>
                    <td className="px-5 py-3.5 text-navy-500">{formatDate(p.endDate)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3.5">
                      <button
                        className="text-xs font-semibold text-navy-500 hover:text-red-600"
                        onClick={() => toast("Policy suspend/cancel actions coming soon.", { type: "info" })}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
