import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Field, Input, Textarea } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useToast } from "../../context/NotificationContext";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setForm({ name: "", email: "", message: "" });
    toast("Message sent — our team will reach out within 24 hours.");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold tracking-wide text-emerald-600 uppercase mb-2">We're here to help</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-navy-950">Contact us</h1>
      </div>

      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white border border-navy-100 rounded-2xl p-5 flex gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Phone size={17} /></span>
            <div>
              <p className="font-semibold text-navy-800 text-sm">Call us</p>
              <p className="text-sm text-navy-500">1800-123-4567 (Toll free)</p>
            </div>
          </div>
          <div className="bg-white border border-navy-100 rounded-2xl p-5 flex gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Mail size={17} /></span>
            <div>
              <p className="font-semibold text-navy-800 text-sm">Email us</p>
              <p className="text-sm text-navy-500">support@thiruinsurance.com</p>
            </div>
          </div>
          <div className="bg-white border border-navy-100 rounded-2xl p-5 flex gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><MapPin size={17} /></span>
            <div>
              <p className="font-semibold text-navy-800 text-sm">Visit us</p>
              <p className="text-sm text-navy-500">Thiru Towers, Avinashi Road, Tiruppur, Tamil Nadu 641603</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-3 bg-white border border-navy-100 rounded-2xl p-6 space-y-4">
          <Field label="Full name" required>
            <Input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
          </Field>
          <Field label="Email" required>
            <Input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
          </Field>
          <Field label="Message" required>
            <Textarea rows={5} required value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="How can we help?" />
          </Field>
          <Button type="submit" variant="emerald" loading={submitting} icon={Send} className="w-full sm:w-auto">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
