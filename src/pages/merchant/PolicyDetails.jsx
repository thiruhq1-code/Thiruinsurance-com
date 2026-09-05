import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Download, RefreshCw, ClipboardList, Stamp, CheckCircle2, Clock, CreditCard } from "lucide-react";
import * as api from "../../services/mockApi";
import { Breadcrumb } from "../../components/ui/Misc";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import PaymentMethodFields from "../../components/shared/PaymentMethodFields";
import { formatINR, formatCoverage, formatDate } from "../../utils/format";
import { getFrequency } from "../../utils/premiumFrequency";
import { useToast } from "../../context/NotificationContext";
import { useInsurance } from "../../context/InsuranceContext";

export default function PolicyDetails() {
  const { policyNumber } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshAll } = useInsurance();
  const [policy, setPolicy] = useState(undefined);
  const [renewOpen, setRenewOpen] = useState(false);
  const [renewMethod, setRenewMethod] = useState("UPI");
  const [renewFieldsValid, setRenewFieldsValid] = useState(false);
  const [renewing, setRenewing] = useState(false);
  const [payInstallmentOpen, setPayInstallmentOpen] = useState(false);
  const [installmentMethod, setInstallmentMethod] = useState("UPI");
  const [installmentFieldsValid, setInstallmentFieldsValid] = useState(false);
  const [payingInstallment, setPayingInstallment] = useState(false);

  useEffect(() => {
    api.getPolicyByNumber(policyNumber).then(setPolicy);
  }, [policyNumber]);

  if (policy === undefined) return <LoadingState label="Loading policy..." />;
  if (policy === null) {
    return <EmptyState title="Policy not found" action={<Button onClick={() => navigate("/merchant/policies")}>Back to Policies</Button>} />;
  }

  const nextDueInstallment = policy.installments?.find((i) => i.status === "DUE");
  const paidCount = policy.installments?.filter((i) => i.status === "PAID").length || 0;
  const totalCount = policy.installments?.length || 1;

  async function handleRenew() {
    setRenewing(true);
    try {
      const updated = await api.renewPolicy(policy.policyNumber, renewMethod);
      setPolicy(updated);
      await refreshAll();
      toast(`Policy renewed! Now valid till ${formatDate(updated.endDate)}.`);
    } catch (err) {
      toast(err.message, { type: "error" });
    } finally {
      setRenewing(false);
      setRenewOpen(false);
    }
  }

  async function handlePayInstallment() {
    if (!nextDueInstallment) return;
    setPayingInstallment(true);
    try {
      const updated = await api.payInstallment(policy.policyNumber, nextDueInstallment.index, installmentMethod);
      setPolicy(updated);
      await refreshAll();
      toast(`Installment ${nextDueInstallment.index} of ${totalCount} paid successfully.`);
    } catch (err) {
      toast(err.message, { type: "error" });
    } finally {
      setPayingInstallment(false);
      setPayInstallmentOpen(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: "My Policies", href: "/merchant/policies" }, { label: policy.policyNumber }]} />

      <Card className="policy-paper relative overflow-hidden mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-navy-400 uppercase tracking-wide">Policy Certificate</p>
            <h1 className="font-display text-2xl font-semibold text-navy-950">{policy.planName}</h1>
            <p className="text-sm text-navy-400">{policy.categoryName}</p>
          </div>
          <span className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Stamp size={24} />
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 border-t border-dashed border-navy-200 pt-5">
          <div>
            <p className="text-xs text-navy-400">Policy Number</p>
            <p className="font-mono text-sm font-semibold text-navy-800">{policy.policyNumber}</p>
          </div>
          <div>
            <p className="text-xs text-navy-400">Policy Holder</p>
            <p className="text-sm font-semibold text-navy-800">{policy.merchantName}</p>
          </div>
          <div>
            <p className="text-xs text-navy-400">Coverage</p>
            <p className="text-sm font-semibold text-navy-800">{formatCoverage(policy.coverage)}</p>
          </div>
          <div>
            <p className="text-xs text-navy-400">Premium</p>
            <p className="text-sm font-semibold text-navy-800">{formatINR(policy.premium)} <span className="text-xs font-normal text-navy-400">/ {getFrequency(policy.premiumFrequency).label} installment</span></p>
          </div>
          <div>
            <p className="text-xs text-navy-400">Start Date</p>
            <p className="text-sm font-semibold text-navy-800">{formatDate(policy.startDate)}</p>
          </div>
          <div>
            <p className="text-xs text-navy-400">End Date</p>
            <p className="text-sm font-semibold text-navy-800">{formatDate(policy.endDate)}</p>
          </div>
          <div>
            <p className="text-xs text-navy-400">Status</p>
            <StatusBadge status={policy.status} />
          </div>
        </div>

        <div className="flex gap-2 mt-6 pt-5 border-t border-navy-100">
          <Button variant="outline" size="sm" icon={Download} onClick={() => window.print()}>Download Policy</Button>
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => setRenewOpen(true)}>Renew</Button>
          <Button variant="emerald" size="sm" icon={ClipboardList} onClick={() => navigate(`/merchant/claims/new?policy=${policy.policyNumber}`)} disabled={policy.status !== "ACTIVE"}>
            Raise Claim
          </Button>
        </div>
      </Card>

      {policy.installments && policy.installments.length > 1 && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="font-display font-semibold text-navy-900">Installment Schedule</h3>
              <p className="text-xs text-navy-400 mt-0.5">{paidCount} of {totalCount} installments paid · full 1-year cover regardless of schedule</p>
            </div>
            {nextDueInstallment && (
              <Button variant="emerald" size="sm" icon={CreditCard} onClick={() => setPayInstallmentOpen(true)}>
                Pay Installment {nextDueInstallment.index}
              </Button>
            )}
          </div>
          <div className="divide-y divide-navy-50 border-t border-navy-100">
            {policy.installments.map((inst) => (
              <div key={inst.index} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {inst.status === "PAID" ? (
                    <CheckCircle2 size={17} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Clock size={17} className="text-amber-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-navy-800">Installment {inst.index} of {totalCount}</p>
                    <p className="text-xs text-navy-400">
                      {inst.status === "PAID" ? `Paid on ${formatDate(inst.paidDate)}` : `Due ${formatDate(inst.dueDate)}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-navy-800">{formatINR(inst.amount)}</p>
                  <p className={`text-[11px] font-medium ${inst.status === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>{inst.status === "PAID" ? "Paid" : "Due"}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h3 className="font-display font-semibold text-navy-900 mb-3">Policy Benefits</h3>
        <ul className="grid sm:grid-cols-2 gap-2">
          {policy.benefits?.map((b) => (
            <li key={b} className="text-sm text-navy-600 flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /> {b}
            </li>
          ))}
        </ul>
      </Card>

      <Modal
        open={renewOpen}
        onClose={() => setRenewOpen(false)}
        title="Renew Policy"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRenewOpen(false)}>Cancel</Button>
            <Button variant="emerald" loading={renewing} disabled={!renewFieldsValid} onClick={handleRenew}>Pay {formatINR(policy.premium)} & Renew</Button>
          </>
        }
      >
        <p className="text-sm text-navy-500 mb-4">
          Renewing gives you a fresh 1-year policy term from {formatDate(policy.endDate)}, billed at your chosen {getFrequency(policy.premiumFrequency).label.toLowerCase()} frequency. Payment is simulated — no real transaction occurs.
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["UPI", "Card", "Net Banking"].map((m) => (
            <button
              key={m}
              onClick={() => { setRenewMethod(m); setRenewFieldsValid(false); }}
              className={`text-sm font-medium px-3 py-2.5 rounded-lg border ${renewMethod === m ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-navy-200 text-navy-600"}`}
            >
              {m}
            </button>
          ))}
        </div>
        <PaymentMethodFields method={renewMethod} onValidityChange={setRenewFieldsValid} />
      </Modal>

      {nextDueInstallment && (
        <Modal
          open={payInstallmentOpen}
          onClose={() => setPayInstallmentOpen(false)}
          title={`Pay Installment ${nextDueInstallment.index} of ${totalCount}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setPayInstallmentOpen(false)}>Cancel</Button>
              <Button variant="emerald" loading={payingInstallment} disabled={!installmentFieldsValid} onClick={handlePayInstallment}>
                Pay {formatINR(nextDueInstallment.amount)}
              </Button>
            </>
          }
        >
          <p className="text-sm text-navy-500 mb-4">
            This installment was due on {formatDate(nextDueInstallment.dueDate)}. Payment is simulated — no real transaction occurs.
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {["UPI", "Card", "Net Banking"].map((m) => (
              <button
                key={m}
                onClick={() => { setInstallmentMethod(m); setInstallmentFieldsValid(false); }}
                className={`text-sm font-medium px-3 py-2.5 rounded-lg border ${installmentMethod === m ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-navy-200 text-navy-600"}`}
              >
                {m}
              </button>
            ))}
          </div>
          <PaymentMethodFields method={installmentMethod} onValidityChange={setInstallmentFieldsValid} />
        </Modal>
      )}
    </div>
  );
}
