"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

function normalizeEmail(email) {
  return email?.toString().trim().toLowerCase() ?? "";
}

export async function cancelProPlan(userEmail) {
  const session = await auth();
  const sessionEmail = session?.user?.email ? session.user.email.toLowerCase() : "";
  const target = normalizeEmail(userEmail);

  if (!sessionEmail || !target || sessionEmail !== target) {
    return { error: "You must be signed in to manage your plan." };
  }

  const supabase = getSupabaseAdmin();
  const { error: updateErr } = await supabase
    .from("users")
    .update({ cancel_at_period_end: true })
    .eq("email", target);

  if (updateErr) {
    return { error: updateErr.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function reactivateProPlan(userEmail) {
  const session = await auth();
  const sessionEmail = session?.user?.email ? session.user.email.toLowerCase() : "";
  const target = normalizeEmail(userEmail);

  if (!sessionEmail || !target || sessionEmail !== target) {
    return { error: "You must be signed in to manage your plan." };
  }

  const supabase = getSupabaseAdmin();
  const { error: updateErr } = await supabase
    .from("users")
    .update({ cancel_at_period_end: false })
    .eq("email", target);

  if (updateErr) {
    return { error: updateErr.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
