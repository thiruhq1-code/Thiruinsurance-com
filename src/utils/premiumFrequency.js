// Payment frequency options — converts an annual premium into monthly/quarterly/
// half-yearly amounts. Shorter frequencies carry a small loading (processing cost),
// annual carries none (best value) — same logic real insurers use.

export const FREQUENCIES = [
  { value: "monthly", label: "1 Month", months: 1, loading: 0.15 },
  { value: "quarterly", label: "3 Month", months: 3, loading: 0.08 },
  { value: "half-yearly", label: "6 Month", months: 6, loading: 0.04 },
  { value: "yearly", label: "1 Year", months: 12, loading: 0 },
];

export function getFrequency(value) {
  return FREQUENCIES.find((f) => f.value === value) || FREQUENCIES[FREQUENCIES.length - 1];
}

export function calcFrequencyAmount(annualPremium, frequencyValue) {
  const freq = getFrequency(frequencyValue);
  const raw = (annualPremium / 12) * freq.months * (1 + freq.loading);
  return Math.round(raw / 10) * 10; // round to nearest ₹10 for a clean number
}
