"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/subscriptionDisplay";
import { cancelProPlan, reactivateProPlan } from "@/lib/actions/manageProPlan";

/** Pro expiry is a timestamp; format as calendar date for `formatDate` (YYYY-MM-DD local). */
function accessUntilLabel(proExpiresAt) {
  if (!proExpiresAt) return "—";
  const d = new Date(proExpiresAt);
  if (Number.isNaN(d.getTime())) return "—";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return formatDate(`${y}-${m}-${day}`);
}

/**
 * @param {{ user: { is_pro?: boolean, pro_expires_at?: string | null, plan_type?: string | null, cancel_at_period_end?: boolean, email?: string | null } | null }} props
 */
export default function ManagePlanSection({ user }) {
  if (!user?.is_pro) return null;

  const router = useRouter();
  const [actionError, setActionError] = useState(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const email = user.email?.toString().trim() ?? "";
  const { pro_expires_at, plan_type, cancel_at_period_end } = user;
  const cancelScheduled = Boolean(cancel_at_period_end);
  const planBadgeLabel =
    plan_type === "yearly" ? "Pro Yearly" : plan_type === "monthly" ? "Pro Monthly" : "Pro";
  const until = accessUntilLabel(pro_expires_at);

  function handleCancelConfirmed() {
    if (!email) return;
    setActionError(null);
    startTransition(async () => {
      const res = await cancelProPlan(email);
      if (res?.error) {
        setActionError(res.error);
        return;
      }
      setCancelConfirmOpen(false);
      router.refresh();
    });
  }

  function handleReactivate() {
    if (!email) return;
    setActionError(null);
    startTransition(async () => {
      const res = await reactivateProPlan(email);
      if (res?.error) {
        setActionError(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <section className="mt-10 border-t border-[#F1F5F9] pt-8" aria-labelledby="manage-plan-heading">
      <h2 id="manage-plan-heading" className="text-lg font-bold text-[#1E254A]">
        Your Plan
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex rounded-full bg-[#1FA168]/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0F5C3A] ring-1 ring-[#1FA168]/25">
          {planBadgeLabel}
        </span>
        <p className="text-sm text-[#64748B]">
          Access until <span className="font-semibold text-[#1E254A]">{until}</span>
        </p>
      </div>

      {actionError ? (
        <p className="mt-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#E8203B]" role="alert">
          {actionError}
        </p>
      ) : null}

      {cancelScheduled ? (
        <div className="mt-6 space-y-4">
          <p className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]">
            Your plan is set to expire on <span className="font-semibold text-[#1E254A]">{until}</span>. You
            won&apos;t be charged again.
          </p>
          <button
            type="button"
            onClick={handleReactivate}
            disabled={isPending || !email}
            className="inline-flex items-center justify-center rounded-lg bg-[#1FA168] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Working…" : "Reactivate plan"}
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {cancelConfirmOpen ? (
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 text-sm text-[#1E254A]">
              <p className="font-medium">
                Are you sure? You&apos;ll keep Pro access until {until}.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCancelConfirmOpen(false)}
                  disabled={isPending}
                  className="inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#1E254A] transition hover:bg-[#F8FAFC] disabled:opacity-60"
                >
                  Keep plan
                </button>
                <button
                  type="button"
                  onClick={handleCancelConfirmed}
                  disabled={isPending}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Working…" : "Confirm cancel"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={() => setCancelConfirmOpen(true)}
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel plan
              </button>
              {plan_type === "monthly" ? (
                <Link
                  href="/api/payments/initiate?billing=yearly"
                  className="inline-flex items-center justify-center rounded-lg bg-[#1FA168] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Upgrade to yearly and save
                </Link>
              ) : null}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
