import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ShieldCheck, Zap, SlidersHorizontal, Headset, FileSignature,
  FileSearch, ClipboardCheck, BadgeCheck, Wallet, Star, ChevronRight, Stamp
} from "lucide-react";
import { getCategories } from "../../services/productsStore";
import { getIcon } from "../../utils/iconMap";
import { formatINR, formatCoverage } from "../../utils/format";
import Button from "../../components/ui/Button";
import Accordion from "../../components/shared/Accordion";

const WHY_CHOOSE = [
  { icon: ShieldCheck, title: "Trusted Protection", desc: "Transparent policies with no hidden clauses — what's covered is what's promised." },
  { icon: Zap, title: "Simple Process", desc: "Apply in minutes with a guided, paperless application flow." },
  { icon: SlidersHorizontal, title: "Flexible Plans", desc: "From essential to elite cover, pick what actually fits your life." },
  { icon: Headset, title: "Fast Support", desc: "Real help when you need it — for applications, claims and renewals." },
];

const HOW_IT_WORKS = [
  { title: "Choose Insurance", desc: "Pick a category that fits your need — health, motor, life and more." },
  { title: "Select Your Plan", desc: "Compare coverage and premiums across Core, Supreme and Elite tiers." },
  { title: "Submit Application", desc: "Fill personal, nominee details and upload documents in one flow." },
  { title: "Get Approved", desc: "Our team reviews your application and documents." },
  { title: "Make Payment", desc: "Pay securely once your application is approved." },
  { title: "Policy Activated", desc: "Your policy goes live immediately after payment." },
];

const CLAIMS_STEPS = [
  { icon: FileSignature, title: "Register Claim", desc: "Raise a claim against any active policy in a few taps." },
  { icon: FileSearch, title: "Submit Documents", desc: "Upload bills, reports or proof relevant to your claim." },
  { icon: ClipboardCheck, title: "Review", desc: "Our claims team verifies the details you've submitted." },
  { icon: BadgeCheck, title: "Approval", desc: "Approved claims move straight to settlement." },
  { icon: Wallet, title: "Settlement", desc: "Funds are settled as per your policy terms." },
];

const TESTIMONIALS = [
  { name: "Divya Prakash", role: "THIRU SUPREME · Health", quote: "My hospitalization claim was approved without any back-and-forth. The whole process felt honest, not exhausting.", rating: 5 },
  { name: "Arun Balaji", role: "THIRU CORE · Motor", quote: "Renewed my car insurance in under five minutes on my phone. No agent calls, no pressure — just what I needed.", rating: 5 },
  { name: "Nandhini R", role: "THIRU ELITE · Life", quote: "I finally understood what I was actually covered for. The plan comparison made the decision easy.", rating: 4 },
];

const FAQS = [
  { q: "How fast is claim approval?", a: "Most claims are reviewed within 3-5 working days once all documents are submitted correctly." },
  { q: "Can I switch plans later?", a: "Yes, you can upgrade your plan at renewal, or apply for a new policy anytime." },
  { q: "Is my premium fixed for the year?", a: "Yes, your premium stays fixed for the full policy term you've purchased." },
  { q: "What happens if my application is rejected?", a: "You'll see the exact reason and can resubmit a fresh application with corrected details." },
];

export default function Home() {
  const categories = getCategories();
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden policy-paper">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-60" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full mb-5">
              <ShieldCheck size={13} /> Trusted by 12,000+ policy holders
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-navy-950 leading-[1.1] text-balance">
              Protect what matters most.
            </h1>
            <p className="text-navy-500 text-base md:text-lg mt-5 max-w-md leading-relaxed">
              Simple, reliable and affordable insurance solutions for you, your family and your business.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button as={Link} to="/insurance" size="lg" variant="emerald" icon={ArrowRight} iconPosition="right">
                Explore Insurance
              </Button>
              <Button as={Link} to="/register" size="lg" variant="outline">
                Get Protected
              </Button>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-navy-400">
              <div><span className="font-display text-xl font-semibold text-navy-900">₹250Cr+</span><br />Claims Settled</div>
              <div className="w-px h-9 bg-navy-100" />
              <div><span className="font-display text-xl font-semibold text-navy-900">98.2%</span><br />Claim Approval Rate</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative bg-white border border-navy-100 rounded-2xl shadow-lifted p-6 max-w-sm mx-auto rotate-1">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[11px] text-navy-400 tracking-wide uppercase">Policy Certificate</p>
                  <p className="font-display text-lg font-semibold text-navy-900">THIRU SUPREME</p>
                </div>
                <span className="w-11 h-11 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Stamp size={20} />
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-navy-400">Policy Holder</span><span className="font-medium text-navy-800">Karthik Raja</span></div>
                <div className="flex justify-between"><span className="text-navy-400">Coverage</span><span className="font-medium text-navy-800">₹10,00,000</span></div>
                <div className="flex justify-between"><span className="text-navy-400">Premium</span><span className="font-medium text-navy-800">₹12,999/year</span></div>
                <div className="flex justify-between items-center"><span className="text-navy-400">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                  </span>
                </div>
              </div>
              <div className="border-t border-dashed border-navy-200 mt-5 pt-4 flex justify-between text-xs text-navy-400">
                <span>Valid till 02 May 2027</span>
                <span className="font-mono">THIRU-HLT-88213</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white border border-navy-100 rounded-xl shadow-card px-4 py-3 hidden sm:flex items-center gap-2 -rotate-2">
              <BadgeCheck size={18} className="text-emerald-600" />
              <span className="text-xs font-semibold text-navy-700">Claim settled in 4 days</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-emerald-600 uppercase mb-2">Coverage for every stage of life</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy-900">Choose your insurance</h2>
          </div>
          <Link to="/insurance" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            View all <ChevronRight size={15} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => {
            const Icon = getIcon(cat.icon);
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="bg-white border border-navy-100 rounded-2xl p-5 hover:shadow-card hover:-translate-y-0.5 transition-all"
              >
                <span className="w-11 h-11 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center mb-4">
                  <Icon size={20} />
                </span>
                <h3 className="font-display font-semibold text-navy-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-navy-400 mb-4 leading-relaxed">{cat.description}</p>
                <p className="text-xs text-navy-400 mb-3">From <span className="font-semibold text-navy-700">{formatINR(cat.startingPremium)}</span></p>
                <Link to={`/insurance/${cat.slug}`} className="text-sm font-semibold text-emerald-700 flex items-center gap-1 hover:gap-2 transition-all">
                  Explore <ArrowRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-navy-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-xs font-semibold tracking-wide text-emerald-400 uppercase mb-2 text-center">The Thiru difference</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-center mb-12">Why choose Thiru</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE.map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <item.icon size={20} />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-navy-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <p className="text-xs font-semibold tracking-wide text-emerald-600 uppercase mb-2 text-center">From browsing to protected</p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy-900 text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-5">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="text-4xl font-display font-semibold text-navy-100 mb-2">{String(i + 1).padStart(2, "0")}</div>
              <h4 className="font-semibold text-navy-800 text-sm mb-1.5">{step.title}</h4>
              <p className="text-xs text-navy-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR PLANS */}
      <section className="bg-sand-100 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-xs font-semibold tracking-wide text-emerald-600 uppercase mb-2 text-center">Most picked this quarter</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy-900 text-center mb-12">Popular plans</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories[0].plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl p-6 border relative ${plan.popular ? "border-emerald-300 shadow-lifted md:-translate-y-2" : "border-navy-100 shadow-soft"}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <p className="text-xs text-navy-400 mb-1">Health Insurance</p>
                <h3 className="font-display text-xl font-semibold text-navy-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-navy-400 mb-4">{plan.tagline}</p>
                <p className="font-display text-2xl font-semibold text-navy-900 mb-1">{formatINR(plan.premium)}<span className="text-sm font-normal text-navy-400">/year</span></p>
                <p className="text-xs text-emerald-700 font-semibold mb-5">Coverage up to {formatCoverage(plan.coverage)}</p>
                <ul className="space-y-2 mb-6">
                  {plan.benefits.slice(0, 3).map((b) => (
                    <li key={b} className="text-sm text-navy-600 flex gap-2">
                      <BadgeCheck size={15} className="text-emerald-500 shrink-0 mt-0.5" /> {b}
                    </li>
                  ))}
                </ul>
                <Button as={Link} to={`/insurance/health/${plan.id}`} variant={plan.popular ? "emerald" : "outline"} className="w-full">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLAIMS PROCESS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <p className="text-xs font-semibold tracking-wide text-emerald-600 uppercase mb-2 text-center">When you need us most</p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy-900 text-center mb-12">Claims process</h2>
        <div className="grid md:grid-cols-5 gap-4 relative">
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-navy-200" />
          {CLAIMS_STEPS.map((step) => (
            <div key={step.title} className="text-center relative bg-sand-50">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <step.icon size={19} />
              </div>
              <h4 className="font-semibold text-navy-800 text-sm mb-1">{step.title}</h4>
              <p className="text-xs text-navy-400 leading-relaxed px-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-navy-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-xs font-semibold tracking-wide text-emerald-400 uppercase mb-2 text-center">What policy holders say</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-white text-center mb-12">Real stories, real cover</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-navy-800 border border-navy-700 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < t.rating ? "fill-emerald-400 text-emerald-400" : "text-navy-600"} />
                  ))}
                </div>
                <p className="text-sm text-navy-200 leading-relaxed mb-5">"{t.quote}"</p>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-navy-400">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <p className="text-xs font-semibold tracking-wide text-emerald-600 uppercase mb-2 text-center">Common questions</p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy-900 text-center mb-10">Frequently asked questions</h2>
        <Accordion items={FAQS} />
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="bg-gradient-to-br from-navy-800 to-navy-950 rounded-3xl px-8 py-14 text-center relative overflow-hidden">
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mb-3 relative">Ready to protect what matters most?</h2>
          <p className="text-navy-300 mb-7 relative">Get a plan that fits your life in under five minutes.</p>
          <Button as={Link} to="/insurance" size="lg" variant="emerald" icon={ArrowRight} iconPosition="right" className="relative">
            Explore Insurance
          </Button>
        </div>
      </section>
    </div>
  );
}
