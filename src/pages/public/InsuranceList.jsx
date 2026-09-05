import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getCategories } from "../../services/productsStore";
import { getIcon } from "../../utils/iconMap";
import { formatINR, formatCoverage } from "../../utils/format";

export default function InsuranceList() {
  const categories = getCategories();
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-14">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-xs font-semibold tracking-wide text-emerald-600 uppercase mb-2">All coverage in one place</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-navy-950">Explore Insurance</h1>
        <p className="text-navy-500 mt-3">Seven categories, each with plans that scale from essential to elite cover.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = getIcon(cat.icon);
          return (
            <div key={cat.slug} className="bg-white border border-navy-100 rounded-2xl p-6 hover:shadow-card transition-shadow">
              <span className="w-12 h-12 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center mb-4">
                <Icon size={22} />
              </span>
              <h3 className="font-display text-lg font-semibold text-navy-900 mb-1.5">{cat.name}</h3>
              <p className="text-sm text-navy-500 mb-4 leading-relaxed">{cat.description}</p>
              <div className="flex items-center justify-between text-xs text-navy-400 mb-5 border-t border-navy-100 pt-4">
                <span>From <span className="font-semibold text-navy-700">{formatINR(cat.startingPremium)}</span></span>
                <span>Cover up to <span className="font-semibold text-navy-700">{formatCoverage(cat.plans[cat.plans.length - 1].coverage)}</span></span>
              </div>
              <Link to={`/insurance/${cat.slug}`} className="text-sm font-semibold text-emerald-700 flex items-center gap-1 hover:gap-2 transition-all">
                Explore plans <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
