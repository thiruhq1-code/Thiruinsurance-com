import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Field, Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin({ email: form.email, password: form.password });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck size={19} />
            </span>
          </Link>
          <h1 className="font-display text-2xl font-semibold text-white">Admin Login</h1>
          <p className="text-sm text-navy-300 mt-1">Restricted access. Authorized administrators only.</p>
        </div>

        <div className="bg-white border border-navy-100 rounded-2xl shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Admin Email" required>
              <Input
                type="email"
                icon={Mail}
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                autoFocus
              />
            </Field>
            <Field label="Password" required>
              <Input
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </Field>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" variant="primary" className="w-full" loading={loading} icon={ArrowRight} iconPosition="right">
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-navy-500 mt-5">
            Not an admin?{" "}
            <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Merchant Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
