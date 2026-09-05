import { Link, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { getCategoryBySlug } from "../../services/productsStore";
import { getIcon } from "../../utils/iconMap";
import { formatINR, formatCoverage } from "../../utils/format";
import { PageHeader, Breadcrumb } from "../../components/ui/Misc";
import Button from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/States";

export default function MerchantPlanList() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return <EmptyState title="Category not found" action={<Button onClick={() => navigate("/merchant/insurance")}>Back to Insurance</Button>} />;
  }

  const Icon = getIcon(category.icon);

  return (
    <div>
      <Breadcrumb items={[{ label: "All Insurance", href: "/merchant/insurance" }, { label: category.name }]} />
      <PageHeader
        eyebrow={category.name}
        title="Choose your plan"
        description={category.tagline}
      />
      <div className="grid md:grid-cols-3 gap-5">
        {category.plans.map((plan) => (
          <div key={plan.id} className={`bg-white rounded-2xl p-6 border relative flex flex-col ${plan.popular ? "border-emerald-300 shadow-card" : "border-navy-100 shadow-soft"}`}>
            {plan.popular && (
              <span className="absolute -top-3 left-6 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <span className="w-10 h-10 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center mb-4">
              <Icon size={18} />
            </span>
            <h3 className="font-display text-lg font-semibold text-navy-900">{plan.name}</h3>
            <p className="text-sm text-navy-400 mb-4">{plan.tagline}</p>
            <p className="font-display text-2xl font-semibold text-navy-900">{formatINR(plan.premium)}<span className="text-sm font-normal text-navy-400">/{plan.premiumPeriod}</span></p>
            <p className="text-xs text-emerald-700 font-semibold mb-5">Coverage up to {formatCoverage(plan.coverage)}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.benefits.map((b) => (
                <li key={b} className="text-sm text-navy-600 flex gap-2">
                  <BadgeCheck size={15} className="text-emerald-500 shrink-0 mt-0.5" /> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              <Button as={Link} to={`/insurance/${category.slug}/${plan.id}`} variant="outline" size="sm">
                View Details
              </Button>
              <Button as={Link} to={`/merchant/insurance/apply/${plan.id}`} variant={plan.popular ? "emerald" : "primary"} size="sm" icon={ArrowRight} iconPosition="right">
                Buy Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
