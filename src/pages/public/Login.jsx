import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, ArrowRight, KeyRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/mockApi";
import { Field, Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../context/NotificationContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetOpen, setResetOpen] = useState(false);
  const [resetStep, setResetStep] = useState("email"); // email -> newPassword -> done
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPasswordValue] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const redirectTo = location.state?.redirectTo;

  async function handleLogin(e, demoRole) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = demoRole
        ? await login({ demoRole })
        : await login({ email: form.email, password: form.password });
      navigate(redirectTo || (session.role === "admin" ? "/admin/dashboard" : "/merchant/dashboard"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openResetModal() {
    setResetStep("email");
    setResetEmail("");
    setResetPasswordValue("");
    setResetError("");
    setResetOpen(true);
  }

  async function handleResetContinue() {
    setResetError("");
    if (resetStep === "email") {
      if (!resetEmail.trim()) return;
      setResetStep("newPassword");
      return;
    }
    if (resetStep === "newPassword") {
      if (resetPassword.length < 4) {
        setResetError("Password must be at least 4 characters.");
        return;
      }
      setResetLoading(true);
      try {
        await api.resetPassword({ email: resetEmail, newPassword: resetPassword });
        setResetStep("done");
        toast("Password updated. You can log in now.");
      } catch (err) {
        setResetError(err.message);
      } finally {
        setResetLoading(false);
      }
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
          <h1 className="font-display text-2xl font-semibold text-navy-950">Welcome back</h1>
          <p className="text-sm text-navy-500 mt-1">Log in to manage your policies and applications.</p>
        </div>

        <div className="bg-white border border-navy-100 rounded-2xl shadow-card p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Mobile Number / Email" required>
              <Input
                type="text"
                icon={Mail}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </Field>
            <Field label="Password" required>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </Field>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex justify-end">
              <button type="button" onClick={openResetModal} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                Forgot Password?
              </button>
            </div>
            <Button type="submit" variant="emerald" className="w-full" loading={loading} icon={ArrowRight} iconPosition="right">
              Login
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-navy-100 flex-1" />
            <span className="text-xs text-navy-300">or continue as demo</span>
            <div className="h-px bg-navy-100 flex-1" />
          </div>

          <Button variant="outline" className="w-full" onClick={(e) => handleLogin(e, "merchant")} loading={loading}>
            Demo Merchant
          </Button>

          <div className="mt-5 bg-navy-50 rounded-xl p-3.5 text-xs text-navy-500 space-y-1">
            <p className="font-semibold text-navy-600">Demo credentials</p>
            <p>Merchant: merchant@thiru.com / demo123</p>
          </div>

          <p className="text-center text-sm text-navy-500 mt-5">
            New to Thiru Insurance?{" "}
            <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Sign up
            </Link>
          </p>

          <p className="text-center text-sm text-navy-400 mt-3">
            <Link to="/admin/login" className="font-semibold text-navy-500 hover:text-navy-700">
              Admin Login →
            </Link>
          </p>
        </div>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset Password"
        footer={
          resetStep !== "done" ? (
            <>
              <Button variant="ghost" onClick={() => setResetOpen(false)}>Cancel</Button>
              <Button variant="emerald" loading={resetLoading} onClick={handleResetContinue}>
                {resetStep === "email" ? "Continue" : "Update Password"}
              </Button>
            </>
          ) : (
            <Button variant="emerald" onClick={() => setResetOpen(false)}>Done</Button>
          )
        }
      >
        {resetStep === "email" && (
          <Field label="Registered Email" required>
            <Input icon={Mail} type="email" placeholder="you@example.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
          </Field>
        )}
        {resetStep === "newPassword" && (
          <div className="space-y-3">
            <p className="text-sm text-navy-500">Set a new password for <span className="font-medium text-navy-700">{resetEmail}</span></p>
            <Field label="New Password" required>
              <Input icon={KeyRound} type="password" placeholder="At least 4 characters" value={resetPassword} onChange={(e) => setResetPasswordValue(e.target.value)} />
            </Field>
          </div>
        )}
        {resetStep === "done" && (
          <p className="text-sm text-navy-600">Your password has been updated. You can now log in with your new password.</p>
        )}
        {resetError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">{resetError}</p>}
      </Modal>
    </div>
  );
}
