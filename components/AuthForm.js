"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isSignup) {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Sign up failed.");
        }
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid email or password.");
      }

      window.location.href = "/dashboard";
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="mb-6 flex rounded-lg bg-[#F1F5F9] p-1 text-sm font-semibold">
        <button
          className={`flex-1 rounded-md px-4 py-2 ${
            isSignup ? "bg-white text-[#1E254A] shadow-sm" : "text-[#64748B]"
          }`}
          onClick={() => setIsSignup(true)}
          type="button"
        >
          Sign Up
        </button>
        <button
          className={`flex-1 rounded-md px-4 py-2 ${
            !isSignup ? "bg-white text-[#1E254A] shadow-sm" : "text-[#64748B]"
          }`}
          onClick={() => setIsSignup(false)}
          type="button"
        >
          Log In
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isSignup ? (
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-[#1E254A]">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required={isSignup}
              className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 outline-none focus:border-[#1FA168]"
            />
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#1E254A]">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 outline-none focus:border-[#1FA168]"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <label htmlFor="password" className="block text-sm font-medium text-[#1E254A]">
              Password
            </label>
            {!isSignup ? (
              <Link
                href="/auth/forgot-password"
                className="text-sm font-semibold text-[#1FA168] hover:underline"
              >
                Forgot password?
              </Link>
            ) : null}
          </div>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 outline-none focus:border-[#1FA168]"
          />
        </div>

        {error ? <p className="text-sm text-[#E8203B]">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[#1FA168] px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Please wait..." : isSignup ? "Create Account" : "Log In"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-[#64748B]">
        <div className="h-px flex-1 bg-[#E2E8F0]" />
        <span>OR</span>
        <div className="h-px flex-1 bg-[#E2E8F0]" />
      </div>

      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        type="button"
        className="w-full rounded-lg border border-[#CBD5E1] px-4 py-2 font-semibold text-[#1E254A] transition hover:bg-[#F8FAFC]"
      >
        Continue with Google
      </button>
    </div>
  );
}
