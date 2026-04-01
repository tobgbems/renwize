"use server";

import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const PHONE_ALLOWED_CHARS = /^[+()\-\s0-9]*$/;

export async function updateProfileSettings(formData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "You must be signed in to update your profile." };
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const phoneRaw = formData.get("phone_number")?.toString().trim() ?? "";
  const phone_number = phoneRaw || null;

  if (!name) {
    return { error: "Please enter your name." };
  }

  if (name.length > 80) {
    return { error: "Name is too long. Keep it under 80 characters." };
  }

  if (phone_number) {
    if (!PHONE_ALLOWED_CHARS.test(phone_number)) {
      return { error: "Phone number can only contain digits, spaces, +, (), and -." };
    }
    if (phone_number.replace(/\D/g, "").length < 7) {
      return { error: "Please enter a valid phone number." };
    }
    if (phone_number.length > 25) {
      return { error: "Phone number is too long." };
    }
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

  const { error: updateErr } = await supabase
    .from("users")
    .update({
      name,
      phone_number,
    })
    .eq("id", userRow.id);

  if (updateErr) {
    return { error: updateErr.message };
  }

  return { success: "Profile updated." };
}
