import { useNavigate, useParams } from "react-router-dom";
import { useInsurance } from "../../context/InsuranceContext";
import { Breadcrumb } from "../../components/ui/Misc";
import { EmptyState, LoadingState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Timeline from "../../components/shared/Timeline";
import { formatINR, formatDate } from "../../utils/format";

const CLAIM_STEPS = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "SETTLED"];

export default function ClaimDetails() {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const { claims, loading } = useInsurance();

  if (loading) return <LoadingState />;
  const claim = claims.find((c) => c.id === claimId);

  if (!claim) {
    return <EmptyState title="Claim not found" action={<Button onClick={() => navigate("/merchant/claims")}>Back to Claims</Button>} />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: "Claims", href: "/merchant/claims" }, { label: claim.id }]} />
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">{claim.categoryName}</p>
          <h1 className="font-display text-2xl font-semibold text-navy-950">{claim.claimType} Claim</h1>
          <p className="text-sm text-navy-400 mt-1 font-mono">{claim.id} · {claim.policyNumber}</p>
        </div>
        <StatusBadge status={claim.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h3 className="font-display font-semibold text-navy-900 mb-4">Claim Details</h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
              <p><span className="text-navy-400">Incident Date:</span> <span className="font-medium text-navy-800">{formatDate(claim.incidentDate)}</span></p>
              <p><span className="text-navy-400">Claim Amount:</span> <span className="font-medium text-navy-800">{formatINR(claim.claimAmount)}</span></p>
              <p><span className="text-navy-400">Submitted:</span> <span className="font-medium text-navy-800">{formatDate(claim.submittedDate)}</span></p>
            </div>
            <p className="text-xs text-navy-400 mb-1">Description</p>
            <p className="text-sm text-navy-600 leading-relaxed">{claim.description}</p>
          </Card>
        </div>
        <Card>
          <h3 className="font-display font-semibold text-navy-900 mb-4">Claim Timeline</h3>
          <Timeline
            steps={claim.status === "DOCUMENTS_REQUIRED" ? ["SUBMITTED", "UNDER_REVIEW", "DOCUMENTS_REQUIRED"] : CLAIM_STEPS}
            completed={claim.timeline}
            rejectedAt={claim.status === "REJECTED" ? formatDate(claim.timeline[claim.timeline.length - 1]?.date) : null}
          />
        </Card>
      </div>
    </div>
  );
}
