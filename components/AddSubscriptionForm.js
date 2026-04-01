"use client";

import { useState, useTransition } from "react";
import { createSubscription } from "@/lib/actions/createSubscription";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#1E254A] shadow-sm outline-none transition placeholder:text-[#94A3B8] focus:border-[#1FA168] focus:ring-2 focus:ring-[#1FA168]/20";

const labelClass = "block text-sm font-semibold text-[#1E254A]";

/**
 * Add-subscription form — calls the server action on submit.
 * Uses onSubmit + useTransition instead of useActionState to avoid Turbopack HMR races
 * ("Router action dispatched before initialization") seen with dev fast refresh.
 */
export default function AddSubscriptionForm() {
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setError(null);

    startTransition(async () => {
      const result = await createSubscription(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div
          className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#E8203B]"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div>
        <label htmlFor="name" className={labelClass}>
          Subscription name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="off"
          placeholder="e.g. Netflix"
          className={inputClass}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="amount" className={labelClass}>
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="currency" className={labelClass}>
            Currency
          </label>
          <select id="currency" name="currency" defaultValue="USD" className={inputClass}>
            <option value="USD">USD</option>
            <option value="NGN">NGN</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="KES">KES</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="billing_cycle" className={labelClass}>
            Billing cycle
          </label>
          <select id="billing_cycle" name="billing_cycle" defaultValue="monthly" className={inputClass}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label htmlFor="next_billing_date" className={labelClass}>
            Next billing date
          </label>
          <input id="next_billing_date" name="next_billing_date" type="date" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Category
        </label>
        <select id="category" name="category" defaultValue="streaming" className={inputClass}>
          <option value="streaming">Streaming</option>
          <option value="saas">SaaS</option>
          <option value="fitness">Fitness</option>
          <option value="finance">Finance</option>
          <option value="utilities">Utilities</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes <span className="font-normal text-[#64748B]">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Anything you want to remember about this subscription…"
          className={`${inputClass} resize-y min-h-[100px]`}
        />
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[#1E254A]">
          <input
            id="remind_to_cancel"
            name="remind_to_cancel"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#1FA168] focus:ring-[#1FA168]/30"
          />
          <span>
            <span className="block font-semibold">Remind to cancel</span>
            <span className="block text-[#64748B]">
              Useful for free trials or temporary subscriptions you plan to stop.
            </span>
          </span>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#F1F5F9] pt-6 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-xl bg-[#1FA168] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#1FA168]/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save subscription"}
        </button>
      </div>
    </form>
  );
}
