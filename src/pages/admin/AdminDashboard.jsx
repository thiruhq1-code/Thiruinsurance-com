import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { Users, FileStack, FileClock, ShieldPlus, TrendingUp, ClipboardList, ArrowRight } from "lucide-react";
import { useInsurance } from "../../context/InsuranceContext";
import { PageHeader, StatCard } from "../../components/ui/Misc";
import { LoadingState } from "../../components/ui/States";
import StatusBadge from "../../components/ui/StatusBadge";
import Card from "../../components/ui/Card";
import { formatINR, formatDate } from "../../utils/format";

const COLORS = ["#17a06b", "#294073", "#d4a437", "#5b77b3", "#33c286", "#8499c6", "#0c6a46"];

export default function AdminDashboard() {
  const { applications, policies, claims, merchants, loading } = useInsurance();

  if (loading) return <LoadingState label="Loading dashboard..." />;

  const activePolicies = policies.filter((p) => p.status === "ACTIVE");
  const pendingApplications = applications.filter((a) => a.status === "PENDING_APPROVAL");
  const pendingClaims = claims.filter((c) => !["SETTLED", "REJECTED"].includes(c.status));
  const totalPremium = policies.reduce((sum, p) => sum + (p.premium || 0), 0);

  const salesByMonth = buildMonthlySeries(policies);
  const categoryDist = buildCategoryDistribution(applications);

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Admin Dashboard" description="Platform-wide activity across applications, policies and claims." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Merchants" value={merchants.length} icon={Users} tone="navy" />
        <StatCard label="Total Policies" value={policies.length} icon={FileStack} tone="navy" />
        <StatCard label="Pending Applications" value={pendingApplications.length} icon={FileClock} tone="amber" />
        <StatCard label="Active Policies" value={activePolicies.length} icon={ShieldPlus} tone="emerald" />
        <StatCard label="Total Premium" value={formatINR(totalPremium)} icon={TrendingUp} tone="navy" />
        <StatCard label="Pending Claims" value={pendingClaims.length} icon={ClipboardList} tone="red" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold text-navy-900 mb-4">Policy Sales (Premium Collected)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5b77b3" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#5b77b3" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: 12, border: "1px solid #d6ddec", fontSize: 13 }} />
              <Bar dataKey="premium" fill="#17a06b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-display font-semibold text-navy-900 mb-4">Insurance Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {categoryDist.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #d6ddec", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
            {categoryDist.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs text-navy-500">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                {c.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100">
          <h3 className="font-display font-semibold text-navy-900">Recent Activity</h3>
          <Link to="/admin/applications" className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            View all applications <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-navy-50">
          {applications.slice(0, 6).map((a) => (
            <Link key={a.id} to={`/admin/applications/${a.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-navy-50">
              <div>
                <p className="text-sm font-medium text-navy-800">{a.merchantName} <span className="text-navy-400 font-normal">applied for {a.planName}</span></p>
                <p className="text-xs text-navy-400 mt-0.5">{a.id} · {formatDate(a.submittedDate)}</p>
              </div>
              <StatusBadge status={a.status} />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function buildMonthlySeries(policies) {
  const map = {};
  policies.forEach((p) => {
    const d = new Date(p.startDate);
    const key = d.toLocaleDateString("en-IN", { month: "short" });
    map[key] = (map[key] || 0) + p.premium;
  });
  if (Object.keys(map).length === 0) {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => ({ month: m, premium: 0 }));
  }
  return Object.entries(map).map(([month, premium]) => ({ month, premium }));
}

function buildCategoryDistribution(applications) {
  const map = {};
  applications.forEach((a) => {
    map[a.categoryName] = (map[a.categoryName] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}
