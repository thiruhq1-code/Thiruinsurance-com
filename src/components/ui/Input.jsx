export function Field({ label, error, required, children, hint }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-medium text-navy-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="block text-xs text-navy-400 mt-1">{hint}</span>}
      {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
    </label>
  );
}

export function Input({ error, className = "", icon: Icon, ...props }) {
  if (Icon) {
    return (
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
        <input
          className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border text-sm bg-white text-navy-900 placeholder:text-navy-300 transition-colors
          ${error ? "border-red-300 focus:border-red-400" : "border-navy-200 focus:border-emerald-500"}
          focus:outline-none focus:ring-2 focus:ring-emerald-100 ${className}`}
          {...props}
        />
      </div>
    );
  }
  return (
    <input
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white text-navy-900 placeholder:text-navy-300 transition-colors
      ${error ? "border-red-300 focus:border-red-400" : "border-navy-200 focus:border-emerald-500"}
      focus:outline-none focus:ring-2 focus:ring-emerald-100 ${className}`}
      {...props}
    />
  );
}

export function Select({ error, className = "", children, ...props }) {
  return (
    <select
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white text-navy-900 transition-colors
      ${error ? "border-red-300" : "border-navy-200 focus:border-emerald-500"}
      focus:outline-none focus:ring-2 focus:ring-emerald-100 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ error, className = "", ...props }) {
  return (
    <textarea
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white text-navy-900 placeholder:text-navy-300 transition-colors
      ${error ? "border-red-300" : "border-navy-200 focus:border-emerald-500"}
      focus:outline-none focus:ring-2 focus:ring-emerald-100 ${className}`}
      {...props}
    />
  );
}
