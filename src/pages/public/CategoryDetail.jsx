import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, XCircle, Users } from "lucide-react";
import { getCategoryBySlug } from "../../services/productsStore";
import { getIcon } from "../../utils/iconMap";
import { formatINR, formatCoverage } from "../../utils/format";
import Button from "../../components/ui/Button";
import Accordion from "../../components/shared/Accordion";
import { Breadcrumb } from "../../components/ui/Misc";
import { EmptyState } from "../../components/ui/States";

export default function CategoryDetail() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          title="Insurance category not found"
          description="This category doesn't exist. Browse all available insurance types instead."
          action={<Button onClick={() => navigate("/insurance")}>Browse Insurance</Button>}
        />
      </div>
    );
  }

  const Icon = getIcon(category.icon);

  return (
    <div>
      <section className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-14">
          <Breadcrumb items={[{ label: "Insurance", href: "/insurance" }, { label: category.name }]} />
          <div className="flex items-center gap-4 mb-4">
            <span className="w-14 h-14 rounded-2xl bg-emerald-500 text-navy-950 flex items-center justify-center shrink-0">
              <Icon size={26} />
            </span>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold">{category.name}</h1>
              <p className="text-navy-300 text-sm mt-1">{category.tagline}</p>
            </div>
          </div>
          <p className="text-navy-300 max-w-2xl">{category.description}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <Users size={18} className="text-emerald-600" /> Who needs this
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {category.whoNeeds.map((w) => (
                <li key={w} className="flex gap-2 text-sm text-navy-600 bg-white border border-navy-100 rounded-xl px-4 py-3">
                  <BadgeCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {w}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-4">Key benefits</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {category.keyBenefits.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-navy-600">
                  <BadgeCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {b}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display font-semibold text-navy-900 mb-3">What's covered</h3>
              <ul className="space-y-2">
                {category.covered.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-navy-600">
                    <BadgeCheck size={15} className="text-emerald-500 shrink-0 mt-0.5" /> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display font-semibold text-navy-900 mb-3">What's not covered</h3>
              <ul className="space-y-2">
                {category.notCovered.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-navy-500">
                    <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">FAQs</h2>
            <Accordion items={category.faqs} />
          </section>
        </div>

        <aside className="space-y-5">
          <div className="sticky top-24 space-y-5">
            <h3 className="font-display font-semibold text-navy-900">Available plans</h3>
            {category.plans.map((plan) => (
              <div key={plan.id} className={`bg-white rounded-2xl p-5 border relative ${plan.popular ? "border-emerald-300 shadow-card" : "border-navy-100 shadow-soft"}`}>
                {plan.popular && (
                  <span className="absolute -top-2.5 right-5 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                    Popular
                  </span>
                )}
                <p className="font-display font-semibold text-navy-900">{plan.name}</p>
                <p className="text-xs text-navy-400 mb-3">{plan.tagline}</p>
                <p className="font-display text-xl font-semibold text-navy-900">{formatINR(plan.premium)}<span className="text-xs font-normal text-navy-400">/{plan.premiumPeriod}</span></p>
                <p className="text-xs text-emerald-700 font-semibold mb-4">Coverage up to {formatCoverage(plan.coverage)}</p>
                <Button as={Link} to={`/insurance/${category.slug}/${plan.id}`} size="sm" variant={plan.popular ? "emerald" : "outline"} className="w-full" icon={ArrowRight} iconPosition="right">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
