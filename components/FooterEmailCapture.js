"use client";

import { useState } from "react";

/**
 * Simple newsletter-style capture — client-side only for Stage 1 (no backend).
 */
export default function FooterEmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="border-b border-[#E2E8F0] bg-[#FAFBFC] py-10">
      <div className="container-width mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h3 className="text-lg font-bold text-[#1E254A]">Join the list</h3>
          <p className="mt-2 text-sm text-[#64748B]">
            Get product updates and tips for managing subscriptions—no spam.
          </p>
          {submitted ? (
            <p className="mt-4 text-sm font-semibold text-[#1FA168]">
              Thanks! We&apos;ll be in touch with updates.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-center"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email for updates
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="min-h-[44px] flex-1 rounded-xl border border-[#E2E8F0] bg-white px-4 text-[#1E254A] shadow-sm outline-none ring-[#1FA168]/0 transition focus:border-[#1FA168] focus:ring-2 focus:ring-[#1FA168]/25 sm:max-w-sm"
              />
              <button
                type="submit"
                className="min-h-[44px] shrink-0 rounded-xl bg-[#1FA168] px-6 font-semibold text-white transition hover:opacity-95"
              >
                Notify me
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
