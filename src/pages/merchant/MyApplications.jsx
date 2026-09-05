import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { useInsurance } from "../../context/InsuranceContext";
import { PageHeader, Tabs } from "../../components/ui/Misc";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import { formatINR, formatDate } from "../../utils/format";
import Button from "../../components/ui/Button";

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "PENDING_APPROVAL", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "PAYMENT_PENDING", label: "Payment Pending" },
  { value: "ACTIVE", label: "Active" },
  { value: "REJECTED", label: "Rejected" },
];

export default function MyApplications() {
  const { applications, loading } = useInsurance();
  const [filter, setFilter] = useState("ALL");

  if (loading) return <LoadingState />;

  const filtered = filter === "ALL" ? applications : applications.filter((a) => a.status === filter);

  return (
    <div>
      <PageHeader eyebrow="Purchase history" title="My Applications" description="Track every insurance application you've submitted." />

      <Tabs
        tabs={FILTERS.map((f) => ({ ...f, count: f.value === "ALL" ? applications.length : applications.filter((a) => a.status === f.value).length }))}
        active={filter}
        onChange={setFilter}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications found"
          description="Applications you submit will show up here."
          action={<Button as={Link} to="/merchant/insurance">Browse Insurance</Button>}
        />
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map((a) => (
            <Link
              key={a.id}
              to={`/merchant/applications/${a.id}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-navy-100 rounded-xl px-5 py-4 hover:shadow-card transition-shadow"
            >
              <div>
                <p className="text-sm font-semibold text-navy-800">{a.planName} <span className="text-navy-400 font-normal">· {a.categoryName}</span></p>
                <p className="text-xs text-navy-400 mt-1 font-mono">{a.id}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-navy-700">{formatINR(a.premium)}</p>
                  <p className="text-xs text-navy-400">{formatDate(a.submittedDate)}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
