import { STATUS_META } from "../../data/statusConfig";

const TONE_CLASSES = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-navy-50 text-navy-700 border-navy-200",
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function StatusBadge({ status, className = "" }) {
  const meta = STATUS_META[status] || { label: status, tone: "neutral" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${TONE_CLASSES[meta.tone]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {meta.label}
    </span>
  );
}
