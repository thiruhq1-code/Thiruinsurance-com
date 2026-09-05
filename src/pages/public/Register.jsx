import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, User, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/mockApi";
import { Field, Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", city: "", state: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register(form);
      // re-sync AuthContext session (register already wrote it to localStorage)
      await login({ email: form.email, password: form.password });
      navigate("/merchant/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-sand-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-xl bg-navy-800 text-white flex items-center justify-center">
              <ShieldCheck size={19} />
            </span>
          </Link>
          <h1 className="font-display text-2xl font-semibold text-navy-950">Create your account</h1>
          <p className="text-sm text-navy-500 mt-1">Sign up to buy insurance and manage your policies.</p>
        </div>

        <div className="bg-white border border-navy-100 rounded-2xl shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name" required>
              <Input icon={User} placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </Field>
            <Field label="Email" required>
              <Input type="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </Field>
            <Field label="Mobile Number" required>
              <Input icon={Phone} placeholder="10-digit mobile" maxLength={10} value={form.mobile} onChange={(e) => update("mobile", e.target.value)} required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City">
                <Input icon={MapPin} placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
              </Field>
              <Field label="State">
                <Input placeholder="State" value={form.state} onChange={(e) => update("state", e.target.value)} />
              </Field>
            </div>
            <Field label="Password" required>
              <Input type="password" placeholder="Create a password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={4} />
            </Field>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" variant="emerald" className="w-full" loading={loading} icon={ArrowRight} iconPosition="right">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-navy-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
