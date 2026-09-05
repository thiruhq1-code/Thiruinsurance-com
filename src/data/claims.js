export const SEED_CLAIMS = [
  {
    id: "CLM-20260620",
    policyNumber: "THIRU-HLT-88213",
    merchantId: "MER-1001",
    merchantName: "Karthik Raja",
    categoryName: "Health Insurance",
    claimType: "Hospitalization",
    incidentDate: "2026-06-15",
    description: "Admitted for 3 days due to viral fever with dehydration at City General Hospital.",
    claimAmount: 45000,
    status: "UNDER_REVIEW",
    submittedDate: "2026-06-20",
    documents: ["Hospital Bill", "Discharge Summary"],
    timeline: [
      { step: "SUBMITTED", date: "2026-06-20" },
      { step: "UNDER_REVIEW", date: "2026-06-21" },
    ],
  },
];
