// pricing.js
// Mock data — replace LINE_ITEMS with your real pricing sheet later.

const LINE_ITEMS = [
  // Collision Repair — Front Bumper
  { category: "Collision Repair", job: "front bumper", severity: "low",    low: 450,  high: 900  },
  { category: "Collision Repair", job: "front bumper", severity: "medium", low: 900,  high: 1800 },
  { category: "Collision Repair", job: "front bumper", severity: "high",   low: 1800, high: 3500 },

  // Collision Repair — Rear Bumper
  { category: "Collision Repair", job: "rear bumper",  severity: "low",    low: 400,  high: 850  },
  { category: "Collision Repair", job: "rear bumper",  severity: "medium", low: 850,  high: 1700 },
  { category: "Collision Repair", job: "rear bumper",  severity: "high",   low: 1700, high: 3200 },

  // Collision Repair — Hood
  { category: "Collision Repair", job: "hood",         severity: "low",    low: 500,  high: 1000 },
  { category: "Collision Repair", job: "hood",         severity: "medium", low: 1000, high: 2000 },
  { category: "Collision Repair", job: "hood",         severity: "high",   low: 2000, high: 4000 },

  // Collision Repair — Fender
  { category: "Collision Repair", job: "fender",       severity: "low",    low: 400,  high: 800  },
  { category: "Collision Repair", job: "fender",       severity: "medium", low: 800,  high: 1600 },
  { category: "Collision Repair", job: "fender",       severity: "high",   low: 1600, high: 3000 },

  // Paint & Dent — Door
  { category: "Paint & Dent Services", job: "door dent",   severity: "low",    low: 200, high: 500  },
  { category: "Paint & Dent Services", job: "door dent",   severity: "medium", low: 500, high: 900  },
  { category: "Paint & Dent Services", job: "door dent",   severity: "high",   low: 900, high: 1800 },

  // Paint & Dent — Scratch
  { category: "Paint & Dent Services", job: "scratch",     severity: "low",    low: 150, high: 400  },
  { category: "Paint & Dent Services", job: "scratch",     severity: "medium", low: 400, high: 800  },
  { category: "Paint & Dent Services", job: "scratch",     severity: "high",   low: 800, high: 1500 },

  // Paint & Dent — Panel
  { category: "Paint & Dent Services", job: "panel",       severity: "low",    low: 300, high: 600  },
  { category: "Paint & Dent Services", job: "panel",       severity: "medium", low: 600, high: 1200 },
  { category: "Paint & Dent Services", job: "panel",       severity: "high",   low: 1200, high: 2400 },
];

const MODIFIERS = [
  { name: "Airbags deployed",      key: "airbags_deployed", when: true,  add: 1200 },
  { name: "Vehicle not drivable",  key: "drivable",         when: false, add: 300  },
];

// Vehicle type multipliers
const VEHICLE_MULTIPLIERS = {
  suv:   1.15,
  truck: 1.25,
  van:   1.2,
  sedan: 1.0,
};

export function calculateEstimate(structured) {
  const category = structured.service_category;
  const severity = structured.severity || "medium";
  const job = (structured.damage_area?.[0] || "front bumper").toLowerCase();
  const vehicleType = (structured.vehicle_type || "sedan").toLowerCase();

  const base = LINE_ITEMS.find(
    (x) => x.category === category && x.job === job && x.severity === severity
  );

  let low  = base?.low  ?? 500;
  let high = base?.high ?? 1500;

  // Apply vehicle multiplier
  const multiplier = VEHICLE_MULTIPLIERS[vehicleType] ?? 1.0;
  low  = Math.round(low  * multiplier);
  high = Math.round(high * multiplier);

  const applied_modifiers = [];

  for (const mod of MODIFIERS) {
    if (structured[mod.key] === mod.when) {
      low  += mod.add;
      high += mod.add;
      applied_modifiers.push(mod.name);
    }
  }

  // Out-of-pocket with deductible
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
      "Final pricing may change after inspection and hidden damage review.",
    ],
  };
}
