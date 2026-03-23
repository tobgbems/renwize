import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const PRO_PRICE_NGN_KOBO = 200000; // NGN 2,000.00

export const runtime = "nodejs";

/**
 * GET — Paystack callback verification, then activate Pro for 30 days.
 */
export async function GET(request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!secretKey || !appUrl) {
    return NextResponse.json(
      { error: "Missing PAYSTACK_SECRET_KEY or NEXT_PUBLIC_APP_URL." },
      { status: 500 },
    );
  }

  const reference = request.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
  }

  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secretKey}` },
      cache: "no-store",
    },
  );
  const payload = await verifyRes.json();

  const tx = payload?.data;
  const paid =
    verifyRes.ok &&
    payload?.status === true &&
    tx?.status === "success" &&
    tx?.currency === "NGN" &&
    Number(tx?.amount) === PRO_PRICE_NGN_KOBO;

  if (!paid) {
    return NextResponse.redirect(new URL("/pricing?payment=failed", appUrl));
  }

  const customerEmail = tx?.customer?.email?.toLowerCase();
  if (!customerEmail) {
    return NextResponse.redirect(new URL("/pricing?payment=failed", appUrl));
  }

  const proExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const supabase = getSupabaseAdmin();
  const { error: updateErr } = await supabase
    .from("users")
    .update({
      is_pro: true,
      pro_expires_at: proExpiresAt,
    })
    .eq("email", customerEmail);

  if (updateErr) {
    return NextResponse.redirect(new URL("/pricing?payment=failed", appUrl));
  }

  return NextResponse.redirect(new URL("/dashboard?upgraded=true", appUrl));
}
