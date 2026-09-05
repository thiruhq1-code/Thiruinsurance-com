import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { useInsurance } from "../../context/InsuranceContext";
import { PageHeader } from "../../components/ui/Misc";
import { LoadingState } from "../../components/ui/States";
import Card from "../../components/ui/Card";
import { formatINR } from "../../utils/format";

const RANGES = ["Today", "7 Days", "30 Days", "This Year", "Custom"];

export default function AdminReports() {
  const { applications, policies, claims, merchants, loading } = useInsurance();
  const [range, setRange] = useState("30 Days");

  if (loading) return <LoadingState />;

  const premiumByMonth = buildMonthlySeries(policies);
  const claimsByStatus = buildStatusSeries(claims);
  const merchantGrowth = buildMerchantGrowth(merchants);

  return (
    <div>
      <PageHeader eyebrow="Insights" title="Reports" description="Platform performance across sales, claims and growth." />

      <div className="flex gap-2 mb-6 overflow-x-auto thin-scroll">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border ${
              range === r ? "bg-navy-800 text-white border-navy-800" : "bg-white text-navy-600 border-navy-100"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="font-display font-semibold text-navy-900 mb-4">Premium Collection</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={premiumByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5b77b3" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#5b77b3" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: 12, border: "1px solid #d6ddec", fontSize: 13 }} />
              <Line type="monotone" dataKey="premium" stroke="#17a06b" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-display font-semibold text-navy-900 mb-4">Claims Overview</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={claimsByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
              <XAxis dataKey="status" tick={{ fontSize: 11, fill: "#5b77b3" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#5b77b3" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #d6ddec", fontSize: 13 }} />
              <Bar dataKey="count" fill="#294073" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold text-navy-900 mb-4">Merchant Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={merchantGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5b77b3" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#5b77b3" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #d6ddec", fontSize: 13 }} />
              <Line type="monotone" dataKey="merchants" stroke="#d4a437" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function buildMonthlySeries(policies) {
  const map = {};
  policies.forEach((p) => {
    const key = new Date(p.startDate).toLocaleDateString("en-IN", { month: "short" });
    map[key] = (map[key] || 0) + p.premium;
  });
  const entries = Object.entries(map).map(([month, premium]) => ({ month, premium }));
  return entries.length ? entries : [{ month: "No data", premium: 0 }];
}

function buildStatusSeries(claims) {
  const map = {};
  claims.forEach((c) => { map[c.status] = (map[c.status] || 0) + 1; });
  return Object.entries(map).map(([status, count]) => ({ status: status.replace("_", " "), count }));
}

function buildMerchantGrowth(merchants) {
  const sorted = [...merchants].sort((a, b) => (a.joinedDate < b.joinedDate ? -1 : 1));
  let cumulative = 0;
  const map = {};
  sorted.forEach((m) => {
    cumulative += 1;
    const key = new Date(m.joinedDate).toLocaleDateString("en-IN", { month: "short" });
    map[key] = cumulative;
  });
  const entries = Object.entries(map).map(([month, merchants]) => ({ month, merchants }));
  return entries.length ? entries : [{ month: "No data", merchants: 0 }];
}
