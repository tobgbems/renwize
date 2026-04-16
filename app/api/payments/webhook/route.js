import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  isValidProChargeAmountKobo,
  proExpiresAtIsoFromAmountKobo,
  proPlanTypeFromPaystackTransaction,
} from "@/lib/proPricing";

export const runtime = "nodejs";

/**
 * POST — Paystack webhook endpoint.
 * Verifies x-paystack-signature, processes charge.success, and activates Pro.
 */
export async function POST(request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Missing PAYSTACK_SECRET_KEY." }, { status: 500 });
  }

  const signature = request.headers.get("x-paystack-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing webhook signature." }, { status: 401 });
  }

  const rawBody = await request.text();
  const expectedSignature = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (payload?.event !== "charge.success") {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  }

  const tx = payload?.data;
  const paidPro =
    tx?.status === "success" &&
    tx?.currency === "NGN" &&
    isValidProChargeAmountKobo(tx?.amount);

  if (!paidPro) {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  }

  const email = tx?.customer?.email?.toLowerCase();
  if (!email) {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  }

  const proExpiresAt = proExpiresAtIsoFromAmountKobo(tx.amount);
  const planType = proPlanTypeFromPaystackTransaction(tx);
  const supabase = getSupabaseAdmin();
  const { error: updateErr } = await supabase
    .from("users")
    .update({
      is_pro: true,
      pro_expires_at: proExpiresAt,
      plan_type: planType,
      cancel_at_period_end: false,
    })
    .eq("email", email);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
