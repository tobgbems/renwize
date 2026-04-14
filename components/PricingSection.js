"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Monthly / yearly toggle with distinct Free (white) vs Pro (Sea Green) cards.
 */
export default function PricingSection() {
  const [billing, setBilling] = useState("monthly");

  const proMonthlyLabel = "₦2,000";
  const proYearlyLabel = "₦20,000";

  return (
    <section id="pricing" className="container-width mx-auto px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#1E254A] sm:text-4xl">Pricing</h2>
        <p className="mx-auto mt-3 max-w-xl text-[#64748B]">
          Start free. Upgrade when you want SMS and WhatsApp reminders.
        </p>

        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#E2E8F0] bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              billing === "monthly"
                ? "bg-[#1E254A] text-white"
                : "text-[#64748B] hover:text-[#1E254A]"
            }`}
          >
            Monthly
          </button>
          <div className="flex items-center gap-2 pr-1">
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                billing === "yearly"
                  ? "bg-[#1E254A] text-white"
                  : "text-[#64748B] hover:text-[#1E254A]"
              }`}
            >
              Yearly
            </button>
            <span className="hidden rounded-full bg-[#1FA168]/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#1FA168] sm:inline">
              Save 2 months
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs text-[#64748B] sm:hidden">Yearly — Save 2 months</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2 md:gap-8">
        {/* Free — white card */}
        <article className="flex flex-col rounded-2xl border-2 border-[#E2E8F0] bg-white p-8 shadow-sm transition hover:border-[#CBD5E1]">
          <p className="text-sm font-bold uppercase tracking-wide text-[#1FA168]">Free</p>
          <p className="mt-4 flex items-baseline gap-1">
            <span className="text-5xl font-bold text-[#1E254A]">₦0</span>
            <span className="text-[#64748B]">/month</span>
          </p>
          <p className="mt-2 text-sm text-[#64748B]">Email reminders, forever.</p>
          <ul className="mt-6 flex-1 space-y-3 text-[#334155]">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1FA168]" />
              Email reminders before renewals
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1FA168]" />
              Unlimited subscriptions
            </li>
          </ul>
          <Link
            href="/auth"
            className="mt-8 block w-full rounded-xl border-2 border-[#1E254A] py-3 text-center text-sm font-bold text-[#1E254A] transition hover:bg-[#1E254A] hover:text-white"
          >
            Get started free
          </Link>
        </article>

        {/* Pro — Sea Green */}
        <article className="relative flex flex-col overflow-hidden rounded-2xl bg-[#1FA168] p-8 text-white shadow-[0_24px_60px_-12px_rgba(31,161,104,0.45)] ring-1 ring-white/20">
          <p className="text-sm font-bold uppercase tracking-wide text-white/90">Pro</p>
          <p className="mt-4 flex items-baseline gap-1">
            <span className="text-5xl font-bold">
              {billing === "monthly" ? proMonthlyLabel : proYearlyLabel}
            </span>
            <span className="text-white/80">
              {billing === "monthly" ? "/month" : "/year"}
            </span>
          </p>
          {billing === "yearly" ? (
            <p className="mt-2 text-sm text-white/90">Billed annually — save vs paying monthly.</p>
          ) : (
            <p className="mt-2 text-sm text-white/90">SMS + WhatsApp reminders are included on Pro.</p>
          )}
          <ul className="mt-6 flex-1 space-y-3 text-white/95">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
              Everything in Free
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
              SMS reminders
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
              WhatsApp reminders
            </li>
          </ul>
          <Link
            href={
              billing === "yearly"
                ? "/api/payments/initiate?billing=yearly"
                : "/api/payments/initiate"
            }
            className="mt-8 block w-full rounded-xl bg-white py-3 text-center text-sm font-bold text-[#1FA168] transition hover:bg-[#ECFDF3]"
          >
            Upgrade to Pro
          </Link>
        </article>
      </div>
    </section>
  );
}
