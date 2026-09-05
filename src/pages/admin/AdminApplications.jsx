import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Search } from "lucide-react";
import { useInsurance } from "../../context/InsuranceContext";
import { PageHeader, Tabs } from "../../components/ui/Misc";
import { Input } from "../../components/ui/Input";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import { formatINR, formatDate } from "../../utils/format";
import { getFrequency } from "../../utils/premiumFrequency";

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "PENDING_APPROVAL", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "PAYMENT_PENDING", label: "Payment Pending" },
  { value: "ACTIVE", label: "Active" },
  { value: "REJECTED", label: "Rejected" },
];

export default function AdminApplications() {
  const { applications, loading } = useInsurance();
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  if (loading) return <LoadingState />;

  const filtered = applications
    .filter((a) => filter === "ALL" || a.status === filter)
    .filter((a) => a.merchantName.toLowerCase().includes(query.toLowerCase()) || a.id.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <PageHeader eyebrow="Review & approve" title="Applications" description="All insurance applications submitted by merchants." />

      <div className="flex flex-col sm:flex-row gap-3 mb-2">
        <div className="max-w-sm w-full">
          <Input icon={Search} placeholder="Search by merchant or application ID" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <Tabs
        tabs={FILTERS.map((f) => ({ ...f, count: f.value === "ALL" ? applications.length : applications.filter((a) => a.status === f.value).length }))}
        active={filter}
        onChange={setFilter}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No applications found" description="Try a different filter or search term." />
      ) : (
        <div className="bg-white border border-navy-100 rounded-2xl overflow-hidden mt-5">
          <div className="overflow-x-auto thin-scroll">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-navy-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Application</th>
                  <th className="text-left px-5 py-3 font-semibold">Merchant</th>
                  <th className="text-left px-5 py-3 font-semibold">Insurance</th>
                  <th className="text-left px-5 py-3 font-semibold">Premium</th>
                  <th className="text-left px-5 py-3 font-semibold">Frequency</th>
                  <th className="text-left px-5 py-3 font-semibold">Submitted</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-navy-50/50">
                    <td className="px-5 py-3.5 font-mono text-xs text-navy-600">{a.id}</td>
                    <td className="px-5 py-3.5 text-navy-700">{a.merchantName}</td>
                    <td className="px-5 py-3.5 text-navy-600">{a.planName} <span className="text-navy-400">· {a.categoryName}</span></td>
                    <td className="px-5 py-3.5 font-medium text-navy-800">{formatINR(a.premium)}</td>
                    <td className="px-5 py-3.5 text-navy-500">{getFrequency(a.premiumFrequency).label}</td>
                    <td className="px-5 py-3.5 text-navy-500">{formatDate(a.submittedDate)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                    <td className="px-5 py-3.5">
                      <Link to={`/admin/applications/${a.id}`} className="text-xs font-semibold text-emerald-700">View</Link>
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
