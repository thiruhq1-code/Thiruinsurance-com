import { Link } from "react-router-dom";
import { ShieldCheck, Globe, MessageCircle, Share2, AtSign } from "lucide-react";
import { getCategories } from "../../services/productsStore";

export default function PublicFooter() {
  const categories = getCategories();
  return (
    <footer className="bg-navy-900 text-navy-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-9 h-9 rounded-lg bg-emerald-500 text-navy-950 flex items-center justify-center">
              <ShieldCheck size={18} />
            </span>
            <span className="font-display leading-none">
              <span className="block text-base font-bold text-white tracking-tight">THIRU</span>
              <span className="block text-[10px] font-semibold text-emerald-400 tracking-[0.2em]">INSURANCE</span>
            </span>
          </div>
          <p className="text-sm text-navy-300 max-w-xs">
            Simple, reliable and affordable insurance for you, your family and your business.
          </p>
          <div className="flex gap-3 mt-5">
            {[Globe, MessageCircle, Share2, AtSign].map((Icon, i) => (
              <span key={i} className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                <Icon size={14} />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-white font-semibold text-sm mb-3">Insurance</h5>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link to={`/insurance/${c.slug}`} className="hover:text-emerald-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-sm mb-3">Company</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-emerald-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-emerald-400">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-sm mb-3">Support & Legal</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-emerald-400">Help Center</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400">Claims Support</Link></li>
            <li><span className="cursor-default">Privacy Policy</span></li>
            <li><span className="cursor-default">Terms of Use</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-800 py-5 text-center text-xs text-navy-400">
        © 2026 Thiru Insurance. All product data on this demo site is illustrative only.
      </div>
    </footer>
  );
}
