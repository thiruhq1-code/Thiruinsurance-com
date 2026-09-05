import { useState } from "react";
import { Search, Users } from "lucide-react";
import { useInsurance } from "../../context/InsuranceContext";
import { PageHeader } from "../../components/ui/Misc";
import { Input } from "../../components/ui/Input";
import { LoadingState, EmptyState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import Modal from "../../components/ui/Modal";
import { formatDate } from "../../utils/format";

export default function AdminMerchants() {
  const { merchants, applications, policies, claims, loading } = useInsurance();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  if (loading) return <LoadingState />;

  const filtered = merchants.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.id.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <PageHeader eyebrow="Customer base" title="Merchants" description="Everyone who has registered as a policy holder." />
      <div className="max-w-sm mb-5">
        <Input icon={Search} placeholder="Search by name or ID" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No merchants found" />
      ) : (
        <div className="bg-white border border-navy-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto thin-scroll">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-navy-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Merchant ID</th>
                  <th className="text-left px-5 py-3 font-semibold">Name</th>
                  <th className="text-left px-5 py-3 font-semibold">Mobile</th>
                  <th className="text-left px-5 py-3 font-semibold">Policies</th>
                  <th className="text-left px-5 py-3 font-semibold">Claims</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-navy-50/50 cursor-pointer" onClick={() => setSelected(m)}>
                    <td className="px-5 py-3.5 font-mono text-xs text-navy-600">{m.id}</td>
                    <td className="px-5 py-3.5 font-medium text-navy-800">{m.name}</td>
                    <td className="px-5 py-3.5 text-navy-500">{m.mobile}</td>
                    <td className="px-5 py-3.5 text-navy-600">{policies.filter((p) => p.merchantId === m.id).length}</td>
                    <td className="px-5 py-3.5 text-navy-600">{claims.filter((c) => c.merchantId === m.id).length}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={m.status} /></td>
                    <td className="px-5 py-3.5 text-navy-500">{formatDate(m.joinedDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <p><span className="text-navy-400">Merchant ID:</span> <span className="font-medium text-navy-800 font-mono">{selected.id}</span></p>
              <p><span className="text-navy-400">Email:</span> <span className="font-medium text-navy-800">{selected.email}</span></p>
              <p><span className="text-navy-400">Mobile:</span> <span className="font-medium text-navy-800">{selected.mobile}</span></p>
              <p><span className="text-navy-400">City:</span> <span className="font-medium text-navy-800">{selected.city}, {selected.state}</span></p>
              <p><span className="text-navy-400">KYC:</span> <span className="font-medium text-navy-800">{selected.kycVerified ? "Verified" : "Pending"}</span></p>
              <p><span className="text-navy-400">Joined:</span> <span className="font-medium text-navy-800">{formatDate(selected.joinedDate)}</span></p>
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Applications</p>
              {applications.filter((a) => a.merchantId === selected.id).length === 0 ? (
                <p className="text-sm text-navy-400">No applications yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {applications.filter((a) => a.merchantId === selected.id).map((a) => (
                    <div key={a.id} className="flex justify-between text-sm">
                      <span className="text-navy-600">{a.planName}</span>
                      <StatusBadge status={a.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
