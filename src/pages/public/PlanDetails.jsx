import { Link, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, XCircle, FileText, ArrowRight } from "lucide-react";
import { getPlanById } from "../../services/productsStore";
import { formatINR, formatCoverage } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Accordion from "../../components/shared/Accordion";
import { Breadcrumb } from "../../components/ui/Misc";
import { EmptyState } from "../../components/ui/States";

export default function PlanDetails() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const plan = getPlanById(planId);

  if (!plan) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState title="Plan not found" description="This plan doesn't exist or may have been retired." action={<Button onClick={() => navigate("/insurance")}>Browse Insurance</Button>} />
      </div>
    );
  }

  function handleBuyNow() {
    if (isAuthenticated && role === "merchant") {
      navigate(`/merchant/insurance/apply/${plan.id}`);
    } else {
      navigate("/login", { state: { redirectTo: `/merchant/insurance/apply/${plan.id}` } });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <Breadcrumb items={[{ label: "Insurance", href: "/insurance" }, { label: plan.category.name, href: `/insurance/${plan.category.slug}` }, { label: plan.name }]} />

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">{plan.category.name}</p>
            <h1 className="font-display text-3xl font-semibold text-navy-950">{plan.name}</h1>
            <p className="text-navy-500 mt-2">{plan.tagline}</p>
          </div>

          <section>
            <h2 className="font-display text-lg font-semibold text-navy-900 mb-3">Benefits</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {plan.benefits.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-navy-600 bg-white border border-navy-100 rounded-xl px-4 py-3">
                  <BadgeCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {b}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display font-semibold text-navy-900 mb-3">What's covered</h3>
              <ul className="space-y-2">
                {plan.category.covered.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-navy-600">
                    <BadgeCheck size={15} className="text-emerald-500 shrink-0 mt-0.5" /> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display font-semibold text-navy-900 mb-3">Exclusions</h3>
              <ul className="space-y-2">
                {plan.exclusions.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-navy-500">
                    <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display font-semibold text-navy-900 mb-2">Eligibility</h3>
              <p className="text-sm text-navy-600">{plan.eligibility}</p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-navy-900 mb-2">Documents required</h3>
              <ul className="space-y-1.5">
                {plan.documents.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-navy-600">
                    <FileText size={14} className="text-navy-400 shrink-0 mt-0.5" /> {d}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-navy-900 mb-2">FAQs</h2>
            <Accordion items={plan.category.faqs} />
          </section>
        </div>

        <aside>
          <div className="sticky top-24 bg-white border border-navy-100 rounded-2xl shadow-card p-6">
            <p className="font-display text-3xl font-semibold text-navy-900">{formatINR(plan.premium)}<span className="text-sm font-normal text-navy-400">/{plan.premiumPeriod}</span></p>
            <p className="text-sm text-emerald-700 font-semibold mb-6">Coverage up to {formatCoverage(plan.coverage)}</p>
            <div className="space-y-2.5 mb-6">
              {plan.benefits.slice(0, 4).map((b) => (
                <div key={b} className="flex gap-2 text-sm text-navy-600">
                  <BadgeCheck size={15} className="text-emerald-500 shrink-0 mt-0.5" /> {b}
                </div>
              ))}
            </div>
            <Button variant="emerald" className="w-full mb-2" size="lg" icon={ArrowRight} iconPosition="right" onClick={handleBuyNow}>
              Buy Now
            </Button>
            <Button as={Link} to={`/insurance/${plan.category.slug}`} variant="outline" className="w-full">
              Compare Plans
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
