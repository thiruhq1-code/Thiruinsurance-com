import { Check } from "lucide-react";
import { STATUS_META } from "../../data/statusConfig";

// steps: full ordered list of possible steps for this flow
// completed: array of {step, date} actually reached
export default function Timeline({ steps, completed, rejectedAt }) {
  const completedMap = Object.fromEntries(completed.map((c) => [c.step, c.date]));
  const lastIndex = completed.length - 1;

  if (rejectedAt) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 text-xs font-bold">
          ✕
        </div>
        <div>
          <p className="text-sm font-semibold text-red-700">Rejected</p>
          <p className="text-xs text-navy-400">{rejectedAt}</p>
        </div>
      </div>
    );
  }

  return (
    <ol className="relative border-l-2 border-navy-100 ml-3 space-y-6">
      {steps.map((step, i) => {
        const done = !!completedMap[step];
        const isCurrent = i === lastIndex;
        return (
          <li key={step} className="ml-5 relative">
            <span
              className={`absolute -left-[1.9rem] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                done
                  ? isCurrent
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-emerald-100 border-emerald-400 text-emerald-700"
                  : "bg-white border-navy-200 text-navy-300"
              }`}
            >
              {done ? <Check size={13} /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
            </span>
            <p className={`text-sm font-semibold ${done ? "text-navy-800" : "text-navy-300"}`}>
              {STATUS_META[step]?.label || step}
            </p>
            {done && <p className="text-xs text-navy-400">{completedMap[step]}</p>}
          </li>
        );
      })}
    </ol>
  );
}
