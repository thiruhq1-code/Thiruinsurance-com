import { Loader2, Inbox, AlertTriangle } from "lucide-react";

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-navy-400">
      <Loader2 size={26} className="animate-spin mb-3" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center mb-4">
        <Icon size={24} className="text-navy-300" />
      </div>
      <h4 className="font-display font-semibold text-navy-800 mb-1">{title}</h4>
      {description && <p className="text-sm text-navy-400 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <AlertTriangle size={24} className="text-red-400" />
      </div>
      <h4 className="font-display font-semibold text-navy-800 mb-1">{title}</h4>
      {description && <p className="text-sm text-navy-400 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
