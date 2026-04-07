import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { hashPasswordResetToken } from "@/lib/passwordResetToken";

export async function POST(request) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!token || !password) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired. Request a new one from the sign-in page." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 },
      );
    }

    const tokenHash = hashPasswordResetToken(token);
    const supabaseAdmin = getSupabaseAdmin();

    const { data: user, error: fetchErr } = await supabaseAdmin
      .from("users")
      .select("id, password_reset_expires_at")
      .eq("password_reset_token_hash", tokenHash)
      .maybeSingle();

    if (fetchErr || !user?.password_reset_expires_at) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired. Request a new one from the sign-in page." },
        { status: 400 },
      );
    }

    const expires = new Date(user.password_reset_expires_at);
    if (Number.isNaN(expires.getTime()) || expires.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired. Request a new one from the sign-in page." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { error: updateErr } = await supabaseAdmin
      .from("users")
      .update({
        password_hash: passwordHash,
        password_reset_token_hash: null,
        password_reset_expires_at: null,
      })
      .eq("id", user.id);

    if (updateErr) {
      return NextResponse.json(
        { error: "Could not update your password. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("reset-password:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
