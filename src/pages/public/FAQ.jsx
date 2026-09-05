import Accordion from "../../components/shared/Accordion";

const FAQ_GROUPS = [
  {
    title: "Buying a policy",
    items: [
      { q: "How do I buy insurance on Thiru?", a: "Browse a category, compare plans, and click Buy Now. You'll fill personal & nominee details, upload documents, then submit for review." },
      { q: "How long does approval take?", a: "Most applications are reviewed within 24-48 hours." },
      { q: "Can I edit my application after submitting?", a: "Not directly — but if it's rejected, you can view the reason and submit a fresh corrected application." },
    ],
  },
  {
    title: "Payments",
    items: [
      { q: "When do I pay the premium?", a: "Only after your application is approved. Payment is never collected before approval." },
      { q: "What payment methods are supported?", a: "UPI, debit/credit cards and net banking (simulated in this demo)." },
    ],
  },
  {
    title: "Claims",
    items: [
      { q: "Who can raise a claim?", a: "Only policy holders with an ACTIVE policy can raise a claim against it." },
      { q: "How long does claim settlement take?", a: "Typically 3-7 working days after all required documents are submitted." },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold tracking-wide text-emerald-600 uppercase mb-2">We've got answers</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-navy-950">Frequently asked questions</h1>
      </div>
      <div className="space-y-10">
        {FAQ_GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="font-display font-semibold text-navy-900 mb-3">{group.title}</h2>
            <Accordion items={group.items} />
          </div>
        ))}
      </div>
    </div>
  );
}
