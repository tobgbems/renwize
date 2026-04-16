"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { checkAndSendImmediateReminder } from "@/lib/reminders";
import { getSupabaseAdmin } from "@/lib/supabase";

const CURRENCIES = new Set(["USD", "NGN", "GBP", "EUR", "KES"]);
const CATEGORIES = new Set(["streaming", "saas", "fitness", "finance", "utilities", "other"]);

function getTodayIsoDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Updates an existing subscription row (must belong to the signed-in user).
 */
export async function updateSubscription(formData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "You must be signed in to edit a subscription." };
  }

  const subscriptionId = formData.get("id")?.toString().trim() ?? "";
  if (!subscriptionId) {
    return { error: "Missing subscription." };
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const amountRaw = formData.get("amount");
  const currency = (formData.get("currency")?.toString() ?? "USD").toUpperCase();
  const billing_cycle = formData.get("billing_cycle")?.toString() ?? "";
  const next_billing_date = formData.get("next_billing_date")?.toString() ?? "";
  const category = (formData.get("category")?.toString() ?? "other").toLowerCase();
  const notesRaw = formData.get("notes")?.toString().trim();
  const remind_to_cancel = formData.get("remind_to_cancel") === "on";
  const cardIdRaw = formData.get("card_id")?.toString().trim() ?? "";
  const card_id = cardIdRaw || null;

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
  if (next_billing_date < getTodayIsoDate()) {
    return { error: "Next billing date cannot be in the past." };
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

  const { data: existing, error: findErr } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("id", subscriptionId)
    .eq("user_id", userRow.id)
    .maybeSingle();

  if (findErr || !existing) {
    return { error: "Subscription not found or you do not have access." };
  }

  if (card_id) {
    const { data: ownedCard, error: cardErr } = await supabase
      .from("cards")
      .select("id")
      .eq("id", card_id)
      .eq("user_id", userRow.id)
      .maybeSingle();

    if (cardErr || !ownedCard) {
      return { error: "Selected payment card is invalid." };
    }
  }

  const { data: updatedSub, error: updateErr } = await supabase
    .from("subscriptions")
    .update({
      name,
      amount,
      currency,
      billing_cycle,
      next_billing_date,
      category,
      notes: notesRaw || null,
      remind_to_cancel,
      card_id,
    })
    .eq("id", subscriptionId)
    .eq("user_id", userRow.id)
    .select("id, name, amount, currency, next_billing_date, billing_cycle, remind_to_cancel")
    .single();

  if (updateErr || !updatedSub) {
    return { error: updateErr.message };
  }

  try {
    const { data: userEmailRow } = await supabase
      .from("users")
      .select("email")
      .eq("id", userRow.id)
      .single();

    if (userEmailRow?.email) {
      await checkAndSendImmediateReminder(updatedSub, userEmailRow.email);
    }
  } catch (err) {
    console.error("[updateSubscription] immediate reminder failed:", err);
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function pauseSubscription(subscriptionId, userEmail) {
  const normalizedSubscriptionId = subscriptionId?.toString().trim() ?? "";
  const normalizedUserEmail = userEmail?.toString().trim().toLowerCase() ?? "";

  if (!normalizedSubscriptionId || !normalizedUserEmail) {
    return { error: "Missing subscription or user email." };
  }

  const supabase = getSupabaseAdmin();
  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("id")
    .eq("email", normalizedUserEmail)
    .single();

  if (userErr || !userRow) {
    return { error: "Could not find your account." };
  }

  const { error: updateErr } = await supabase
    .from("subscriptions")
    .update({ status: "paused" })
    .eq("id", normalizedSubscriptionId)
    .eq("user_id", userRow.id);

  if (updateErr) {
    return { error: updateErr.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function resumeSubscription(subscriptionId, userEmail) {
  const normalizedSubscriptionId = subscriptionId?.toString().trim() ?? "";
  const normalizedUserEmail = userEmail?.toString().trim().toLowerCase() ?? "";

  if (!normalizedSubscriptionId || !normalizedUserEmail) {
    return { error: "Missing subscription or user email." };
  }

  const supabase = getSupabaseAdmin();
  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("id")
    .eq("email", normalizedUserEmail)
    .single();

  if (userErr || !userRow) {
    return { error: "Could not find your account." };
  }

  const { error: updateErr } = await supabase
    .from("subscriptions")
    .update({ status: "active" })
    .eq("id", normalizedSubscriptionId)
    .eq("user_id", userRow.id);

  if (updateErr) {
    return { error: updateErr.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
