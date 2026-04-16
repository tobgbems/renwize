"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteSubscriptionButton from "@/components/DeleteSubscriptionButton";
import { pauseSubscription, resumeSubscription } from "@/lib/actions/updateSubscription";
import { formatMoney, billingCycleLabel, formatDate, formatCategoryLabel } from "@/lib/subscriptionDisplay";

function renderCardInfo(card) {
  if (!card) return "No card linked";
  const lastFour = card.last_four ? `\u2022\u2022\u2022\u2022${card.last_four}` : "\u2022\u2022\u2022\u2022";
  const bits = [card.label, card.network, lastFour].filter(Boolean);
  return bits.join(" \u00b7 ");
}

export default function SubscriptionDetailModal({
  subscription,
  closeHref,
  section = "subscriptions",
  userEmail = "",
}) {
  const router = useRouter();
  const [actionError, setActionError] = useState(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") router.push(closeHref, { scroll: false });
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeHref, router]);

  if (!subscription) return null;

  const editHref = `/dashboard?section=${section}&modal=edit&id=${subscription.id}`;
  const isPaused = subscription.status === "paused";

  function handleTogglePause() {
    setActionError(null);
    startTransition(async () => {
      const result = isPaused
        ? await resumeSubscription(subscription.id, userEmail)
        : await pauseSubscription(subscription.id, userEmail);

      if (result?.error) {
        setActionError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/45"
      onClick={() => router.push(closeHref, { scroll: false })}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${subscription.name} details`}
        className="fixed bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl border border-[#E2E8F0] bg-[#F8FAFC] shadow-2xl md:bottom-0 md:left-auto md:right-0 md:top-0 md:max-h-none md:w-full md:max-w-2xl md:rounded-none md:rounded-l-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-[#1E254A] px-5 py-4 text-white md:px-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/80">Subscription details</p>
            <h2 className="mt-1 text-xl font-bold">{subscription.name}</h2>
          </div>
          <button
            type="button"
            onClick={() => router.push(closeHref, { scroll: false })}
            className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            X
          </button>
        </div>

        <div className="space-y-5 px-5 py-5 md:px-6 md:py-6">
          {actionError ? (
            <div
              className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#E8203B]"
              role="alert"
            >
              {actionError}
            </div>
          ) : null}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Amount</p>
            <p className="mt-1 text-3xl font-bold text-[#1E254A]">
              {formatMoney(subscription.amount, subscription.currency)}
            </p>
          </div>

          <dl className="space-y-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#64748B]">Billing cycle</dt>
              <dd className="text-right font-semibold text-[#1E254A]">
                {billingCycleLabel(subscription.billing_cycle)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#64748B]">Next billing date</dt>
              <dd className="text-right font-semibold text-[#1E254A]">
                {formatDate(subscription.next_billing_date)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#64748B]">Category</dt>
              <dd className="text-right font-semibold text-[#1E254A]">
                {formatCategoryLabel(subscription.category)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#64748B]">Card</dt>
              <dd className="text-right font-semibold text-[#1E254A]">{renderCardInfo(subscription.cards)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#64748B]">Status</dt>
              <dd className="text-right font-semibold text-[#1E254A]">
                {isPaused ? "Paused" : "Active"}
              </dd>
            </div>
            <div className="flex flex-col gap-1 border-t border-[#F1F5F9] pt-3">
              <dt className="text-[#64748B]">Notes</dt>
              <dd className="whitespace-pre-wrap text-[#1E254A]">
                {subscription.notes?.trim() ? subscription.notes : "No notes added"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-[#E2E8F0] bg-white px-5 py-4 md:px-6">
          <Link
            href={editHref}
            scroll={false}
            className="inline-flex items-center justify-center rounded-lg bg-[#1FA168] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleTogglePause}
            disabled={isPending}
            className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isPaused
                ? "border-[#1FA168] bg-[#1FA168] text-white hover:opacity-95"
                : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {isPending
              ? isPaused
                ? "Resuming..."
                : "Pausing..."
              : isPaused
                ? "Resume subscription"
                : "Pause subscription"}
          </button>
          <DeleteSubscriptionButton subscriptionId={subscription.id} subscriptionName={subscription.name} />
        </div>
      </div>
    </div>
  );
}
