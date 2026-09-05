import { useEffect, useState } from "react";
import { Plus, Pencil, Power, PowerOff } from "lucide-react";
import { INSURANCE_CATEGORIES } from "../../data/insurancePlans";
import * as productsStore from "../../services/productsStore";
import { getIcon } from "../../utils/iconMap";
import { useToast } from "../../context/NotificationContext";
import { PageHeader } from "../../components/ui/Misc";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Field, Input, Select, Textarea } from "../../components/ui/Input";
import { formatINR, formatCoverage } from "../../utils/format";

const CATEGORY_OPTIONS = INSURANCE_CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }));

const EMPTY_FORM = {
  categorySlug: CATEGORY_OPTIONS[0].slug,
  name: "",
  tagline: "",
  premium: "",
  premiumPeriod: "year",
  coverage: "",
  eligibility: "",
  benefitsText: "",
  exclusionsText: "",
  documentsText: "Aadhaar, PAN",
};

export default function AdminProducts() {
  const { toast } = useToast();
  const [activeCat, setActiveCat] = useState(CATEGORY_OPTIONS[0].slug);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function refresh() {
    setCategories(productsStore.getCategories({ includeInactive: true }));
  }

  useEffect(() => {
    refresh();
  }, []);

  const category = categories.find((c) => c.slug === activeCat);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openAddModal() {
    setEditingPlanId(null);
    setForm({ ...EMPTY_FORM, categorySlug: activeCat });
    setModalOpen(true);
  }

  function openEditModal(plan) {
    setEditingPlanId(plan.id);
    setForm({
      categorySlug: activeCat,
      name: plan.name,
      tagline: plan.tagline,
      premium: plan.premium,
      premiumPeriod: plan.premiumPeriod,
      coverage: plan.coverage,
      eligibility: plan.eligibility,
      benefitsText: plan.benefits.join(", "),
      exclusionsText: plan.exclusions.join(", "),
      documentsText: plan.documents.join(", "),
    });
    setModalOpen(true);
  }

  function toCsvArray(text) {
    return text.split(",").map((s) => s.trim()).filter(Boolean);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      tagline: form.tagline,
      premium: form.premium,
      premiumPeriod: form.premiumPeriod,
      coverage: form.coverage,
      eligibility: form.eligibility,
      benefits: toCsvArray(form.benefitsText),
      exclusions: toCsvArray(form.exclusionsText),
      documents: toCsvArray(form.documentsText),
    };

    if (editingPlanId) {
      productsStore.updatePlan(editingPlanId, payload);
      toast(`${form.name} updated successfully.`);
    } else {
      productsStore.addPlan(form.categorySlug, payload);
      toast(`${form.name} added to ${CATEGORY_OPTIONS.find((c) => c.slug === form.categorySlug)?.name}.`);
      setActiveCat(form.categorySlug);
    }
    refresh();
    setSaving(false);
    setModalOpen(false);
  }

  function handleToggle(plan) {
    const result = productsStore.togglePlanStatus(plan.id);
    refresh();
    toast(`${plan.name} ${result === "DEACTIVATED" ? "deactivated" : "activated"}.`, { type: result === "DEACTIVATED" ? "info" : "success" });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Insurance Products"
        description="Manage insurance categories and plans available to merchants."
        actions={<Button variant="emerald" icon={Plus} onClick={openAddModal}>Add Insurance</Button>}
      />

      <div className="flex gap-2 overflow-x-auto thin-scroll mb-6 pb-1">
        {CATEGORY_OPTIONS.map((c) => {
          const Icon = getIcon(INSURANCE_CATEGORIES.find((ic) => ic.slug === c.slug)?.icon);
          return (
            <button
              key={c.slug}
              onClick={() => setActiveCat(c.slug)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border ${
                activeCat === c.slug ? "bg-navy-800 text-white border-navy-800" : "bg-white text-navy-600 border-navy-100"
              }`}
            >
              <Icon size={15} /> {c.name}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {category?.plans.map((plan) => (
          <div key={plan.id} className={`bg-white border rounded-2xl p-5 ${plan.active ? "border-navy-100" : "border-navy-100 opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-display font-semibold text-navy-900">{plan.name}</p>
                <p className="text-xs text-navy-400">{category.name}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${plan.active ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-navy-400 bg-navy-50 border-navy-200"}`}>
                {plan.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-navy-500 mb-4">{plan.tagline}</p>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-navy-800 font-semibold">{formatINR(plan.premium)}/{plan.premiumPeriod}</span>
              <span className="text-navy-500">{formatCoverage(plan.coverage)}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={Pencil} className="flex-1" onClick={() => openEditModal(plan)}>Edit</Button>
              <Button variant="ghost" size="sm" icon={plan.active ? PowerOff : Power} onClick={() => handleToggle(plan)}>
                {plan.active ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlanId ? "Edit Plan" : "Add New Insurance Plan"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="emerald" loading={saving} disabled={!form.name || !form.premium || !form.coverage} onClick={handleSave}>
              {editingPlanId ? "Save Changes" : "Add Plan"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          {!editingPlanId && (
            <Field label="Insurance Category" required>
              <Select value={form.categorySlug} onChange={(e) => update("categorySlug", e.target.value)}>
                {CATEGORY_OPTIONS.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </Select>
            </Field>
          )}
          <Field label="Plan Name" required>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. THIRU PREMIUM" />
          </Field>
          <Field label="Tagline">
            <Input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Short one-line description" />
          </Field>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Premium (₹)" required>
              <Input type="number" value={form.premium} onChange={(e) => update("premium", e.target.value)} />
            </Field>
            <Field label="Premium Period">
              <Select value={form.premiumPeriod} onChange={(e) => update("premiumPeriod", e.target.value)}>
                <option value="year">Per Year</option>
                <option value="trip">Per Trip</option>
              </Select>
            </Field>
            <Field label="Coverage (₹)" required>
              <Input type="number" value={form.coverage} onChange={(e) => update("coverage", e.target.value)} />
            </Field>
          </div>
          <Field label="Eligibility">
            <Input value={form.eligibility} onChange={(e) => update("eligibility", e.target.value)} placeholder="e.g. Age 18-60" />
          </Field>
          <Field label="Benefits" hint="Comma-separated">
            <Textarea rows={2} value={form.benefitsText} onChange={(e) => update("benefitsText", e.target.value)} />
          </Field>
          <Field label="Exclusions" hint="Comma-separated">
            <Textarea rows={2} value={form.exclusionsText} onChange={(e) => update("exclusionsText", e.target.value)} />
          </Field>
          <Field label="Documents Required" hint="Comma-separated">
            <Input value={form.documentsText} onChange={(e) => update("documentsText", e.target.value)} />
          </Field>
        </form>
      </Modal>
    </div>
  );
}
