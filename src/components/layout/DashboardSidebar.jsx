import { NavLink } from "react-router-dom";
import { ShieldCheck, X } from "lucide-react";

export default function DashboardSidebar({ items, open, onClose, brandLabel }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-navy-950/40 z-40 md:hidden" onClick={onClose} />}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-navy-900 text-navy-200 flex flex-col z-50 transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-navy-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-navy-950 flex items-center justify-center">
              <ShieldCheck size={16} />
            </span>
            <div className="leading-tight">
              <p className="text-white font-display font-bold text-sm">THIRU</p>
              <p className="text-[9px] text-emerald-400 font-semibold tracking-widest">{brandLabel}</p>
            </div>
          </div>
          <button className="md:hidden text-navy-400" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto thin-scroll py-4 px-3 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-emerald-600 text-white" : "text-navy-300 hover:bg-navy-800 hover:text-white"
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
