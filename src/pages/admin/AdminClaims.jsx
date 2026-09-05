import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { useInsurance } from "../../context/InsuranceContext";
import { useToast } from "../../context/NotificationContext";
import * as api from "../../services/mockApi";
import { PageHeader, Tabs } from "../../components/ui/Misc";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { formatINR, formatDate } from "../../utils/format";

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "DOCUMENTS_REQUIRED", label: "Docs Required" },
  { value: "APPROVED", label: "Approved" },
  { value: "SETTLED", label: "Settled" },
  { value: "REJECTED", label: "Rejected" },
];

export default function AdminClaims() {
  const { claims, loading, refreshAll } = useInsurance();
  const { toast } = useToast();
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);

  if (loading) return <LoadingState />;

  const filtered = filter === "ALL" ? claims : claims.filter((c) => c.status === filter);

  async function updateStatus(status) {
    setProcessing(true);
    try {
      await api.updateClaimStatus(selected.id, status);
      await refreshAll();
      toast(`Claim ${selected.id} marked as ${status.replace("_", " ").toLowerCase()}.`);
      setSelected(null);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Assess & settle" title="Claims" description="Review and process claims raised against active policies." />

      <Tabs
        tabs={FILTERS.map((f) => ({ ...f, count: f.value === "ALL" ? claims.length : claims.filter((c) => c.status === f.value).length }))}
        active={filter}
        onChange={setFilter}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No claims found" />
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-navy-100 rounded-xl px-5 py-4 hover:shadow-card transition-shadow text-left"
            >
              <div>
                <p className="text-sm font-semibold text-navy-800">{c.claimType} <span className="text-navy-400 font-normal">· {c.merchantName}</span></p>
                <p className="text-xs text-navy-400 mt-1 font-mono">{c.id} · {c.policyNumber}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-navy-700">{formatINR(c.claimAmount)}</p>
                  <p className="text-xs text-navy-400">{formatDate(c.submittedDate)}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id}
        size="lg"
        footer={
          selected && !["SETTLED", "REJECTED"].includes(selected.status) ? (
            <>
              <Button variant="ghost" onClick={() => updateStatus("DOCUMENTS_REQUIRED")} loading={processing}>Request Documents</Button>
              <Button variant="danger" onClick={() => updateStatus("REJECTED")} loading={processing}>Reject</Button>
              {selected.status === "APPROVED" ? (
                <Button variant="emerald" onClick={() => updateStatus("SETTLED")} loading={processing}>Mark Settled</Button>
              ) : (
                <Button variant="emerald" onClick={() => updateStatus("APPROVED")} loading={processing}>Approve</Button>
              )}
            </>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <p><span className="text-navy-400">Merchant:</span> <span className="font-medium text-navy-800">{selected.merchantName}</span></p>
              <p><span className="text-navy-400">Policy:</span> <span className="font-medium text-navy-800 font-mono">{selected.policyNumber}</span></p>
              <p><span className="text-navy-400">Claim Amount:</span> <span className="font-medium text-navy-800">{formatINR(selected.claimAmount)}</span></p>
              <p><span className="text-navy-400">Incident Date:</span> <span className="font-medium text-navy-800">{formatDate(selected.incidentDate)}</span></p>
            </div>
            <div>
              <p className="text-xs text-navy-400 mb-1">Description</p>
              <p className="text-sm text-navy-600">{selected.description}</p>
            </div>
            <div>
              <p className="text-xs text-navy-400 mb-1">Current Status</p>
              <StatusBadge status={selected.status} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
