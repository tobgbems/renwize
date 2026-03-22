/**
 * Shared display helpers for subscription amounts and labels (used on dashboard and forms later).
 */

export function formatMoney(amount, currency) {
  const n = Number(amount);
  const code = (currency || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
    }).format(n);
  } catch {
    return `${code} ${n.toFixed(2)}`;
  }
}

const CATEGORY_LABELS = {
  streaming: "Streaming",
  saas: "SaaS",
  fitness: "Fitness",
  finance: "Finance",
  utilities: "Utilities",
  other: "Other",
};

/** Human-readable category from DB value (matches add-form values). */
export function formatCategoryLabel(value) {
  if (!value) return "Other";
  const k = String(value).toLowerCase().trim();
  if (CATEGORY_LABELS[k]) return CATEGORY_LABELS[k];
  return k.charAt(0).toUpperCase() + k.slice(1);
}

export function billingCycleLabel(cycle) {
  if (cycle === "yearly") return "Yearly";
  if (cycle === "monthly") return "Monthly";
  return cycle;
}

/**
 * Calendar date string YYYY-MM-DD → formatted for display in local locale.
 */
export function formatDate(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Whole days from today to the given calendar date (can be negative if date is in the past).
 */
export function daysFromToday(isoDate) {
  const target = new Date(`${isoDate}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Sum amounts per currency for subscriptions matching billingCycle.
 */
export function sumByCurrency(subscriptions, billingCycle) {
  const map = {};
  for (const s of subscriptions) {
    if (s.billing_cycle !== billingCycle) continue;
    const c = (s.currency || "USD").toUpperCase();
    map[c] = (map[c] || 0) + Number(s.amount);
  }
  return map;
}

/** One line per currency, or a single amount when only one currency. */
export function formatTotalsByCurrency(map) {
  const codes = Object.keys(map);
  if (codes.length === 0) return formatMoney(0, "USD");
  if (codes.length === 1) return formatMoney(map[codes[0]], codes[0]);
  return codes
    .sort()
    .map((c) => formatMoney(map[c], c))
    .join(" · ");
}
