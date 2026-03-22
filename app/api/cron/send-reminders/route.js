import { NextResponse } from "next/server";
import { sendBillingReminders } from "@/lib/reminders";

export const runtime = "nodejs";

/**
 * GET — invoked by Vercel Cron daily. Requires Authorization: Bearer CRON_SECRET.
 * Vercel injects this header when CRON_SECRET is set on the project.
 */
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfigured: CRON_SECRET is not set." },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sent, targetDate, failed } = await sendBillingReminders();
    return NextResponse.json({
      ok: true,
      sent,
      targetDate,
      failedCount: failed.length,
      ...(failed.length ? { failed } : {}),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
