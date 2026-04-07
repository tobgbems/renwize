"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordForm({ initialToken }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!initialToken) {
      setError("This reset link is missing a token. Open the link from your email again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: initialToken, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not reset password.");
      }
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialToken) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <p className="text-sm text-[#64748B]">
          This reset link is invalid or incomplete. Request a new link from the sign-in page.
        </p>
        <p className="mt-4 text-center text-sm">
          <Link href="/auth/forgot-password" className="font-semibold text-[#1FA168] hover:underline">
            Forgot password
          </Link>
          {" · "}
          <Link href="/auth" className="font-semibold text-[#1FA168] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-[#1E254A]">Your password has been updated.</p>
        <p className="mt-2 text-sm text-[#64748B]">You can sign in with your new password now.</p>
        <p className="mt-6 text-center">
          <Link
            href="/auth"
            className="inline-flex w-full justify-center rounded-lg bg-[#1FA168] px-4 py-2 font-semibold text-white transition hover:opacity-90"
          >
            Go to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reset-password" className="mb-1 block text-sm font-medium text-[#1E254A]">
            New password
          </label>
          <input
            id="reset-password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 outline-none focus:border-[#1FA168]"
          />
        </div>
        <div>
          <label htmlFor="reset-confirm" className="mb-1 block text-sm font-medium text-[#1E254A]">
            Confirm password
          </label>
          <input
            id="reset-confirm"
            type="password"
            name="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 outline-none focus:border-[#1FA168]"
          />
        </div>

        {error ? <p className="text-sm text-[#E8203B]">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[#1FA168] px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Please wait..." : "Update password"}
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
