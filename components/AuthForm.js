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
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#dadce0] bg-white px-4 py-2 font-semibold text-[#3c4043] transition hover:border-[#c7c9cc] hover:shadow-sm"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.58-5.14 3.58-8.64z"
            fill="#4285F4"
          />
          <path
            d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.86-3c-1.08.72-2.46 1.15-4.08 1.15-3.13 0-5.78-2.11-6.72-4.95H1.3v3.1A12 12 0 0 0 12 24z"
            fill="#34A853"
          />
          <path
            d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.3a12 12 0 0 0 0 10.76l3.98-3.1z"
            fill="#FBBC05"
          />
          <path
            d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.3 6.62l3.98 3.1c.94-2.84 3.59-4.95 6.72-4.95z"
            fill="#EA4335"
          />
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );
}
