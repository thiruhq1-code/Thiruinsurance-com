import { Phone, Mail, MessageCircle } from "lucide-react";
import { PageHeader } from "../../components/ui/Misc";
import Card from "../../components/ui/Card";
import Accordion from "../../components/shared/Accordion";

const SUPPORT_FAQS = [
  { q: "How do I check my application status?", a: "Go to My Applications from the sidebar to see live status and timeline for every application you've submitted." },
  { q: "My payment failed, what do I do?", a: "Go to your application details and retry payment — approved applications stay in Payment Pending until payment succeeds." },
  { q: "How do I download my policy document?", a: "Open the policy from My Policies and click Download Policy." },
];

export default function Support() {
  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="We're here for you" title="Help & Support" description="Reach our team or browse common questions." />
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="text-center"><Phone size={20} className="mx-auto text-emerald-600 mb-2" /><p className="text-sm font-semibold text-navy-800">1800-123-4567</p><p className="text-xs text-navy-400">Toll free</p></Card>
        <Card className="text-center"><Mail size={20} className="mx-auto text-emerald-600 mb-2" /><p className="text-sm font-semibold text-navy-800">support@thiruinsurance.com</p></Card>
        <Card className="text-center"><MessageCircle size={20} className="mx-auto text-emerald-600 mb-2" /><p className="text-sm font-semibold text-navy-800">Live Chat</p><p className="text-xs text-navy-400">9am - 9pm</p></Card>
      </div>
      <h3 className="font-display font-semibold text-navy-900 mb-3">Common questions</h3>
      <Accordion items={SUPPORT_FAQS} />
    </div>
  );
}
