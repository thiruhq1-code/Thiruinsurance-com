import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { getCategories } from "../../services/productsStore";
import { getIcon } from "../../utils/iconMap";
import { formatINR, formatCoverage } from "../../utils/format";
import { PageHeader } from "../../components/ui/Misc";
import { Input } from "../../components/ui/Input";
import { EmptyState } from "../../components/ui/States";

export default function MerchantInsurance() {
  const [query, setQuery] = useState("");
  const categories = getCategories();

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageHeader eyebrow="Buy Insurance" title="All Insurance" description="Browse categories and compare plans before applying." />

      <div className="max-w-md mb-6">
        <Input icon={Search} placeholder="Search insurance categories..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No matches found" description="Try a different search term." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cat) => {
            const Icon = getIcon(cat.icon);
            return (
              <Link
                key={cat.slug}
                to={`/merchant/insurance/${cat.slug}`}
                className="bg-white border border-navy-100 rounded-2xl p-5 hover:shadow-card hover:-translate-y-0.5 transition-all block"
              >
                <span className="w-11 h-11 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center mb-4">
                  <Icon size={20} />
                </span>
                <h3 className="font-display font-semibold text-navy-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-navy-400 mb-4 leading-relaxed">{cat.description}</p>
                <div className="flex items-center justify-between text-xs text-navy-400 border-t border-navy-100 pt-3">
                  <span>From <b className="text-navy-700">{formatINR(cat.startingPremium)}</b></span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">View Plans <ArrowRight size={12} /></span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
