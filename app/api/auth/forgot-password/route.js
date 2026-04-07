import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";
import { buildPasswordResetEmailHtml } from "@/lib/passwordResetEmail";
import { generatePasswordResetToken, hashPasswordResetToken } from "@/lib/passwordResetToken";

const GENERIC_OK_MESSAGE =
  "If an account exists for that email, we sent password reset instructions.";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";

    if (!email) {
      return NextResponse.json({ ok: true, message: GENERIC_OK_MESSAGE }, { status: 200 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const supabaseAdmin = getSupabaseAdmin();
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, password_hash")
      .eq("email", email)
      .maybeSingle();

    if (!user?.password_hash) {
      return NextResponse.json({ ok: true, message: GENERIC_OK_MESSAGE }, { status: 200 });
    }

    if (!apiKey || !from || !appUrl) {
      console.error("forgot-password: missing RESEND_API_KEY, RESEND_FROM_EMAIL, or NEXT_PUBLIC_APP_URL");
      return NextResponse.json({ ok: true, message: GENERIC_OK_MESSAGE }, { status: 200 });
    }

    const rawToken = generatePasswordResetToken();
    const tokenHash = hashPasswordResetToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const { error: updateErr } = await supabaseAdmin
      .from("users")
      .update({
        password_reset_token_hash: tokenHash,
        password_reset_expires_at: expiresAt,
      })
      .eq("id", user.id);

    if (updateErr) {
      console.error("forgot-password: supabase update", updateErr.message);
      return NextResponse.json({ ok: true, message: GENERIC_OK_MESSAGE }, { status: 200 });
    }

    const base = appUrl.replace(/\/$/, "");
    const resetUrl = `${base}/auth/reset-password?token=${encodeURIComponent(rawToken)}`;
    const html = buildPasswordResetEmailHtml({ resetUrl });

    const resend = new Resend(apiKey);
    const { error: sendErr } = await resend.emails.send({
      from,
      to: email,
      subject: "Reset your Renwize password",
      html,
    });

    if (sendErr) {
      console.error("forgot-password: resend", sendErr.message);
    }

    return NextResponse.json({ ok: true, message: GENERIC_OK_MESSAGE }, { status: 200 });
  } catch (e) {
    console.error("forgot-password:", e);
    return NextResponse.json({ ok: true, message: GENERIC_OK_MESSAGE }, { status: 200 });
  }
}
