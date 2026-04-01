import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";
import { buildReminderEmailHtml } from "@/lib/emailTemplate";
import { formatDate, formatMoney } from "@/lib/subscriptionDisplay";

/**
 * Calendar date in UTC as YYYY-MM-DD, offset from "today" (UTC) by `days`.
 * Matches cron runs at 08:00 UTC so billing dates align with server calendar.
 */
export function getUtcDateStringDaysFromToday(days) {
  const now = new Date();
  const utc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + days),
  );
  const y = utc.getUTCFullYear();
  const m = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const d = String(utc.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Loads subscriptions whose next_billing_date is exactly `targetDate` (YYYY-MM-DD),
 * resolves owner emails from `users`, and sends one Resend email per row.
 *
 * Resend free tier: you can only send to addresses you verify (or use onboarding@resend.dev
 * for testing). Production sending requires a verified domain and `from` on that domain.
 *
 * @returns {Promise<{ sent: number, targetDate: string, failed: Array<{ subscriptionId: string, reason: string }> }>}
 */
export async function sendBillingReminders() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error(
      "Missing RESEND_API_KEY or RESEND_FROM_EMAIL. Set them in the environment.",
    );
  }

  const targetDate = getUtcDateStringDaysFromToday(3);
  const supabase = getSupabaseAdmin();

  const { data: subs, error: subErr } = await supabase
    .from("subscriptions")
    .select("id, name, amount, currency, next_billing_date, user_id, remind_to_cancel")
    .eq("next_billing_date", targetDate);

  if (subErr) {
    throw new Error(subErr.message);
  }

  if (!subs?.length) {
    return { sent: 0, targetDate, failed: [] };
  }

  const userIds = [...new Set(subs.map((s) => s.user_id))];
  const { data: users, error: userErr } = await supabase
    .from("users")
    .select("id, name, email")
    .in("id", userIds);

  if (userErr) {
    throw new Error(userErr.message);
  }

  const userById = Object.fromEntries((users || []).map((u) => [u.id, u]));
  const resend = new Resend(apiKey);
  const failed = [];
  let sent = 0;

  for (const sub of subs) {
    const user = userById[sub.user_id];
    if (!user?.email) {
      failed.push({
        subscriptionId: sub.id,
        reason: "No user email for subscription",
      });
      continue;
    }

    const userName = user.name || user.email.split("@")[0];
    const amountFormatted = formatMoney(sub.amount, sub.currency);
    const renewalDateFormatted = formatDate(sub.next_billing_date);
    const html = buildReminderEmailHtml({
      userName,
      subscriptionName: sub.name,
      amountFormatted,
      renewalDateFormatted,
      remindToCancel: Boolean(sub.remind_to_cancel),
    });

    const subject = `Reminder: ${sub.name} renews in 3 days`;

    const { error: sendErr } = await resend.emails.send({
      from,
      to: user.email,
      subject,
      html,
    });

    if (sendErr) {
      failed.push({
        subscriptionId: sub.id,
        reason: sendErr.message || String(sendErr),
      });
      continue;
    }

    sent += 1;
  }

  return { sent, targetDate, failed };
}

/**
 * Rolls next_billing_date forward by one billing cycle and persists it.
 *
 * @param {{ id: string, next_billing_date: string, billing_cycle: "monthly" | "yearly" }} subscription
 * @returns {Promise<string>} New billing date as YYYY-MM-DD
 */
export async function rolloverBillingDate(subscription) {
  if (!subscription?.id || !subscription?.next_billing_date || !subscription?.billing_cycle) {
    throw new Error("Missing required subscription fields: id, next_billing_date, billing_cycle");
  }

  const baseDate = new Date(`${subscription.next_billing_date}T00:00:00.000Z`);
  if (Number.isNaN(baseDate.getTime())) {
    throw new Error("Invalid subscription.next_billing_date");
  }

  const rolled = new Date(baseDate);
  if (subscription.billing_cycle === "monthly") {
    rolled.setUTCMonth(rolled.getUTCMonth() + 1);
  } else if (subscription.billing_cycle === "yearly") {
    rolled.setUTCFullYear(rolled.getUTCFullYear() + 1);
  } else {
    throw new Error("Invalid billing_cycle. Expected 'monthly' or 'yearly'.");
  }

  const y = rolled.getUTCFullYear();
  const m = String(rolled.getUTCMonth() + 1).padStart(2, "0");
  const d = String(rolled.getUTCDate()).padStart(2, "0");
  const newDate = `${y}-${m}-${d}`;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("subscriptions")
    .update({ next_billing_date: newDate })
    .eq("id", subscription.id);

  if (error) {
    throw new Error(error.message);
  }

  return newDate;
}

/**
 * Sends a reminder now if renewal is within 3 days (today/tomorrow/day-after),
 * then rolls billing date to the next cycle.
 *
 * @param {{ id: string, name?: string, amount?: number, currency?: string, next_billing_date: string, billing_cycle: "monthly" | "yearly" }} subscription
 * @param {string} userEmail
 * @returns {Promise<boolean>} True if reminder was sent, false otherwise
 */
export async function checkAndSendImmediateReminder(subscription, userEmail) {
  if (!subscription?.next_billing_date || !userEmail) {
    return false;
  }

  const today = getUtcDateStringDaysFromToday(0);
  const tomorrow = getUtcDateStringDaysFromToday(1);
  const dayAfter = getUtcDateStringDaysFromToday(2);
  const dueDate = subscription.next_billing_date;

  const shouldSend = dueDate === today || dueDate === tomorrow || dueDate === dayAfter;
  if (!shouldSend) {
    return false;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error(
      "Missing RESEND_API_KEY or RESEND_FROM_EMAIL. Set them in the environment.",
    );
  }

  const resend = new Resend(apiKey);
  const userName = userEmail.split("@")[0];
  const amountFormatted = formatMoney(subscription.amount ?? 0, subscription.currency || "USD");
  const renewalDateFormatted = formatDate(subscription.next_billing_date);
  const html = buildReminderEmailHtml({
    userName,
    subscriptionName: subscription.name || "Subscription",
    amountFormatted,
    renewalDateFormatted,
    remindToCancel: Boolean(subscription.remind_to_cancel),
  });

  const { error: sendErr } = await resend.emails.send({
    from,
    to: userEmail,
    subject: `Reminder: ${subscription.name || "Subscription"} renews in 3 days`,
    html,
  });

  if (sendErr) {
    throw new Error(sendErr.message || String(sendErr));
  }

  await rolloverBillingDate(subscription);
  return true;
}
