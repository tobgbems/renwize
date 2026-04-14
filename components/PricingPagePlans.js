"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Interactive plan cards for /pricing (monthly vs yearly Pro). Free tier shown in ₦.
 */
export default function PricingPagePlans() {
  const [billing, setBilling] = useState("monthly");

  return (
    <>
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-3 rounded-full border border-[#E2E8F0] bg-white p-1.5 shadow-sm">
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
        </div>
        <p className="text-xs text-[#64748B]">Pro yearly — save vs paying monthly</p>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#1FA168]">Free</h2>
          <p className="mt-4 flex items-baseline gap-1">
            <span className="text-5xl font-bold text-[#1E254A]">₦0</span>
            <span className="text-[#64748B]">/month</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-[#334155]">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1FA168]" />
              Email reminders
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1FA168]" />
              Unlimited subscriptions
            </li>
          </ul>
          <button
            type="button"
            disabled
            className="mt-8 w-full cursor-default rounded-xl border border-[#1E254A] py-3 text-sm font-bold text-[#1E254A]"
          >
            Current plan
          </button>
        </article>

        <article className="flex flex-col rounded-2xl bg-[#1FA168] p-8 text-white shadow-[0_20px_50px_-14px_rgba(31,161,104,0.55)]">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white/90">Pro</h2>
          <p className="mt-4 flex items-baseline gap-1">
            <span className="text-5xl font-bold">
              {billing === "monthly" ? "₦2,000" : "₦20,000"}
            </span>
            <span className="text-white/80">{billing === "monthly" ? "/month" : "/year"}</span>
          </p>
          <p className="mt-2 text-sm text-white/90">
            {billing === "yearly"
              ? "One-time payment per year via Paystack (not an auto-renewing Paystack plan)."
              : "One-time payment per month via Paystack (not an auto-renewing Paystack plan)."}
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-white/95">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
              Everything in Free
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
              SMS reminders
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
              WhatsApp reminders
            </li>
          </ul>
          <Link
            href={
              billing === "yearly"
                ? "/api/payments/initiate?billing=yearly"
                : "/api/payments/initiate"
            }
            className="mt-8 inline-block w-full rounded-xl bg-white py-3 text-center text-sm font-bold text-[#1FA168] transition hover:bg-[#ECFDF3]"
          >
            Upgrade to Pro
          </Link>
        </article>
      </section>
    </>
  );
}
