"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const ALLOWED_NETWORKS = new Set(["visa", "mastercard", "verve", "amex", "other"]);

async function getCurrentUserRow() {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "You must be signed in to manage cards." };
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

  return { supabase, userRow };
}

export async function createCard(formData) {
  const userResult = await getCurrentUserRow();
  if (userResult.error) {
    return { error: userResult.error };
  }

  const { supabase, userRow } = userResult;
  const label = formData.get("label")?.toString().trim() ?? "";
  const network = (formData.get("network")?.toString() ?? "").toLowerCase();
  const lastFourRaw = formData.get("last_four")?.toString().trim() ?? "";
  const digitsOnly = lastFourRaw.replace(/\D/g, "");

  if (!label) {
    return { error: "Please enter a card label." };
  }
  if (label.length > 80) {
    return { error: "Card label cannot exceed 80 characters." };
  }
  if (!ALLOWED_NETWORKS.has(network)) {
    return { error: "Please choose a valid card network." };
  }
  if (!/^\d{1,4}$/.test(digitsOnly)) {
    return { error: "Last 4 digits must be 1 to 4 numbers." };
  }
  const lastFour = digitsOnly.padStart(4, "0");

  const { data: createdCard, error: createErr } = await supabase
    .from("cards")
    .insert({
      user_id: userRow.id,
      label,
      network,
      last_four: lastFour,
    })
    .select("id, label, network, last_four, created_at")
    .single();

  if (createErr || !createdCard) {
    return { error: createErr?.message || "Could not save card." };
  }

  revalidatePath("/dashboard");
  return { success: true, card: createdCard };
}

export async function deleteCard(id) {
  const cardId = id?.toString().trim() ?? "";
  if (!cardId) {
    return { error: "Missing card id." };
  }

  const userResult = await getCurrentUserRow();
  if (userResult.error) {
    return { error: userResult.error };
  }

  const { supabase, userRow } = userResult;
  const { data: existingCard, error: findErr } = await supabase
    .from("cards")
    .select("id")
    .eq("id", cardId)
    .eq("user_id", userRow.id)
    .maybeSingle();

  if (findErr || !existingCard) {
    return { error: "Card not found or you do not have access." };
  }

  const { error: deleteErr } = await supabase
    .from("cards")
    .delete()
    .eq("id", cardId)
    .eq("user_id", userRow.id);

  if (deleteErr) {
    return { error: deleteErr.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
