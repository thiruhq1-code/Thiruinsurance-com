import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShieldCheck, ChevronDown } from "lucide-react";
import { getCategories } from "../../services/productsStore";
import Button from "../ui/Button";

export default function PublicNavbar() {
  const categories = getCategories();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();

  const navLink = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-emerald-700" : "text-navy-600 hover:text-navy-900"}`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-navy-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-lg bg-navy-800 text-white flex items-center justify-center">
            <ShieldCheck size={18} />
          </span>
          <span className="font-display leading-none">
            <span className="block text-base font-bold text-navy-900 tracking-tight">THIRU</span>
            <span className="block text-[10px] font-semibold text-emerald-600 tracking-[0.2em]">INSURANCE</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLink}>
            Home
          </NavLink>
          <div className="relative" onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
            <button className="text-sm font-medium text-navy-600 hover:text-navy-900 flex items-center gap-1">
              Insurance <ChevronDown size={14} />
            </button>
            {dropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-64">
                <div className="bg-white border border-navy-100 rounded-xl shadow-lifted p-2">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/insurance/${c.slug}`}
                      className="block px-3 py-2 text-sm rounded-lg text-navy-600 hover:bg-navy-50 hover:text-navy-900"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <NavLink to="/about" className={navLink}>
            About
          </NavLink>
          <NavLink to="/faq" className={navLink}>
            FAQ
          </NavLink>
          <NavLink to="/contact" className={navLink}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-navy-700 hover:text-navy-900">
            Login
          </Link>
          <Button size="md" variant="emerald" onClick={() => navigate("/register")}>
            Get Protected
          </Button>
        </div>

        <button className="md:hidden text-navy-700" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-navy-100 bg-white px-4 py-4 space-y-3">
          <Link to="/" className="block text-sm font-medium text-navy-700" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/insurance" className="block text-sm font-medium text-navy-700" onClick={() => setOpen(false)}>
            Insurance
          </Link>
          <Link to="/about" className="block text-sm font-medium text-navy-700" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link to="/faq" className="block text-sm font-medium text-navy-700" onClick={() => setOpen(false)}>
            FAQ
          </Link>
          <Link to="/contact" className="block text-sm font-medium text-navy-700" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button variant="emerald" className="flex-1" onClick={() => navigate("/register")}>
              Get Protected
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
