// Product catalog store — wraps the static seed data (insurancePlans.js) with an
// admin-editable overlay so Add / Edit / Deactivate actually persist (localStorage-backed).

import { INSURANCE_CATEGORIES as BASE_CATEGORIES } from "../data/insurancePlans";

const KEY = "thiru_product_overlay";

function readOverlay() {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through to default
    }
  }
  const initial = { extraPlans: {}, planOverrides: {}, deactivatedPlanIds: [] };
  localStorage.setItem(KEY, JSON.stringify(initial));
  return initial;
}

function writeOverlay(overlay) {
  localStorage.setItem(KEY, JSON.stringify(overlay));
}

function genPlanId(categorySlug, name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${categorySlug}-${slug}-${Date.now().toString().slice(-5)}`;
}

// Returns categories with overlay applied.
// includeInactive: admin views need deactivated plans visible (marked inactive);
// public/merchant views should never see deactivated plans.
export function getCategories({ includeInactive = false } = {}) {
  const overlay = readOverlay();
  return BASE_CATEGORIES.map((cat) => {
    const extra = overlay.extraPlans[cat.slug] || [];
    let plans = [...cat.plans, ...extra].map((p) => {
      const override = overlay.planOverrides[p.id];
      const merged = override ? { ...p, ...override } : p;
      const isActive = !overlay.deactivatedPlanIds.includes(p.id);
      return { ...merged, active: isActive };
    });
    if (!includeInactive) plans = plans.filter((p) => p.active);
    return { ...cat, plans };
  });
}

export function getCategoryBySlug(slug, opts) {
  return getCategories(opts).find((c) => c.slug === slug);
}

export function getPlanById(planId, opts) {
  for (const cat of getCategories(opts)) {
    const plan = cat.plans.find((p) => p.id === planId);
    if (plan) return { ...plan, category: cat };
  }
  return null;
}

export function addPlan(categorySlug, planData) {
  const overlay = readOverlay();
  const id = genPlanId(categorySlug, planData.name);
  const newPlan = {
    id,
    name: planData.name,
    premium: Number(planData.premium),
    premiumPeriod: planData.premiumPeriod || "year",
    coverage: Number(planData.coverage),
    tagline: planData.tagline || "",
    benefits: planData.benefits?.length ? planData.benefits : ["Custom benefit"],
    exclusions: planData.exclusions?.length ? planData.exclusions : ["As per policy terms"],
    eligibility: planData.eligibility || "As per policy terms",
    documents: planData.documents?.length ? planData.documents : ["Aadhaar", "PAN"],
  };
  const extraPlans = { ...overlay.extraPlans, [categorySlug]: [...(overlay.extraPlans[categorySlug] || []), newPlan] };
  writeOverlay({ ...overlay, extraPlans });
  return newPlan;
}

export function updatePlan(planId, updates) {
  const overlay = readOverlay();
  const planOverrides = { ...overlay.planOverrides, [planId]: { ...overlay.planOverrides[planId], ...updates } };
  writeOverlay({ ...overlay, planOverrides });
}

export function togglePlanStatus(planId) {
  const overlay = readOverlay();
  const isDeactivated = overlay.deactivatedPlanIds.includes(planId);
  const deactivatedPlanIds = isDeactivated
    ? overlay.deactivatedPlanIds.filter((id) => id !== planId)
    : [...overlay.deactivatedPlanIds, planId];
  writeOverlay({ ...overlay, deactivatedPlanIds });
  return !isDeactivated ? "DEACTIVATED" : "ACTIVATED";
}
