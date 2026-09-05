import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import * as api from "../../services/mockApi";
import { useInsurance } from "../../context/InsuranceContext";
import { useToast } from "../../context/NotificationContext";
import { Breadcrumb } from "../../components/ui/Misc";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Field, Textarea } from "../../components/ui/Input";
import Timeline from "../../components/shared/Timeline";
import { APPLICATION_TIMELINE_STEPS } from "../../data/statusConfig";
import { formatINR, formatCoverage, formatDate } from "../../utils/format";
import { getFrequency } from "../../utils/premiumFrequency";

export default function AdminApplicationDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { refreshAll } = useInsurance();
  const { toast } = useToast();
  const [app, setApp] = useState(undefined);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);

  async function load() {
    setApp(await api.getApplicationById(applicationId));
  }
  useEffect(() => { load(); }, [applicationId]);

  if (app === undefined) return <LoadingState label="Loading application..." />;
  if (app === null) {
    return <EmptyState title="Application not found" action={<Button onClick={() => navigate("/admin/applications")}>Back to Applications</Button>} />;
  }

  async function handleApprove() {
    setProcessing(true);
    try {
      await api.approveApplication(app.id);
      await refreshAll();
      await load();
      toast(`Application ${app.id} approved.`);
    } finally {
      setProcessing(false);
    }
  }

  async function handleReject() {
    setProcessing(true);
    try {
      await api.rejectApplication(app.id, reason);
      await refreshAll();
      await load();
      toast(`Application ${app.id} rejected.`, { type: "info" });
    } finally {
      setProcessing(false);
      setRejectOpen(false);
      setReason("");
    }
  }

  const canDecide = app.status === "PENDING_APPROVAL";

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: "Applications", href: "/admin/applications" }, { label: app.id }]} />

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">{app.categoryName}</p>
          <h1 className="font-display text-2xl font-semibold text-navy-950">{app.planName}</h1>
          <p className="text-sm text-navy-400 mt-1 font-mono">{app.id} · {app.merchantName}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {canDecide && (
        <Card className="mb-6 flex items-center justify-between flex-wrap gap-3 border-amber-200 bg-amber-50/50">
          <p className="text-sm font-medium text-navy-700">This application is awaiting your decision.</p>
          <div className="flex gap-2">
            <Button variant="danger" size="sm" icon={XCircle} onClick={() => setRejectOpen(true)}>Reject</Button>
            <Button variant="emerald" size="sm" icon={CheckCircle2} loading={processing} onClick={handleApprove}>Approve</Button>
          </div>
        </Card>
      )}

      {app.status === "REJECTED" && (
        <Card className="mb-6 border-red-200 bg-red-50/50">
          <p className="font-semibold text-navy-800 text-sm">Rejected</p>
          <p className="text-sm text-navy-500 mt-1">{app.rejectionReason}</p>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h3 className="font-display font-semibold text-navy-900 mb-4">Merchant Information</h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <p><span className="text-navy-400">Name:</span> <span className="font-medium text-navy-800">{app.merchantName}</span></p>
              <p><span className="text-navy-400">Merchant ID:</span> <span className="font-medium text-navy-800 font-mono">{app.merchantId}</span></p>
              <p><span className="text-navy-400">Mobile:</span> <span className="font-medium text-navy-800">{app.personal?.mobile}</span></p>
              <p><span className="text-navy-400">Email:</span> <span className="font-medium text-navy-800">{app.personal?.email}</span></p>
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-semibold text-navy-900 mb-4">Insurance Information</h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <p><span className="text-navy-400">Plan:</span> <span className="font-medium text-navy-800">{app.planName}</span></p>
              <p><span className="text-navy-400">Premium:</span> <span className="font-medium text-navy-800">{formatINR(app.premium)}</span></p>
              <p><span className="text-navy-400">Frequency:</span> <span className="font-medium text-navy-800">{getFrequency(app.premiumFrequency).label}</span></p>
              <p><span className="text-navy-400">Coverage:</span> <span className="font-medium text-navy-800">{formatCoverage(app.coverage)}</span></p>
              <p><span className="text-navy-400">Submitted:</span> <span className="font-medium text-navy-800">{formatDate(app.submittedDate)}</span></p>
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-semibold text-navy-900 mb-4">Nominee</h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <p><span className="text-navy-400">Name:</span> <span className="font-medium text-navy-800">{app.nominee?.name}</span></p>
              <p><span className="text-navy-400">Relationship:</span> <span className="font-medium text-navy-800">{app.nominee?.relationship}</span></p>
              <p><span className="text-navy-400">DOB:</span> <span className="font-medium text-navy-800">{app.nominee?.dob}</span></p>
              <p><span className="text-navy-400">Mobile:</span> <span className="font-medium text-navy-800">{app.nominee?.mobile}</span></p>
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-semibold text-navy-900 mb-3">Documents</h3>
            <ul className="text-sm text-navy-700 space-y-1.5">
              {app.documents?.map((d) => <li key={d}>📄 {d}</li>)}
            </ul>
          </Card>
        </div>

        <Card>
          <h3 className="font-display font-semibold text-navy-900 mb-4">Application Timeline</h3>
          <Timeline
            steps={APPLICATION_TIMELINE_STEPS}
            completed={app.timeline.filter((t) => APPLICATION_TIMELINE_STEPS.includes(t.step))}
            rejectedAt={app.status === "REJECTED" ? formatDate(app.rejectedDate) : null}
          />
        </Card>
      </div>

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject Application"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="danger" disabled={!reason.trim()} loading={processing} onClick={handleReject}>Confirm Reject</Button>
          </>
        }
      >
        <Field label="Rejection Reason" required>
          <Textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why this application is being rejected..." />
        </Field>
      </Modal>
    </div>
  );
}
