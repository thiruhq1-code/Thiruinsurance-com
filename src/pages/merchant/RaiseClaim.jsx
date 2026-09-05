import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useInsurance } from "../../context/InsuranceContext";
import { useToast } from "../../context/NotificationContext";
import * as api from "../../services/mockApi";
import { Field, Input, Select, Textarea } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import FileUpload from "../../components/shared/FileUpload";
import { Breadcrumb } from "../../components/ui/Misc";
import { EmptyState } from "../../components/ui/States";

const CLAIM_TYPES = ["Hospitalization", "Accident", "Theft", "Trip Cancellation", "Damage", "Other"];

export default function RaiseClaim() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { policies, refreshAll } = useInsurance();
  const { toast } = useToast();

  const activePolicies = policies.filter((p) => p.status === "ACTIVE");
  const [policyNumber, setPolicyNumber] = useState(params.get("policy") || activePolicies[0]?.policyNumber || "");
  const [claimType, setClaimType] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [description, setDescription] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [doc, setDoc] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (activePolicies.length === 0) {
    return (
      <EmptyState
        title="No active policies"
        description="You need at least one active policy to raise a claim."
        action={<Button onClick={() => navigate("/merchant/policies")}>View Policies</Button>}
      />
    );
  }

  const selectedPolicy = policies.find((p) => p.policyNumber === policyNumber);
  const canSubmit = policyNumber && claimType && incidentDate && description && claimAmount && doc;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const claim = await api.createClaim({
        policyNumber,
        merchantId: user.id,
        merchantName: user.name,
        categoryName: selectedPolicy.categoryName,
        claimType,
        incidentDate,
        description,
        claimAmount: Number(claimAmount),
        documents: ["Supporting Document"],
      });
      await refreshAll();
      toast(`Claim ${claim.id} submitted successfully.`);
      navigate(`/merchant/claims/${claim.id}`);
    } catch (err) {
      toast(err.message, { type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Breadcrumb items={[{ label: "Claims", href: "/merchant/claims" }, { label: "Raise Claim" }]} />
      <h1 className="font-display text-2xl font-semibold text-navy-950 mb-6">Raise a Claim</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Select Policy" required>
            <Select value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)}>
              {activePolicies.map((p) => (
                <option key={p.policyNumber} value={p.policyNumber}>
                  {p.planName} · {p.policyNumber}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Claim Type" required>
            <Select value={claimType} onChange={(e) => setClaimType(e.target.value)}>
              <option value="">Select claim type</option>
              {CLAIM_TYPES.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Incident Date" required>
            <Input type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} max={new Date().toISOString().slice(0, 10)} />
          </Field>
          <Field label="Incident Description" required>
            <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what happened..." />
          </Field>
          <Field label="Claim Amount (₹)" required>
            <Input type="number" value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} placeholder="0" />
          </Field>
          <FileUpload label="Supporting Document" required uploaded={doc} onUploaded={setDoc} />

          <div className="pt-3 flex gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate("/merchant/claims")}>Cancel</Button>
            <Button type="submit" variant="emerald" disabled={!canSubmit} loading={submitting}>Submit Claim</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
