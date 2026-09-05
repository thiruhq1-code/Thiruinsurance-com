import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-navy-800 text-white hover:bg-navy-700 shadow-soft",
  emerald: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-soft",
  outline: "border border-navy-200 text-navy-800 hover:bg-navy-50 bg-white",
  ghost: "text-navy-700 hover:bg-navy-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  link: "text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline p-0",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 rounded-xl",
  lg: "text-base px-6 py-3.5 rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  as: Component = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";
  return (
    <Component
      className={`${base} ${VARIANTS[variant]} ${variant !== "link" ? SIZES[size] : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {!loading && Icon && iconPosition === "left" && <Icon size={16} />}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon size={16} />}
    </Component>
  );
}
