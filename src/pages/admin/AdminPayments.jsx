import { useState } from "react";
import { Wallet } from "lucide-react";
import { useInsurance } from "../../context/InsuranceContext";
import { PageHeader, Tabs } from "../../components/ui/Misc";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import { formatINR, formatDate } from "../../utils/format";

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "SUCCESS", label: "Success" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
];

export default function AdminPayments() {
  const { payments, loading } = useInsurance();
  const [filter, setFilter] = useState("ALL");

  if (loading) return <LoadingState />;

  const filtered = filter === "ALL" ? payments : payments.filter((p) => p.status === filter);
  const totalSuccess = payments.filter((p) => p.status === "SUCCESS").reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader eyebrow={`Total collected: ${formatINR(totalSuccess)}`} title="Payments" description="Every premium transaction processed on the platform." />

      <Tabs tabs={FILTERS.map((f) => ({ ...f, count: f.value === "ALL" ? payments.length : payments.filter((p) => p.status === f.value).length }))} active={filter} onChange={setFilter} />

      {filtered.length === 0 ? (
        <EmptyState icon={Wallet} title="No payments found" />
      ) : (
        <div className="bg-white border border-navy-100 rounded-2xl overflow-hidden mt-5">
          <div className="overflow-x-auto thin-scroll">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-navy-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Transaction ID</th>
                  <th className="text-left px-5 py-3 font-semibold">Merchant</th>
                  <th className="text-left px-5 py-3 font-semibold">Policy</th>
                  <th className="text-left px-5 py-3 font-semibold">Amount</th>
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Method</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3.5 font-mono text-xs text-navy-600">{p.id}</td>
                    <td className="px-5 py-3.5 text-navy-700">{p.merchantName}</td>
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
