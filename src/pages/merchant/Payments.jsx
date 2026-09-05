import { Wallet } from "lucide-react";
import { useInsurance } from "../../context/InsuranceContext";
import { PageHeader } from "../../components/ui/Misc";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import { formatINR, formatDate } from "../../utils/format";

export default function Payments() {
  const { payments, loading } = useInsurance();

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader eyebrow="Transaction history" title="Payments" description="All premium payments made on your policies." />

      {payments.length === 0 ? (
        <EmptyState icon={Wallet} title="No payments yet" description="Payments you make toward policies will appear here." />
      ) : (
        <div className="bg-white border border-navy-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto thin-scroll">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-navy-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Payment ID</th>
                  <th className="text-left px-5 py-3 font-semibold">Policy</th>
                  <th className="text-left px-5 py-3 font-semibold">Amount</th>
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Method</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3.5 font-mono text-xs text-navy-600">{p.id}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-navy-600">{p.policyNumber}</td>
                    <td className="px-5 py-3.5 font-medium text-navy-800">{formatINR(p.amount)}</td>
                    <td className="px-5 py-3.5 text-navy-500">{formatDate(p.date)}</td>
                    <td className="px-5 py-3.5 text-navy-500">{p.method}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
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
