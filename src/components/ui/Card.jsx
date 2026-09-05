export default function Card({ children, className = "", padded = true, hover = false, ...props }) {
  return (
    <div
      className={`bg-white border border-navy-100 rounded-2xl shadow-soft ${padded ? "p-5" : ""} ${
        hover ? "transition-shadow hover:shadow-card" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
