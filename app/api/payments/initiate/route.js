import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const PRO_PRICE_NGN_KOBO = 200000; // NGN 2,000.00

export const runtime = "nodejs";

/**
 * GET — initializes a one-time Paystack checkout and redirects user to hosted page.
 */
export async function GET() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    return NextResponse.redirect(new URL("/auth", process.env.NEXT_PUBLIC_APP_URL));
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!secretKey || !appUrl) {
    return NextResponse.json(
      { error: "Missing PAYSTACK_SECRET_KEY or NEXT_PUBLIC_APP_URL." },
      { status: 500 },
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("email", email)
    .single();

  if (userErr || !userRow) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const callbackUrl = `${appUrl}/api/payments/verify`;
  const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: userRow.email,
      amount: PRO_PRICE_NGN_KOBO,
      currency: "NGN",
      callback_url: callbackUrl,
      metadata: {
        renwize_user_id: userRow.id,
        plan: "pro_monthly_one_time",
      },
    }),
    cache: "no-store",
  });

  const payload = await initRes.json();
  if (!initRes.ok || !payload?.status || !payload?.data?.authorization_url) {
    return NextResponse.json(
      { error: payload?.message || "Could not initiate payment." },
      { status: 500 },
    );
  }

  return NextResponse.redirect(payload.data.authorization_url);
}
