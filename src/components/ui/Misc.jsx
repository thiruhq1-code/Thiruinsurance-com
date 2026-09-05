import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import Button from "./Button";

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      <div>
        {eyebrow && <p className="text-xs font-semibold tracking-wide text-emerald-600 uppercase mb-1">{eyebrow}</p>}
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-navy-900">{title}</h1>
        {description && <p className="text-navy-500 text-sm mt-1 max-w-xl">{description}</p>}
      </div>
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-navy-100 overflow-x-auto thin-scroll">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            active === t.value
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-navy-400 hover:text-navy-700"
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="ml-1.5 text-xs text-navy-300">({t.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, tone = "navy" }) {
  const toneClasses = {
    navy: "bg-navy-50 text-navy-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div className="bg-white border border-navy-100 rounded-2xl p-5 shadow-soft flex items-center gap-4">
      {Icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
          <Icon size={20} />
        </div>
      )}
      <div>
        <p className="text-xs text-navy-400 font-medium mb-0.5">{label}</p>
        <p className="font-display text-xl font-semibold text-navy-900">{value}</p>
      </div>
    </div>
  );
}

export function useConfirm() {
  const [state, setState] = useState({ open: false });

  function confirm({ title, description, confirmLabel = "Confirm", variant = "danger", onConfirm }) {
    setState({ open: true, title, description, confirmLabel, variant, onConfirm });
  }

  const dialog = (
    <Modal
      open={state.open}
      onClose={() => setState({ open: false })}
      title={state.title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={() => setState({ open: false })}>
            Cancel
          </Button>
          <Button
            variant={state.variant}
            onClick={async () => {
              await state.onConfirm?.();
              setState({ open: false });
            }}
          >
            {state.confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-navy-600">{state.description}</p>
    </Modal>
  );

  return { confirm, dialog };
}

export function Breadcrumb({ items }) {
  return (
    <nav className="text-sm text-navy-400 mb-4 flex items-center gap-1.5 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-navy-200">/</span>}
          {item.href ? (
            <Link to={item.href} className="hover:text-emerald-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-navy-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
