import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await request.json();
    const name = body?.name?.trim();
    const email = body?.email?.toLowerCase().trim();
    const password = body?.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 },
      );
    }

    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { error } = await supabaseAdmin.from("users").insert({
      name,
      email,
      password_hash: passwordHash,
    });

    if (error) {
      return NextResponse.json(
        { error: "Unable to create account right now. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected server error during sign up." },
      { status: 500 },
    );
  }
}
