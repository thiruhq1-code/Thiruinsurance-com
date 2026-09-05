// Mock API service layer.
// Every function here simulates a network call against localStorage.
// Later, swap the internals for real axios calls without changing the call signatures.

import { SEED_APPLICATIONS } from "../data/applications";
import { SEED_POLICIES } from "../data/policies";
import { SEED_CLAIMS } from "../data/claims";
import { SEED_PAYMENTS } from "../data/payments";
import { SEED_NOTIFICATIONS } from "../data/notifications";
import { MERCHANTS, DEMO_MERCHANT, ADMIN_USER } from "../data/merchants";
import { getPlanById } from "./productsStore";

const DELAY = 350;
const wait = (ms = DELAY) => new Promise((res) => setTimeout(res, ms));

const KEYS = {
  APPLICATIONS: "thiru_applications",
  POLICIES: "thiru_policies",
  CLAIMS: "thiru_claims",
  PAYMENTS: "thiru_payments",
  NOTIFICATIONS: "thiru_notifications",
  SESSION: "thiru_session",
  MERCHANTS: "thiru_merchants",
  CREDENTIALS: "thiru_credentials", // mock only — email -> password map
};

function readStore(key, seed) {
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through to reseed
    }
  }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function genId(prefix) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${Date.now().toString().slice(-8)}${rand}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/* ---------------- AUTH ---------------- */

const ADMIN_EMAIL = "thiruinsurance@gmail.com";
const ADMIN_PASSWORD = "thiru123";

export async function adminLogin({ email, password }) {
  await wait();
  const normalizedEmail = email?.trim().toLowerCase();
  if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const session = { role: "admin", user: ADMIN_USER };
    writeStore(KEYS.SESSION, session);
    return session;
  }
  throw new Error("Invalid admin email or password.");
}

function readMerchants() {
  return readStore(KEYS.MERCHANTS, MERCHANTS);
}

function readCredentials() {
  return readStore(KEYS.CREDENTIALS, {
    "merchant@thiru.com": "demo123",
    "admin@thiru.com": "admin123",
  });
}

export async function login({ email, password, demoRole }) {
  await wait();
  if (demoRole === "merchant") {
    const session = { role: "merchant", user: DEMO_MERCHANT };
    writeStore(KEYS.SESSION, session);
    return session;
  }

  const normalizedEmail = email?.trim().toLowerCase();

  // Merchant login — check registered credentials (seed demo + anyone who signed up)
  const credentials = readCredentials();
  const storedPassword = credentials[normalizedEmail];
  if (storedPassword && storedPassword === password) {
    const merchants = readMerchants();
    const merchant = merchants.find((m) => m.email.toLowerCase() === normalizedEmail);
    if (merchant) {
      const session = { role: "merchant", user: merchant };
      writeStore(KEYS.SESSION, session);
      return session;
    }
  }

  throw new Error("Invalid email or password. Try the demo credentials shown below, or sign up for a new account.");
}

export async function resetPassword({ email, newPassword }) {
  await wait(400);
  const normalizedEmail = email?.trim().toLowerCase();
  if (normalizedEmail === "admin@thiru.com") {
    throw new Error("The demo admin account password can't be changed.");
  }
  const credentials = readCredentials();
  if (!credentials[normalizedEmail]) {
    throw new Error("No account found with this email. Try signing up instead.");
  }
  writeStore(KEYS.CREDENTIALS, { ...credentials, [normalizedEmail]: newPassword });
  return true;
}

export async function register({ name, email, mobile, password, city, state }) {
  await wait(500);
  const normalizedEmail = email?.trim().toLowerCase();
  const merchants = readMerchants();
  const credentials = readCredentials();

  if (merchants.some((m) => m.email.toLowerCase() === normalizedEmail)) {
    throw new Error("An account with this email already exists. Try logging in instead.");
  }

  const newMerchant = {
    id: genId("MER"),
    name,
    email: normalizedEmail,
    mobile,
    city: city || "",
    state: state || "",
    status: "ACTIVE",
    joinedDate: todayISO(),
    kycVerified: false,
  };

  writeStore(KEYS.MERCHANTS, [...merchants, newMerchant]);
  writeStore(KEYS.CREDENTIALS, { ...credentials, [normalizedEmail]: password });

  const session = { role: "merchant", user: newMerchant };
  writeStore(KEYS.SESSION, session);

  await addNotification({
    role: "admin",
    userId: ADMIN_USER.id,
    title: "New Merchant Registered",
    message: `${name} just created an account on Thiru Insurance.`,
    type: "merchant",
  });

  return session;
}

export function getSession() {
  const raw = localStorage.getItem(KEYS.SESSION);
  return raw ? JSON.parse(raw) : null;
}

export async function logout() {
  await wait(150);
  localStorage.removeItem(KEYS.SESSION);
}

function updateMerchantKyc(merchantId, verified) {
  const merchants = readMerchants();
  const updated = merchants.map((m) => (m.id === merchantId ? { ...m, kycVerified: verified } : m));
  writeStore(KEYS.MERCHANTS, updated);

  // keep the active session's user object in sync so Profile page reflects it immediately
  const session = getSession();
  if (session?.user?.id === merchantId) {
    writeStore(KEYS.SESSION, { ...session, user: { ...session.user, kycVerified: verified } });
  }
  return updated.find((m) => m.id === merchantId);
}

/* ---------------- APPLICATIONS ---------------- */

export async function getApplications({ merchantId } = {}) {
  await wait();
  const all = readStore(KEYS.APPLICATIONS, SEED_APPLICATIONS);
  return merchantId ? all.filter((a) => a.merchantId === merchantId) : all;
}

export async function getApplicationById(id) {
  await wait(200);
  const all = readStore(KEYS.APPLICATIONS, SEED_APPLICATIONS);
  return all.find((a) => a.id === id) || null;
}

export async function createApplication({ merchantId, merchantName, planId, personal, nominee, documents, premiumFrequency = "yearly", premiumAmount }) {
  await wait(500);
  const plan = getPlanById(planId);
  const all = readStore(KEYS.APPLICATIONS, SEED_APPLICATIONS);
  const newApp = {
    id: genId("APP"),
    merchantId,
    merchantName,
    planId,
    planName: plan?.name,
    categoryName: plan?.category?.name,
    categorySlug: plan?.category?.slug,
    premium: premiumAmount ?? plan?.premium,
    premiumFrequency,
    coverage: plan?.coverage,
    status: "PENDING_APPROVAL",
    submittedDate: todayISO(),
    personal,
    nominee,
    documents,
    timeline: [
      { step: "SUBMITTED", date: todayISO() },
      { step: "PENDING_APPROVAL", date: todayISO() },
    ],
  };
  const updated = [newApp, ...all];
  writeStore(KEYS.APPLICATIONS, updated);

  // Documents were just uploaded as part of this application — simulate an
  // automated Aadhaar/PAN verification check (like real insurers do via eKYC APIs).
  if (documents?.length) {
    updateMerchantKyc(merchantId, true);
  }

  // notify admin
  await addNotification({
    role: "admin",
    userId: ADMIN_USER.id,
    title: "New Application",
    message: `New application ${newApp.id} submitted by ${merchantName}.`,
    type: "application",
  });

  return newApp;
}

export async function approveApplication(applicationId) {
  await wait(400);
  const all = readStore(KEYS.APPLICATIONS, SEED_APPLICATIONS);
  const updated = all.map((a) =>
    a.id === applicationId
      ? {
          ...a,
          status: "PAYMENT_PENDING",
          approvedDate: todayISO(),
          timeline: [...a.timeline, { step: "APPROVED", date: todayISO() }, { step: "PAYMENT_PENDING", date: todayISO() }],
        }
      : a
  );
  writeStore(KEYS.APPLICATIONS, updated);
  const app = updated.find((a) => a.id === applicationId);
  if (app) {
    await addNotification({
      role: "merchant",
      userId: app.merchantId,
      title: "Application Approved",
      message: `Your ${app.categoryName} application ${app.id} was approved. Complete payment to activate your policy.`,
      type: "application",
    });
  }
  return app;
}

export async function rejectApplication(applicationId, reason) {
  await wait(400);
  const all = readStore(KEYS.APPLICATIONS, SEED_APPLICATIONS);
  const updated = all.map((a) =>
    a.id === applicationId
      ? {
          ...a,
          status: "REJECTED",
          rejectedDate: todayISO(),
          rejectionReason: reason,
          timeline: [...a.timeline, { step: "REJECTED", date: todayISO() }],
        }
      : a
  );
  writeStore(KEYS.APPLICATIONS, updated);
  const app = updated.find((a) => a.id === applicationId);
  if (app) {
    await addNotification({
      role: "merchant",
      userId: app.merchantId,
      title: "Application Rejected",
      message: `Your ${app.categoryName} application ${app.id} was rejected: ${reason}`,
      type: "application",
    });
  }
  return app;
}

/* ---------------- PAYMENTS ---------------- */

export async function createPayment({ applicationId, method }) {
  await wait(700); // simulate gateway delay
  const apps = readStore(KEYS.APPLICATIONS, SEED_APPLICATIONS);
  const app = apps.find((a) => a.id === applicationId);
  if (!app) throw new Error("Application not found");
  if (app.status !== "PAYMENT_PENDING") throw new Error("Payment not available for this application");

  const payments = readStore(KEYS.PAYMENTS, SEED_PAYMENTS);
  const policyNumber = `THIRU-${app.categorySlug?.slice(0, 3).toUpperCase() || "GEN"}-${Math.floor(10000 + Math.random() * 89999)}`;

  const payment = {
    id: genId("PAY"),
    applicationId,
    policyNumber,
    merchantId: app.merchantId,
    merchantName: app.merchantName,
    amount: app.premium,
    date: todayISO(),
    method,
    status: "SUCCESS",
  };
  writeStore(KEYS.PAYMENTS, [payment, ...payments]);

  // update application
  const updatedApps = apps.map((a) =>
    a.id === applicationId
      ? {
          ...a,
          status: "ACTIVE",
          paidDate: todayISO(),
          timeline: [...a.timeline, { step: "PAID", date: todayISO() }, { step: "ACTIVE", date: todayISO() }],
        }
      : a
  );
  writeStore(KEYS.APPLICATIONS, updatedApps);

  // Policy term is always 1 year, regardless of payment frequency chosen.
  // premiumFrequency only decides how the premium is split into installments
  // (monthly/quarterly/half-yearly/annual) — it does NOT shorten the cover period.
  // TODO (future): track individual installment due dates, and define what happens
  // to policy status (grace period / lapse / pending) if an installment is missed.
  const start = new Date();
  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);
  const policies = readStore(KEYS.POLICIES, SEED_POLICIES);
  const plan = getPlanById(app.planId);
  const installments = buildInstallmentSchedule(start, app.premiumFrequency || "yearly", app.premium);
  const policy = {
    policyNumber,
    applicationId,
    merchantId: app.merchantId,
    merchantName: app.merchantName,
    categoryName: app.categoryName,
    categorySlug: app.categorySlug,
    planId: app.planId,
    planName: app.planName,
    coverage: app.coverage,
    premium: app.premium,
    premiumFrequency: app.premiumFrequency || "yearly",
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    status: "ACTIVE",
    benefits: plan?.benefits || [],
    installments,
  };
  writeStore(KEYS.POLICIES, [policy, ...policies]);

  await addNotification({
    role: "merchant",
    userId: app.merchantId,
    title: "Policy Activated",
    message: `Payment successful. Your policy ${policyNumber} is now active.`,
    type: "policy",
  });
  await addNotification({
    role: "admin",
    userId: ADMIN_USER.id,
    title: "Payment Completed",
    message: `${app.merchantName} completed payment for ${app.id}.`,
    type: "payment",
  });

  return { payment, policy };
}

export async function getPayments({ merchantId } = {}) {
  await wait();
  const all = readStore(KEYS.PAYMENTS, SEED_PAYMENTS);
  return merchantId ? all.filter((p) => p.merchantId === merchantId) : all;
}

const FREQ_MONTHS = { monthly: 1, quarterly: 3, "half-yearly": 6, yearly: 12 };

// Builds the full 1-year installment schedule (e.g. 12 installments for monthly,
// 4 for quarterly, 2 for half-yearly, 1 for yearly). The first installment is
// marked PAID immediately since it's collected at purchase time.
function buildInstallmentSchedule(policyStartDate, frequency, installmentAmount) {
  const months = FREQ_MONTHS[frequency] || 12;
  const count = 12 / months;
  const today = new Date().toISOString().slice(0, 10);
  return Array.from({ length: count }, (_, i) => {
    const due = new Date(policyStartDate);
    due.setMonth(due.getMonth() + i * months);
    return {
      index: i + 1,
      dueDate: due.toISOString().slice(0, 10),
      amount: installmentAmount,
      status: i === 0 ? "PAID" : "DUE",
      paidDate: i === 0 ? today : null,
      reminderSent: false,
    };
  });
}

// Scans a merchant's active policies for installments due within the next 3 days
// (or already overdue) and sends a one-time reminder notification for each —
// simulating what a real insurer's scheduled job would do daily.
export async function checkDueReminders(merchantId) {
  const policies = readStore(KEYS.POLICIES, SEED_POLICIES);
  const today = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 3);

  let changed = false;
  const updatedPolicies = policies.map((policy) => {
    if (policy.merchantId !== merchantId || policy.status !== "ACTIVE" || !policy.installments) return policy;

    const installments = policy.installments.map((inst) => {
      if (inst.status !== "DUE" || inst.reminderSent) return inst;
      const due = new Date(inst.dueDate);
      if (due <= soon) {
        changed = true;
        const isOverdue = due < today;
        addNotification({
          role: "merchant",
          userId: merchantId,
          title: isOverdue ? "Installment Overdue" : "Installment Due Soon",
          message: `Installment ${inst.index} of ${formatINR(inst.amount)} for policy ${policy.policyNumber} ${isOverdue ? "was due on" : "is due on"} ${inst.dueDate}. Please pay to keep your policy active.`,
          type: "payment",
        });
        return { ...inst, reminderSent: true };
      }
      return inst;
    });
    return { ...policy, installments };
  });

  if (changed) writeStore(KEYS.POLICIES, updatedPolicies);
}

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);
}

export async function payInstallment(policyNumber, installmentIndex, method = "UPI") {
  await wait(600);
  const policies = readStore(KEYS.POLICIES, SEED_POLICIES);
  const policy = policies.find((p) => p.policyNumber === policyNumber);
  if (!policy) throw new Error("Policy not found");

  const installment = policy.installments?.find((i) => i.index === installmentIndex);
  if (!installment) throw new Error("Installment not found");
  if (installment.status === "PAID") throw new Error("This installment is already paid");

  const updatedPolicies = policies.map((p) =>
    p.policyNumber === policyNumber
      ? {
          ...p,
          installments: p.installments.map((i) =>
            i.index === installmentIndex ? { ...i, status: "PAID", paidDate: todayISO() } : i
          ),
        }
      : p
  );
  writeStore(KEYS.POLICIES, updatedPolicies);

  const payments = readStore(KEYS.PAYMENTS, SEED_PAYMENTS);
  const payment = {
    id: genId("PAY"),
    applicationId: policy.applicationId,
    policyNumber,
    merchantId: policy.merchantId,
    merchantName: policy.merchantName,
    amount: installment.amount,
    date: todayISO(),
    method,
    status: "SUCCESS",
    type: `Installment ${installmentIndex}`,
  };
  writeStore(KEYS.PAYMENTS, [payment, ...payments]);

  await addNotification({
    role: "merchant",
    userId: policy.merchantId,
    title: "Installment Paid",
    message: `Installment ${installmentIndex} for policy ${policyNumber} paid successfully.`,
    type: "payment",
  });

  return updatedPolicies.find((p) => p.policyNumber === policyNumber);
}

export async function renewPolicy(policyNumber, method = "UPI") {
  await wait(700);
  const policies = readStore(KEYS.POLICIES, SEED_POLICIES);
  const policy = policies.find((p) => p.policyNumber === policyNumber);
  if (!policy) throw new Error("Policy not found");

  const currentEnd = new Date(policy.endDate);
  const today = new Date();
  const renewFrom = currentEnd > today ? currentEnd : today;
  // Renewal is always a fresh 1-year term — premiumFrequency only affects installment amount.
  const newEnd = new Date(renewFrom);
  newEnd.setFullYear(newEnd.getFullYear() + 1);

  const updatedPolicies = policies.map((p) =>
    p.policyNumber === policyNumber
      ? {
          ...p,
          startDate: p.status === "EXPIRED" ? todayISO() : p.startDate,
          endDate: newEnd.toISOString().slice(0, 10),
          status: "ACTIVE",
          installments: buildInstallmentSchedule(renewFrom, p.premiumFrequency || "yearly", p.premium),
        }
      : p
  );
  writeStore(KEYS.POLICIES, updatedPolicies);

  const payments = readStore(KEYS.PAYMENTS, SEED_PAYMENTS);
  const payment = {
    id: genId("PAY"),
    applicationId: policy.applicationId,
    policyNumber,
    merchantId: policy.merchantId,
    merchantName: policy.merchantName,
    amount: policy.premium,
    date: todayISO(),
    method,
    status: "SUCCESS",
    type: "Renewal",
  };
  writeStore(KEYS.PAYMENTS, [payment, ...payments]);

  await addNotification({
    role: "merchant",
    userId: policy.merchantId,
    title: "Policy Renewed",
    message: `Your policy ${policyNumber} has been renewed till ${newEnd.toISOString().slice(0, 10)}.`,
    type: "policy",
  });

  return updatedPolicies.find((p) => p.policyNumber === policyNumber);
}

/* ---------------- POLICIES ---------------- */

export async function getPolicies({ merchantId } = {}) {
  await wait();
  const all = readStore(KEYS.POLICIES, SEED_POLICIES);
  return merchantId ? all.filter((p) => p.merchantId === merchantId) : all;
}

export async function getPolicyByNumber(policyNumber) {
  await wait(200);
  const all = readStore(KEYS.POLICIES, SEED_POLICIES);
  return all.find((p) => p.policyNumber === policyNumber) || null;
}

/* ---------------- CLAIMS ---------------- */

export async function getClaims({ merchantId } = {}) {
  await wait();
  const all = readStore(KEYS.CLAIMS, SEED_CLAIMS);
  return merchantId ? all.filter((c) => c.merchantId === merchantId) : all;
}

export async function createClaim({ policyNumber, merchantId, merchantName, categoryName, claimType, incidentDate, description, claimAmount, documents }) {
  await wait(500);
  const all = readStore(KEYS.CLAIMS, SEED_CLAIMS);
  const claim = {
    id: genId("CLM"),
    policyNumber,
    merchantId,
    merchantName,
    categoryName,
    claimType,
    incidentDate,
    description,
    claimAmount,
    documents,
    status: "SUBMITTED",
    submittedDate: todayISO(),
    timeline: [{ step: "SUBMITTED", date: todayISO() }],
  };
  writeStore(KEYS.CLAIMS, [claim, ...all]);

  await addNotification({
    role: "admin",
    userId: ADMIN_USER.id,
    title: "New Claim",
    message: `Claim ${claim.id} submitted by ${merchantName} for ${policyNumber}.`,
    type: "claim",
  });

  return claim;
}

export async function updateClaimStatus(claimId, status, extra = {}) {
  await wait(400);
  const all = readStore(KEYS.CLAIMS, SEED_CLAIMS);
  const updated = all.map((c) =>
    c.id === claimId
      ? { ...c, status, ...extra, timeline: [...c.timeline, { step: status, date: todayISO() }] }
      : c
  );
  writeStore(KEYS.CLAIMS, updated);
  const claim = updated.find((c) => c.id === claimId);
  if (claim) {
    await addNotification({
      role: "merchant",
      userId: claim.merchantId,
      title: `Claim ${STATUS_LABELS[status] || status}`,
      message: `Your claim ${claim.id} status is now ${STATUS_LABELS[status] || status}.`,
      type: "claim",
    });
  }
  return claim;
}

const STATUS_LABELS = {
  UNDER_REVIEW: "Under Review",
  DOCUMENTS_REQUIRED: "Documents Required",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SETTLED: "Settled",
};

/* ---------------- NOTIFICATIONS ---------------- */

export async function getNotifications({ role, userId }) {
  await wait(150);
  const all = readStore(KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  return all.filter((n) => n.role === role && n.userId === userId).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function addNotification({ role, userId, title, message, type }) {
  const all = readStore(KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  const notif = { id: genId("N"), role, userId, title, message, type, date: todayISO(), read: false };
  writeStore(KEYS.NOTIFICATIONS, [notif, ...all]);
  return notif;
}

export async function markNotificationRead(id) {
  const all = readStore(KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
  writeStore(KEYS.NOTIFICATIONS, updated);
  return updated;
}

export async function markAllNotificationsRead({ role, userId }) {
  const all = readStore(KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  const updated = all.map((n) => (n.role === role && n.userId === userId ? { ...n, read: true } : n));
  writeStore(KEYS.NOTIFICATIONS, updated);
  return updated;
}

/* ---------------- MERCHANTS (admin) ---------------- */

export async function getMerchants() {
  await wait();
  return readMerchants();
}

export async function getMerchantById(id) {
  await wait(150);
  return readMerchants().find((m) => m.id === id) || null;
}
