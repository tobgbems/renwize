"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const CURRENCIES = new Set(["USD", "NGN", "GBP", "EUR", "KES"]);
const CATEGORIES = new Set(["streaming", "saas", "fitness", "finance", "utilities", "other"]);

/**
 * Inserts a subscription row for the signed-in user, then redirects to the dashboard.
 * Kept outside `app/` so Turbopack HMR does not churn the route module graph as aggressively.
 */
export async function createSubscription(formData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "You must be signed in to add a subscription." };
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const amountRaw = formData.get("amount");
  const currency = (formData.get("currency")?.toString() ?? "USD").toUpperCase();
  const billing_cycle = formData.get("billing_cycle")?.toString() ?? "";
  const next_billing_date = formData.get("next_billing_date")?.toString() ?? "";
  const category = (formData.get("category")?.toString() ?? "other").toLowerCase();
  const notesRaw = formData.get("notes")?.toString().trim();

  if (!name) {
    return { error: "Please enter a subscription name." };
  }

  const amount = Number(amountRaw);
  if (Number.isNaN(amount) || amount <= 0) {
    return { error: "Please enter a valid amount greater than zero." };
  }

  if (!CURRENCIES.has(currency)) {
    return { error: "Please choose a supported currency." };
  }

  if (billing_cycle !== "monthly" && billing_cycle !== "yearly") {
    return { error: "Please choose a billing cycle." };
  }

  if (!next_billing_date || !/^\d{4}-\d{2}-\d{2}$/.test(next_billing_date)) {
    return { error: "Please choose a valid next billing date." };
  }

  if (!CATEGORIES.has(category)) {
    return { error: "Please choose a category." };
  }

  const supabase = getSupabaseAdmin();
  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email.toLowerCase())
    .single();

  if (userErr || !userRow) {
    return { error: "Could not find your account." };
  }

  const { error: insertErr } = await supabase.from("subscriptions").insert({
    user_id: userRow.id,
    name,
    amount,
    currency,
    billing_cycle,
    next_billing_date,
    category,
    notes: notesRaw || null,
  });

  if (insertErr) {
    return { error: insertErr.message };
  }

  redirect("/dashboard");
}
