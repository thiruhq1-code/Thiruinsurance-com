import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreditCard, AlertCircle } from "lucide-react";
import * as api from "../../services/mockApi";
import { useInsurance } from "../../context/InsuranceContext";
import { useToast } from "../../context/NotificationContext";
import { Breadcrumb } from "../../components/ui/Misc";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Timeline from "../../components/shared/Timeline";
import PaymentMethodFields from "../../components/shared/PaymentMethodFields";
import { APPLICATION_TIMELINE_STEPS } from "../../data/statusConfig";
import { formatINR, formatCoverage, formatDate } from "../../utils/format";

export default function ApplicationDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { refreshAll } = useInsurance();
  const { toast } = useToast();
  const [app, setApp] = useState(undefined);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [method, setMethod] = useState("UPI");
  const [fieldsValid, setFieldsValid] = useState(false);
  const [paying, setPaying] = useState(false);

  async function load() {
    const data = await api.getApplicationById(applicationId);
    setApp(data);
  }

  useEffect(() => {
    load();
  }, [applicationId]);

  if (app === undefined) return <LoadingState label="Loading application..." />;
  if (app === null) {
    return <EmptyState title="Application not found" action={<Button onClick={() => navigate("/merchant/applications")}>Back to Applications</Button>} />;
  }

  async function handlePay() {
    setPaying(true);
    try {
      const { policy } = await api.createPayment({ applicationId: app.id, method });
      await refreshAll();
      toast(`Payment successful! Policy ${policy.policyNumber} is now active.`);
      navigate(`/merchant/policies/${policy.policyNumber}`);
    } catch (err) {
      toast(err.message, { type: "error" });
    } finally {
      setPaying(false);
      setPayModalOpen(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: "My Applications", href: "/merchant/applications" }, { label: app.id }]} />

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">{app.categoryName}</p>
          <h1 className="font-display text-2xl font-semibold text-navy-950">{app.planName}</h1>
          <p className="text-sm text-navy-400 mt-1 font-mono">{app.id}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {app.status === "PAYMENT_PENDING" && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50/50 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-semibold text-navy-800 text-sm">Your application is approved!</p>
            <p className="text-sm text-navy-500">Complete payment of {formatINR(app.premium)} to activate your policy.</p>
          </div>
          <Button variant="emerald" icon={CreditCard} onClick={() => setPayModalOpen(true)}>
            Pay Now
          </Button>
        </Card>
      )}

      {app.status === "REJECTED" && (
        <Card className="mb-6 border-red-200 bg-red-50/50">
          <div className="flex gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-navy-800 text-sm">Application Rejected</p>
              <p className="text-sm text-navy-500 mt-1">{app.rejectionReason}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h3 className="font-display font-semibold text-navy-900 mb-4">Application Summary</h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <p><span className="text-navy-400">Premium:</span> <span className="font-medium text-navy-800">{formatINR(app.premium)}</span></p>
              <p><span className="text-navy-400">Coverage:</span> <span className="font-medium text-navy-800">{formatCoverage(app.coverage)}</span></p>
              <p><span className="text-navy-400">Submitted:</span> <span className="font-medium text-navy-800">{formatDate(app.submittedDate)}</span></p>
              {app.approvedDate && <p><span className="text-navy-400">Approved:</span> <span className="font-medium text-navy-800">{formatDate(app.approvedDate)}</span></p>}
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-semibold text-navy-900 mb-4">Personal Details</h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <p><span className="text-navy-400">Name:</span> <span className="font-medium text-navy-800">{app.personal?.fullName}</span></p>
              <p><span className="text-navy-400">Mobile:</span> <span className="font-medium text-navy-800">{app.personal?.mobile}</span></p>
              <p><span className="text-navy-400">Email:</span> <span className="font-medium text-navy-800">{app.personal?.email}</span></p>
              <p><span className="text-navy-400">City:</span> <span className="font-medium text-navy-800">{app.personal?.city}, {app.personal?.state}</span></p>
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-semibold text-navy-900 mb-4">Nominee</h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <p><span className="text-navy-400">Name:</span> <span className="font-medium text-navy-800">{app.nominee?.name}</span></p>
              <p><span className="text-navy-400">Relationship:</span> <span className="font-medium text-navy-800">{app.nominee?.relationship}</span></p>
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="font-display font-semibold text-navy-900 mb-4">Timeline</h3>
          <Timeline
            steps={APPLICATION_TIMELINE_STEPS}
            completed={app.timeline.filter((t) => APPLICATION_TIMELINE_STEPS.includes(t.step))}
            rejectedAt={app.status === "REJECTED" ? formatDate(app.rejectedDate) : null}
          />
        </Card>
      </div>

      <Modal
        open={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Complete Payment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPayModalOpen(false)}>Cancel</Button>
            <Button variant="emerald" loading={paying} disabled={!fieldsValid} onClick={handlePay}>Pay {formatINR(app.premium)}</Button>
          </>
        }
      >
        <p className="text-sm text-navy-500 mb-4">Choose a payment method (simulated — no real transaction occurs).</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["UPI", "Card", "Net Banking"].map((m) => (
            <button
              key={m}
              onClick={() => { setMethod(m); setFieldsValid(false); }}
              className={`text-sm font-medium px-3 py-2.5 rounded-lg border ${method === m ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-navy-200 text-navy-600"}`}
            >
              {m}
            </button>
          ))}
        </div>
        <PaymentMethodFields method={method} onValidityChange={setFieldsValid} />
      </Modal>
    </div>
  );
}
