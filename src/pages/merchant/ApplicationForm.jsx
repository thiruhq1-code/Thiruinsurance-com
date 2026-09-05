import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check, User, Users, FileText, ClipboardCheck } from "lucide-react";
import { getPlanById } from "../../services/productsStore";
import { useAuth } from "../../context/AuthContext";
import { useInsurance } from "../../context/InsuranceContext";
import { useToast } from "../../context/NotificationContext";
import * as api from "../../services/mockApi";
import { Field, Input, Select } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import FileUpload from "../../components/shared/FileUpload";
import { formatINR, formatCoverage } from "../../utils/format";
import { FREQUENCIES, calcFrequencyAmount } from "../../utils/premiumFrequency";
import { EmptyState } from "../../components/ui/States";

const STEPS = [
  { key: "personal", label: "Personal Details", icon: User },
  { key: "nominee", label: "Nominee Details", icon: Users },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "review", label: "Review", icon: ClipboardCheck },
];

export default function ApplicationForm() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user, refreshSession } = useAuth();
  const { refreshAll } = useInsurance();
  const { toast } = useToast();
  const plan = getPlanById(planId);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [personal, setPersonal] = useState({
    fullName: user?.name || "", dob: "", gender: "", mobile: user?.mobile || "", email: user?.email || "",
    address: "", city: user?.city || "", state: user?.state || "", pincode: "",
  });
  const [nominee, setNominee] = useState({ name: "", relationship: "", dob: "", mobile: "" });
  const [documents, setDocuments] = useState({});
  const [frequency, setFrequency] = useState("yearly");

  if (!plan) {
    return <EmptyState title="Plan not found" action={<Button onClick={() => navigate("/merchant/insurance")}>Back to Insurance</Button>} />;
  }

  const requiredDocs = plan.documents;
  const allDocsUploaded = requiredDocs.every((d) => documents[d]);

  function updatePersonal(key, value) {
    setPersonal((p) => ({ ...p, [key]: value }));
  }
  function updateNominee(key, value) {
    setNominee((n) => ({ ...n, [key]: value }));
  }

  function canProceed() {
    if (step === 0) {
      return personal.fullName && personal.dob && personal.gender && personal.mobile && personal.email && personal.address && personal.city && personal.state && personal.pincode;
    }
    if (step === 1) {
      return nominee.name && nominee.relationship && nominee.dob && nominee.mobile;
    }
    if (step === 2) {
      return allDocsUploaded;
    }
    if (step === 3) {
      return confirmed;
    }
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const app = await api.createApplication({
        merchantId: user.id,
        merchantName: user.name,
        planId: plan.id,
        personal,
        nominee,
        documents: requiredDocs,
        premiumFrequency: frequency,
        premiumAmount: calcFrequencyAmount(plan.premium, frequency),
      });
      await refreshAll();
      refreshSession();
      toast(`Application ${app.id} submitted for review.`);
      navigate(`/merchant/applications/${app.id}`);
    } catch (err) {
      toast(err.message, { type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">{plan.category.name}</p>
        <h1 className="font-display text-2xl font-semibold text-navy-950">Apply for {plan.name}</h1>
        <p className="text-sm text-navy-500 mt-1">
          {formatINR(plan.premium)}/{plan.premiumPeriod} · Coverage up to {formatCoverage(plan.coverage)}
        </p>
      </div>

      <Card className="mb-6">
        <p className="text-sm font-semibold text-navy-800 mb-1">Choose Payment Frequency</p>
        <p className="text-xs text-navy-400 mb-4">Your policy covers a full 1-year term either way — this only decides how the premium is split into installments.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FREQUENCIES.map((f) => {
            const amount = calcFrequencyAmount(plan.premium, f.value);
            const active = frequency === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFrequency(f.value)}
                className={`text-left px-3.5 py-3 rounded-xl border transition-colors ${
                  active ? "border-emerald-500 bg-emerald-50" : "border-navy-200 hover:border-navy-300"
                }`}
              >
                <p className={`text-xs font-semibold ${active ? "text-emerald-700" : "text-navy-500"}`}>{f.label}</p>
                <p className="text-sm font-semibold text-navy-900 mt-0.5">{formatINR(amount)}</p>
                {f.value === "yearly" && <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Best value</p>}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 ${
                  i < step ? "bg-emerald-600 border-emerald-600 text-white" : i === step ? "border-emerald-600 text-emerald-700 bg-emerald-50" : "border-navy-200 text-navy-300"
                }`}
              >
                {i < step ? <Check size={16} /> : <s.icon size={15} />}
              </div>
              <span className={`text-[11px] mt-1.5 font-medium text-center w-20 ${i <= step ? "text-navy-700" : "text-navy-300"}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 mb-5 ${i < step ? "bg-emerald-600" : "bg-navy-100"}`} />}
          </div>
        ))}
      </div>

      <Card>
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-navy-900 mb-1">Personal Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <Input value={personal.fullName} onChange={(e) => updatePersonal("fullName", e.target.value)} placeholder="As per Aadhaar" />
              </Field>
              <Field label="Date of Birth" required>
                <Input type="date" value={personal.dob} onChange={(e) => updatePersonal("dob", e.target.value)} />
              </Field>
              <Field label="Gender" required>
                <Select value={personal.gender} onChange={(e) => updatePersonal("gender", e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Select>
              </Field>
              <Field label="Mobile Number" required>
                <Input value={personal.mobile} onChange={(e) => updatePersonal("mobile", e.target.value)} placeholder="10-digit mobile" maxLength={10} />
              </Field>
              <Field label="Email" required>
                <Input type="email" value={personal.email} onChange={(e) => updatePersonal("email", e.target.value)} placeholder="you@example.com" />
              </Field>
              <Field label="Pincode" required>
                <Input value={personal.pincode} onChange={(e) => updatePersonal("pincode", e.target.value)} placeholder="6-digit pincode" maxLength={6} />
              </Field>
              <Field label="City" required>
                <Input value={personal.city} onChange={(e) => updatePersonal("city", e.target.value)} />
              </Field>
              <Field label="State" required>
                <Input value={personal.state} onChange={(e) => updatePersonal("state", e.target.value)} />
              </Field>
            </div>
            <Field label="Address" required>
              <Input value={personal.address} onChange={(e) => updatePersonal("address", e.target.value)} placeholder="House no, street, area" />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-navy-900 mb-1">Nominee Details</h3>
            <p className="text-sm text-navy-400 mb-3">Your nominee will receive the claim benefit as per policy terms.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nominee Name" required>
                <Input value={nominee.name} onChange={(e) => updateNominee("name", e.target.value)} />
              </Field>
              <Field label="Relationship" required>
                <Select value={nominee.relationship} onChange={(e) => updateNominee("relationship", e.target.value)}>
                  <option value="">Select</option>
                  <option>Spouse</option>
                  <option>Father</option>
                  <option>Mother</option>
                  <option>Son</option>
                  <option>Daughter</option>
                  <option>Sibling</option>
                  <option>Other</option>
                </Select>
              </Field>
              <Field label="Date of Birth" required>
                <Input type="date" value={nominee.dob} onChange={(e) => updateNominee("dob", e.target.value)} />
              </Field>
              <Field label="Mobile Number" required>
                <Input value={nominee.mobile} onChange={(e) => updateNominee("mobile", e.target.value)} maxLength={10} />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display font-semibold text-navy-900 mb-1">Documents</h3>
              <p className="text-sm text-navy-400">Upload clear copies. This is a demo — files stay in your browser only.</p>
            </div>
            {requiredDocs.map((doc) => (
              <FileUpload
                key={doc}
                label={doc}
                required
                uploaded={documents[doc]}
                onUploaded={(file) => setDocuments((d) => ({ ...d, [doc]: file }))}
              />
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-display font-semibold text-navy-900 mb-1">Review Application</h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-sm text-navy-600">Payment Frequency: <b>{FREQUENCIES.find((f) => f.value === frequency)?.label}</b></span>
              <span className="text-sm font-semibold text-navy-900">{formatINR(calcFrequencyAmount(plan.premium, frequency))}</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Personal Details</p>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                <p><span className="text-navy-400">Name:</span> <span className="text-navy-700 font-medium">{personal.fullName}</span></p>
                <p><span className="text-navy-400">DOB:</span> <span className="text-navy-700 font-medium">{personal.dob}</span></p>
                <p><span className="text-navy-400">Gender:</span> <span className="text-navy-700 font-medium">{personal.gender}</span></p>
                <p><span className="text-navy-400">Mobile:</span> <span className="text-navy-700 font-medium">{personal.mobile}</span></p>
                <p><span className="text-navy-400">Email:</span> <span className="text-navy-700 font-medium">{personal.email}</span></p>
                <p><span className="text-navy-400">City:</span> <span className="text-navy-700 font-medium">{personal.city}, {personal.state} - {personal.pincode}</span></p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Nominee Details</p>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                <p><span className="text-navy-400">Name:</span> <span className="text-navy-700 font-medium">{nominee.name}</span></p>
                <p><span className="text-navy-400">Relationship:</span> <span className="text-navy-700 font-medium">{nominee.relationship}</span></p>
                <p><span className="text-navy-400">DOB:</span> <span className="text-navy-700 font-medium">{nominee.dob}</span></p>
                <p><span className="text-navy-400">Mobile:</span> <span className="text-navy-700 font-medium">{nominee.mobile}</span></p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Documents</p>
              <ul className="text-sm text-navy-700 space-y-1">
                {requiredDocs.map((d) => (
                  <li key={d} className="flex gap-2"><Check size={14} className="text-emerald-500 mt-0.5" /> {d} — {documents[d]?.name}</li>
                ))}
              </ul>
            </div>
            <label className="flex items-start gap-2.5 bg-navy-50 rounded-xl px-4 py-3.5 cursor-pointer">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 accent-emerald-600" />
              <span className="text-sm text-navy-700">I confirm that the information provided is correct.</span>
            </label>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-5 border-t border-navy-100">
          <Button variant="ghost" icon={ChevronLeft} disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="emerald" icon={ChevronRight} iconPosition="right" disabled={!canProceed()} onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button variant="emerald" disabled={!canProceed()} loading={submitting} onClick={handleSubmit}>
              Submit Application
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
