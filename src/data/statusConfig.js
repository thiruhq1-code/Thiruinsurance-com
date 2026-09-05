// Centralized status configuration — single source of truth for all status badges/colors

export const APPLICATION_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PAYMENT_PENDING: "PAYMENT_PENDING",
  PAID: "PAID",
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
};

export const CLAIM_STATUS = {
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  DOCUMENTS_REQUIRED: "DOCUMENTS_REQUIRED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SETTLED: "SETTLED",
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

export const POLICY_STATUS = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  SUSPENDED: "SUSPENDED",
};

// tone: used by <StatusBadge /> to pick color classes
export const STATUS_META = {
  DRAFT: { label: "Draft", tone: "neutral" },
  SUBMITTED: { label: "Submitted", tone: "info" },
  PENDING_APPROVAL: { label: "Pending Approval", tone: "warning" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
  PAYMENT_PENDING: { label: "Payment Pending", tone: "warning" },
  PAID: { label: "Paid", tone: "info" },
  ACTIVE: { label: "Active", tone: "success" },
  EXPIRED: { label: "Expired", tone: "neutral" },
  CANCELLED: { label: "Cancelled", tone: "danger" },
  SUSPENDED: { label: "Suspended", tone: "warning" },

  // claim statuses
  UNDER_REVIEW: { label: "Under Review", tone: "info" },
  DOCUMENTS_REQUIRED: { label: "Documents Required", tone: "warning" },
  SETTLED: { label: "Settled", tone: "success" },

  // payment statuses
  PENDING: { label: "Pending", tone: "warning" },
  SUCCESS: { label: "Success", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
};

export const APPLICATION_TIMELINE_STEPS = [
  "SUBMITTED",
  "PENDING_APPROVAL",
  "APPROVED",
  "PAYMENT_PENDING",
  "PAID",
  "ACTIVE",
];
