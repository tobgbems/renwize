"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setMessage(data.message || "If an account exists for that email, we sent password reset instructions.");
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="forgot-email" className="mb-1 block text-sm font-medium text-[#1E254A]">
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 outline-none focus:border-[#1FA168]"
          />
        </div>

        {error ? <p className="text-sm text-[#E8203B]">{error}</p> : null}
        {message ? <p className="text-sm text-[#1FA168]">{message}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[#1FA168] px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Please wait..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#64748B]">
        <Link href="/auth" className="font-semibold text-[#1FA168] hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
