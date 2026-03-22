import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * DELETE — remove one subscription if it belongs to the signed-in user.
 */
export async function DELETE(_request, context) {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (userErr || !userRow) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: existing, error: findErr } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("id", id)
    .eq("user_id", userRow.id)
    .maybeSingle();

  if (findErr || !existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error: delErr } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", id)
    .eq("user_id", userRow.id);

  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
