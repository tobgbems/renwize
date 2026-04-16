/** Paystack amounts are in kobo (1 NGN = 100 kobo). */

export const PRO_MONTHLY_NGN_KOBO = 200000; // ₦2,000
export const PRO_YEARLY_NGN_KOBO = 2000000; // ₦20,000

/**
 * @param {string | null} billing — "yearly" or anything else → monthly
 */
export function proAmountKoboForBilling(billing) {
  return billing === "yearly" ? PRO_YEARLY_NGN_KOBO : PRO_MONTHLY_NGN_KOBO;
}

export function isValidProChargeAmountKobo(amount) {
  const n = Number(amount);
  return n === PRO_MONTHLY_NGN_KOBO || n === PRO_YEARLY_NGN_KOBO;
}

/** Pro access length after a successful charge (matches product copy on /pricing). */
export function proExpiresAtIsoFromAmountKobo(amount) {
  const n = Number(amount);
  const days = n === PRO_YEARLY_NGN_KOBO ? 365 : 30;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Paystack verify/webhook `data.amount` is in kobo. Initiate also sends `metadata.billing`.
 *
 * @param {{ amount?: number, metadata?: { billing?: string } }} tx
 * @returns {"monthly" | "yearly"}
 */
export function proPlanTypeFromPaystackTransaction(tx) {
  const billing = tx?.metadata?.billing;
  if (billing === "yearly") return "yearly";
  if (billing === "monthly") return "monthly";
  const n = Number(tx?.amount);
  if (n === PRO_YEARLY_NGN_KOBO) return "yearly";
  return "monthly";
}
