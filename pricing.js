// pricing.js
// Mock data for now — later you'll replace this with Excel → JSON.

const LINE_ITEMS = [
  { category: "Collision Repair", job: "front bumper", severity: "low", low: 450, high: 900 },
  { category: "Collision Repair", job: "front bumper", severity: "medium", low: 900, high: 1800 },
  { category: "Collision Repair", job: "front bumper", severity: "high", low: 1800, high: 3500 },

  { category: "Paint & Dent Services", job: "door dent", severity: "low", low: 200, high: 500 },
  { category: "Paint & Dent Services", job: "door dent", severity: "medium", low: 500, high: 900 },
];

const MODIFIERS = [
  { name: "Airbags deployed", key: "airbags_deployed", when: true, add: 1200 },
  { name: "Vehicle not drivable", key: "drivable", when: false, add: 300 },
];

export function calculateEstimate(structured) {
  const category = structured.service_category;
  const severity = structured.severity || "medium";

  // We'll use the first damage area as the "job" for now.
  const job = (structured.damage_area?.[0] || "front bumper").toLowerCase();

  const base = LINE_ITEMS.find(
    (x) =>
      x.category === category &&
      x.job === job &&
      x.severity === severity
  );

  let low = base?.low ?? 500;
  let high = base?.high ?? 1500;

  const applied_modifiers = [];

  for (const mod of MODIFIERS) {
    if (structured[mod.key] === mod.when) {
      low += mod.add;
      high += mod.add;
      applied_modifiers.push(mod.name);
    }
  }

  // Deductible / out-of-pocket (optional)
  let out_of_pocket = null;
  const deductible = structured.insurance?.deductible;
  if (deductible !== undefined && deductible !== null && deductible !== "") {
    const d = Number(deductible);
    if (!Number.isNaN(d)) out_of_pocket = Math.min(d, high);
  }

  return {
    low,
    high,
    out_of_pocket,
    applied_modifiers,
    assumptions: [
      "Estimate is based on the details you provided.",
      "Final pricing may change after inspection and hidden damage review."
    ],
  };
}
