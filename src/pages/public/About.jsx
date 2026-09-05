import { ShieldCheck, Target, Heart, Users } from "lucide-react";

const VALUES = [
  { icon: ShieldCheck, title: "Transparency", desc: "No hidden clauses. What we promise in a plan is exactly what we pay out." },
  { icon: Target, title: "Simplicity", desc: "Insurance shouldn't need a translator. We write plans in plain language." },
  { icon: Heart, title: "Empathy", desc: "Claims happen at hard moments. Our process is built to be fast, not bureaucratic." },
  { icon: Users, title: "Accessibility", desc: "Fair premiums for individuals, families and small businesses alike." },
];

export default function About() {
  return (
    <div>
      <section className="bg-navy-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <p className="text-xs font-semibold tracking-wide text-emerald-400 uppercase mb-3">About Thiru Insurance</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-balance">
            We built the insurer we wished existed.
          </h1>
          <p className="text-navy-300 leading-relaxed">
            Thiru Insurance started with a simple frustration: insurance policies that were hard to understand and
            harder to claim against. We set out to build something different — plans that are honest about what
            they cover, and a claims process people don't dread.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-white border border-navy-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <v.icon size={20} />
              </div>
              <h3 className="font-display font-semibold text-navy-900 mb-2">{v.title}</h3>
              <p className="text-sm text-navy-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand-100 py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-display text-3xl font-semibold text-navy-900">12,000+</p>
            <p className="text-sm text-navy-500 mt-1">Policy holders protected</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-navy-900">₹250Cr+</p>
            <p className="text-sm text-navy-500 mt-1">Claims settled to date</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-navy-900">98.2%</p>
            <p className="text-sm text-navy-500 mt-1">Claim approval rate</p>
          </div>
        </div>
      </section>
    </div>
  );
}
