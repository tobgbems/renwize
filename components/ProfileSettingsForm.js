"use client";

import { useState, useTransition } from "react";
import { updateProfileSettings } from "@/lib/actions/updateProfileSettings";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#1E254A] shadow-sm outline-none transition placeholder:text-[#94A3B8] focus:border-[#1FA168] focus:ring-2 focus:ring-[#1FA168]/20";

const labelClass = "block text-sm font-semibold text-[#1E254A]";

export default function ProfileSettingsForm({ initialName, initialPhoneNumber, email }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await updateProfileSettings(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      if (result?.success) {
        setSuccess(result.success);
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

      {success ? (
        <div
          className="rounded-xl border border-[#86EFAC] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#166534]"
          role="status"
        >
          {success}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={80}
            autoComplete="name"
            defaultValue={initialName}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone_number" className={labelClass}>
            Phone number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            autoComplete="tel"
            defaultValue={initialPhoneNumber}
            placeholder="e.g. +234 801 234 5678"
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-[#64748B]">
            Used for SMS and WhatsApp reminders on your Pro plan.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          readOnly
          className={`${inputClass} cursor-not-allowed bg-[#F8FAFC] text-[#64748B]`}
        />
      </div>

      <div className="flex justify-end border-t border-[#F1F5F9] pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-xl bg-[#1FA168] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#1FA168]/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
